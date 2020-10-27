import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseObject } from './models/response.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/tags')
  async findTags(): Promise<ResponseObject<'tags', string[]>> {
    const tags = await this.appService.findTags();
    return { tags };
  }
}
