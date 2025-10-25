import { Injectable } from "@nestjs/common";
import { PaymentProvider } from "./PaymentProvider.provider";
import { UserService } from "src/modules/User/user.service";


@Injectable()
export class StripePaymentProvider  extends PaymentProvider{

    constructor (private readonly userService:UserService){
        super()
    }

    async initializePaymentSession(userId:string,amount: number, currency: string, success_url:string, cancel_url:string, data?:any){
      const customer = await this.createCustomer(userId)
      console.log(data)

    //     const session = await this.stripe.checkout.sessions.create({
    //       customer:customer.id,
    //       payment_method_types:["card"],
    //       mode:"payment",
    //         line_items:[{
    //           price_data:{currency:currency,product_data:{name:"Simple Product"},
    //           unit_amount:amount * 100
    //         },
    //       quantity:1,
    //     }],
    //     metadata:data,
    //     success_url:success_url,
    //     cancel_url:cancel_url,
    //   })
  
    //   return session

    }

    async createCustomer (userId:string){

    // const user = await userService.getUserDetails(userId)
    // if(user.customerId){
    //   return await this.stripe.customers.retrieve(user.customerId)
    // }

    // let email = user.email
    // let name = user.firstName+' '+user.lastName

    // const customer = await this.stripe.customers.create({email,name,metadata:{userId:user.id}})

    // await prisma.user.update({where:{id:userId}, data:{customerId: customer.id}})
    // return customer
  }

}