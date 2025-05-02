import { Body, Controller, Get, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { createCartDto, updateCartDto } from './dto/createCart.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserDocument } from 'src/DB/models';
import { Auth } from 'src/common/guards/auth';
import { rolesTypes } from 'src/common/Types/types';
import { Types } from 'mongoose';

@Controller('cart')
export class CartController {
    constructor( private readonly CS: CartService ) {}
    // --------------------------------- add to cart ------------------------------
    @Post()
    @Auth(rolesTypes.user,rolesTypes.admin)
    @UsePipes(new ValidationPipe({}))
    async addToCart(@Body() body:createCartDto,@User() user:UserDocument) {
        return this.CS.addToCart(body,user);
    }

    // --------------------------------- update cart ------------------------------
    @Patch()
    @Auth(rolesTypes.user,rolesTypes.admin)
    async updateCart(@Body() body:updateCartDto,@User() user:UserDocument) {
        return this.CS.updateCart(body,user);
    }
    
    // ------------------------- delete product from cart -------------------------
    @Patch()
    @Auth(rolesTypes.user,rolesTypes.admin)
    async deleteProductFromCart(@User() user:UserDocument,@Body() body:{productId:Types.ObjectId}) {
        return this.CS.deleteProductFromCart(user,body);
    }
    
    // ---------------------------------- get cart --------------------------------
    @Get()
    @Auth(rolesTypes.user,rolesTypes.admin)
    async getCart(@User() user:UserDocument) {
        return this.CS.getCart(user);
    }

    // ---------------------------------- clear cart ----------------------------------
    @Patch("clear")
    @Auth(rolesTypes.user,rolesTypes.admin)
    @UsePipes(new ValidationPipe({}))
    async clearCart(@User() user:UserDocument) {
        return this.CS.clearCart(user);
    }
}
