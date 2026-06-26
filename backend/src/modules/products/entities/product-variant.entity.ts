import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from './product.entity';

export enum InventoryStatus {
  AVAILABLE = 'available',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
}

export const LOW_STOCK_THRESHOLD = 5;

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_id' })
  @Index()
  productId: number;

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ length: 50, nullable: true })
  size: string;

  @Column({ length: 100, nullable: true })
  color: string;

  @Column({ name: 'stock_quantity', default: 0 })
  stockQuantity: number;

  @Column({ name: 'reserved_qty', default: 0 })
  reservedQty: number;

  @Column({ unique: true, length: 100, nullable: true })
  sku: string;

  @Column({ name: 'price_override', type: 'decimal', precision: 10, scale: 2, nullable: true })
  priceOverride: number;

  @Column({
    name: 'inventory_status',
    type: 'enum',
    enum: InventoryStatus,
    default: InventoryStatus.OUT_OF_STOCK,
  })
  inventoryStatus: InventoryStatus;

  get effectivePrice(): number {
    return this.priceOverride ?? this.product?.price;
  }

  computeInventoryStatus(): InventoryStatus {
    if (this.stockQuantity === 0) return InventoryStatus.OUT_OF_STOCK;
    if (this.stockQuantity <= LOW_STOCK_THRESHOLD) return InventoryStatus.LOW_STOCK;
    return InventoryStatus.AVAILABLE;
  }
}
