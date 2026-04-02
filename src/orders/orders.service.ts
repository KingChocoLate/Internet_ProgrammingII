import { Injectable } from '@nestjs/common';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_SERVICE') private client: ClientProxy,
    private readonly notifications: NotificationsService,
   ) {}

   createOrder(orderDto: any) {
     this.client.emit('order_created', { order: orderDto, createdAt:new Date().toISOString()});
     this.notifications.notify('order_created', {
       order: orderDto,
     });

     return { status: 'Order Accepted', order: orderDto };
   }
}
