import {
  Entity,
  Column,
  BeforeInsert,
  ManyToOne,
  ManyToMany,
  JoinTable,
  AfterLoad,
  OneToMany,
} from 'typeorm';
import { classToPlain } from 'class-transformer';
import * as slugify from 'slug';
import { AbstractEntity } from './abstract-entity';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  body: string;

  @ManyToMany(
    () => UserEntity,
    user => user.favorites,
    { eager: true },
  )
  @JoinTable()
  favoritedBy: UserEntity[];

  favoritesCount: number;
  @AfterLoad()
  async countFavorites() {
    const { fav } = await ArticleEntity.createQueryBuilder('favorites')
      .where('favorites.id = :id', { id: this.id })
      .select('COUNT(*)', 'fav')
      .getRawOne();

    const countFavorites = JSON.parse(fav);
    this.favoritesCount = countFavorites;
  }

  @OneToMany(
    () => CommentEntity,
    comment => comment.article,
  )
  comments: CommentEntity[];

  // many article to one user
  @ManyToOne(
    () => UserEntity,
    user => user.articles,
    { eager: true },
  )
  author: UserEntity;

  @Column('simple-array')
  tagList: string[];

  @BeforeInsert()
  generateSlug() {
    this.slug =
      slugify(this.title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  toJSON() {
    return classToPlain(this);
  }

  toArticle(user?: UserEntity) {
    let favorited = null;
    if (user) {
      favorited = this.favoritedBy.map(user => user.id).includes(user.id);
    }
    const article: any = this.toJSON();
    delete article.favoritedBy;
    return { ...article, favorited };
  }
}
