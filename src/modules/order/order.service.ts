import { Inject, Injectable, NotFoundException } from "@nestjs/common"
import { CreateOrderDto } from "./dtos/create-order.dto";
import { Order, OrderItem } from "./entities/order.entity";
import { MongoRepository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderStatusEnum } from "./enums/orderStatus.enum";
import { Pagination } from "src/common/types/pagination";
import { ObjectId } from "mongodb";
import { UserService } from "../User/user.service";
import { RolesEnum } from "../User/enums/role.enum";
import { SearchOrderDto } from "./dtos/search-order.dto";
import { Product, ProductVariant } from "../product/entities/product.entity";
import { ProductService } from "../product/product.service";

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(Order) private readonly orderRepository: MongoRepository<Order>,
            private readonly userService: UserService,
            private readonly productService:ProductService,
            @InjectRepository(Product) private readonly productRepo:MongoRepository<Product>,
           @InjectRepository(ProductVariant) private readonly productVariantRepo:MongoRepository<ProductVariant>
        ) { }

    public async createOrder(userId: string, createOrderDto: CreateOrderDto) {
        const totalQuantity = this.getTotalQuantity(createOrderDto.items)
        const totalAmount = this.getTotalAmount(createOrderDto.items)

        const order = this.orderRepository.create(
            {
                userId,
                items: createOrderDto.items,
                billingAddress: createOrderDto.billing_address,
                shippingAddress: createOrderDto.shipping_address,
                total: totalAmount,
                subTotal: totalAmount,
                totalQuantity,
                responsible:RolesEnum.ADMIN
            })

        return await this.orderRepository.save(order)

    }


    public async updateOrderStatus(orderId: ObjectId, status: OrderStatusEnum) {
        const order = await this.orderRepository.findOne({ where: { _id: orderId } })

        if (!order) {
            throw new NotFoundException("order not found")
        }

        return await this.orderRepository.update(order._id, { status })
    }



    async getOrders(userId: ObjectId, searchOrderDto: SearchOrderDto, pagination: Pagination) {
        const status = searchOrderDto.status ?? "processing"
        const orderBy = searchOrderDto.order ?? "desc"
        const sortBy = searchOrderDto.sortBy ?? "createdAt"
        const page = pagination.page ?? 1
        const limit = pagination.limit ?? 20

        const skip = (page - 1) * limit

        const orders = await this.orderRepository.find({ where: { status, userId }, order: { [sortBy]: orderBy }, take: limit, skip })

       const mappedOrderDetails =  orders.flatMap(async order => {
            const mappedOrder =  await this.getOrderDetails(userId,order._id)

            return {...order,...mappedOrder}
        })

        return await Promise.all(mappedOrderDetails)
    }

    public async getOrdersByStatus(userId: ObjectId, status: OrderStatusEnum, pagination: Pagination) {

        const user = await this.userService.findOne(new ObjectId(userId))

        if (!user) {
            throw new NotFoundException("user not found")
        }

        const skip = (pagination.page - 1) * pagination.limit

        const whereCondition = {
            status,
            ...(user.role === RolesEnum.ADMIN ? {responsible:RolesEnum.ADMIN} : { userId: user._id })
        }

        const orders = await this.orderRepository.find({ where: whereCondition, skip, take: pagination.limit, order:{createdAt:"DESC"} })

        return orders

    }

    async getOrderDetails(userId:ObjectId, orderId: ObjectId) {
        const order = await this.orderRepository.findOne({ where: { _id: orderId } })

        if(!order){
            throw new NotFoundException("Order not found")
        }


        const mappedItems = order.items.map( async item => {
            const itemDetails = await this.productRepo.findOne({where:{_id:new ObjectId(item.product)}})
            const variant = await this.productVariantRepo.findOne({where:{_id:new ObjectId(item.variant)}})

            return {product:itemDetails, variant:variant, quantity:item.quantity, price:item.price}
        })

        

        return   {...order,items: await Promise.all(mappedItems), }
    }


    private getTotalQuantity(items: OrderItem[]) {
        return items.reduce((pre, item) => pre + item.quantity, 0)
    }

    private getTotalAmount(items: OrderItem[]) {
        return items.reduce((pre, item) => pre + (item.quantity * item.price), 0)
    }

    async updateStatus(orderId: ObjectId, status: OrderStatusEnum) {
        const order = await this.orderRepository.findOne({ where: { _id: orderId } })

        if (!order) {
            throw new NotFoundException("order not found")
        }

        if(status === OrderStatusEnum.Completed){
            await this.userService.updateUserPoint(new ObjectId(order.userId),Math.floor(order.total))
        }

        return await this.orderRepository.update({ _id: order._id }, { status })
    }

}