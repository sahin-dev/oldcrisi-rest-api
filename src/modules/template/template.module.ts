import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Template } from './entities/template.entity';
import { TemplateController } from './template.controller';
import { TeamplateService } from './template.service';

@Module({
    imports:[TypeOrmModule.forFeature([Template])],
    controllers:[TemplateController],
    providers:[TeamplateService]
})
export class TemplateModule {}
