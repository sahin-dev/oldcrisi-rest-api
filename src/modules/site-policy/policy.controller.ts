import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { CreatePolicyDto } from "./dtos/create-policy.dto";
import { PolicyService } from "./policy.service";
import { PolicyEnum } from "./enums/PolicyEnum";
import { Roles } from "src/common/decorators/role.decorator";

@Controller("policies/")

export class PolicyController{

    constructor (private readonly policyService:PolicyService){}

    @Post()
    @Roles("admin")
    async addPolicy( @Body() createPolicyDto:CreatePolicyDto){
        const createdPolicy = await this.policyService.addSitePolicy(createPolicyDto.content, createPolicyDto.type)

        return createdPolicy

    }

    @Patch()
    @Roles("admin")
    async updatePolicy(@Body() updatePolicyDto: CreatePolicyDto){
        const updatedPolicy = await this.policyService.updateSitePolicy(updatePolicyDto.type, updatePolicyDto.content)

        return updatedPolicy
    }

    @Get()
    async getPolicies(){
        const terms = await this.policyService.getPolicy(PolicyEnum.terms)
        const policy = await this.policyService.getPolicy(PolicyEnum.policy)

        return {terms, policy}
    }

    @Get(':type')
    async getPolicy  (@Param('type') type:PolicyEnum){
        const policy = await this.policyService.getPolicy(type)

        return policy
    }
   

}