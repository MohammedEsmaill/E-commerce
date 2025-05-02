import { Body, Controller, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { createOrderDto } from './dto/createOrder.dto';
import { Auth } from 'src/common/guards/auth';
import { rolesTypes } from 'src/common/Types/types';
import { UserDocument } from 'src/DB/models';
import { User } from 'src/common/decorators/user.decorator';
import { Types } from 'mongoose';

@Controller('order')
export class OrderController {
    constructor(private readonly OS: OrderService) {}
    // ---------------------------------- create order ----------------------------------
    @Post('create')
    @Auth(rolesTypes.user, rolesTypes.admin)
    @UsePipes(new ValidationPipe({}))
    async createOrder(@Body() body:createOrderDto,@User() user:UserDocument) {
        return await this.OS.createOrder(body,user);
    }
    // ---------------------------------- create payment ---------------------------------
    @Post('payment')
    @Auth(rolesTypes.user, rolesTypes.admin)
    @UsePipes(new ValidationPipe({}))
    async createPayment(@Body("orderId") orderId:Types.ObjectId,@User() user:UserDocument) {
        return await this.OS.createPaymentStripe(orderId,user);
    }
    // ---------------------------------- web hook ---------------------------------
    @Post('webHook')
    async webHook(@Body() data:any) {
        return await this.OS.webHookService(data);
    }

    // ---------------------------------- cancel order ---------------------------------
    @Put('cancel')
    @Auth(rolesTypes.user, rolesTypes.admin)
    @UsePipes(new ValidationPipe({}))
    async cancelOrder(@Body("orderId") orderId:Types.ObjectId,@User() user:UserDocument) {
        return await this.OS.cancelOrder(orderId,user);
    }
}
