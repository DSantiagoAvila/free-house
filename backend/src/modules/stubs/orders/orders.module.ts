import { Module } from '@nestjs/common';

/**
 * OrdersModule — Future: order creation, status tracking, order history.
 * Depends on: ProductsModule (stock decrement), UsersModule, PaymentsModule.
 * Dependency direction: OrdersModule → ProductsModule (never reverse).
 */
@Module({})
export class OrdersModule {}
