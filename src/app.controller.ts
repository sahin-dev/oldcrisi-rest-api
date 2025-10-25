import { Controller, Get, Req } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';
import { EnablePagination } from './common/decorators/pagination.decorator';
import type { Request } from 'express';


@Controller('/')
export class AppController{

  @Public()
  @Get()
  @EnablePagination()
  getHello(@Req() request:Request): string {

    console.log(request.query)

    return 'OLDCRISIS API is running';
  }

 
}
