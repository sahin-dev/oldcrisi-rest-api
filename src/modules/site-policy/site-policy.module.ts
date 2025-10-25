import { Module } from '@nestjs/common';
import { PolicyController } from './policy.controller';
import { PolicyService } from './policy.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Policy } from './entities/policy.entity';

@Module({
    imports:[TypeOrmModule.forFeature([Policy])],
    controllers:[PolicyController],
    providers:[PolicyService]
})
export class SitePolicyModule {}
