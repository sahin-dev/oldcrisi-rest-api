import { Injectable, NotFoundException } from "@nestjs/common";
import { MongoRepository } from "typeorm";
import { Policy } from "./entities/policy.entity";
import { PolicyEnum } from "./enums/PolicyEnum";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PolicyService{

    constructor(@InjectRepository(Policy) private readonly policyRepo:MongoRepository<Policy>){}

    async addSitePolicy(content:string, type:PolicyEnum){
        const createdPolicy = this.policyRepo.create({content, type})

        return await this.policyRepo.save(createdPolicy)
    }

    async updateSitePolicy(type:PolicyEnum, content:string){
        const policy = await this.policyRepo.findOne({where:{type}})
        if(!policy){
            return await this.addSitePolicy(content, type)
        }
        policy.content = content
        return await this.policyRepo.save(policy)
    }

    async getPolicy(type:PolicyEnum){
        const policy = await this.policyRepo.findOne({where:{type}})

        if(!policy){
            return "empty"
        }

        return policy
    }

}