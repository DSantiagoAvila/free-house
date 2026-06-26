import { DataSource } from 'typeorm';
import { Category } from '../../modules/categories/entities/category.entity';
import { Contact, ContactType } from '../../modules/contacts/entities/contact.entity';
import { Product, ProductStatus } from '../../modules/products/entities/product.entity';
import { ProductImage } from '../../modules/products/entities/product-image.entity';
import { ProductVariant } from '../../modules/products/entities/product-variant.entity';

export async function runInitialSeed(dataSource: DataSource): Promise<void> {
  const categoryRepo = dataSource.getRepository(Category);
  const contactRepo = dataSource.getRepository(Contact);
  const productRepo = dataSource.getRepository(Product);

  // Categories
  const camisetas = categoryRepo.create({ name: 'Camisetas', slug: 'camisetas', description: 'Camisetas y polos para hombre' });
  const pantalones = categoryRepo.create({ name: 'Pantalones', slug: 'pantalones', description: 'Pantalones y jeans para hombre' });
  const accesorios = categoryRepo.create({ name: 'Accesorios', slug: 'accesorios', description: 'Accesorios masculinos' });
  await categoryRepo.save([camisetas, pantalones, accesorios]);

  // Contacts
  await contactRepo.save([
    contactRepo.create({ type: ContactType.WHATSAPP, value: '+573001234567', label: 'WhatsApp Free House', isActive: true }),
    contactRepo.create({ type: ContactType.INSTAGRAM, value: '@freehouse', label: 'Instagram Free House', isActive: true }),
  ]);

  // Sample products
  const polo = productRepo.create({
    name: 'Polo Clásico Negro',
    slug: 'polo-clasico-negro',
    description: 'Polo de algodón premium, corte slim fit. Perfecto para cualquier ocasión.',
    price: 89900,
    comparePrice: 120000,
    sku: 'FH-POLO-001',
    status: ProductStatus.ACTIVE,
    categoryId: camisetas.id,
    images: [
      { url: 'https://placehold.co/600x800/1a1a1a/f0ece4?text=Polo+Negro', altText: 'Polo Clásico Negro', isPrimary: true, sortOrder: 0 } as ProductImage,
    ],
    variants: [
      { size: 'S', color: 'Negro', stockQuantity: 10, sku: 'FH-POLO-001-S-NEG' } as ProductVariant,
      { size: 'M', color: 'Negro', stockQuantity: 3, sku: 'FH-POLO-001-M-NEG' } as ProductVariant,
      { size: 'L', color: 'Negro', stockQuantity: 0, sku: 'FH-POLO-001-L-NEG' } as ProductVariant,
    ],
  });

  await productRepo.save(polo);

  console.log('Seed completed successfully.');
}
