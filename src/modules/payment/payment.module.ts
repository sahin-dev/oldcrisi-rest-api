import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { OrderModule } from '../order/order.module';
import { PaymentProvider } from './providers/PaymentProvider.provider';
import { StripePaymentProvider } from './providers/StripePayment.provider';

@Module({
    imports:[TypeOrmModule.forFeature([Payment]), OrderModule],
    controllers:[PaymentController],
    providers:[PaymentService, {
        provide:PaymentProvider,
        useClass:StripePaymentProvider
    }],
    exports:[PaymentService]

})
export class PaymentModule {}
