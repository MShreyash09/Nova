import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";
const pool = new Pool({ connectionString, max: 1 });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing existing data...');
  // Delete in reverse order of dependencies to avoid foreign key constraints
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding mock data...');

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@example.com',
      passwordHash: 'mock_hashed_password', // Just a mock string
      role: 'USER',
    },
  });

  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      passwordHash: 'mock_admin_password',
      role: 'ADMIN',
    },
  });

  // Create Products & Variants
  const product1 = await prisma.product.create({
    data: {
      name: 'Sony WH-1000XM5',
      description: 'Industry leading noise canceling wireless headphones.',
      category: 'Over-Ear',
      basePrice: 398.00,
      variants: {
        create: [
          { color: 'Black', sku: 'SONY-WH1000XM5-BLK', stockQuantity: 50 },
          { color: 'Silver', sku: 'SONY-WH1000XM5-SLV', stockQuantity: 30 },
        ],
      },
    },
    include: { variants: true }, // Include so we can use variant IDs later
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Apple AirPods Pro 2',
      description: 'Active Noise Cancellation and Personalized Spatial Audio.',
      category: 'In-Ear',
      basePrice: 249.00,
      variants: {
        create: [
          { color: 'White', sku: 'APPLE-APP2-WHT', stockQuantity: 100 },
        ],
      },
    },
    include: { variants: true },
  });

  const product3 = await prisma.product.create({
    data: {
      name: 'Bose QuietComfort Ultra',
      description: 'World-class noise cancellation, quieter than ever before.',
      category: 'Over-Ear',
      basePrice: 429.00,
      variants: {
        create: [
          { color: 'Black', sku: 'BOSE-QCU-BLK', stockQuantity: 40 },
          { color: 'White Smoke', sku: 'BOSE-QCU-WHT', stockQuantity: 25 },
        ],
      },
    },
  });

  // Create Reviews
  await prisma.review.create({
    data: {
      productId: product1.id,
      userId: user1.id,
      rating: 5,
      comment: 'Best headphones I have ever owned! The ANC is incredible.',
    },
  });
  
  await prisma.review.create({
    data: {
      productId: product2.id,
      userId: admin.id,
      rating: 4,
      comment: 'Very convenient and great sound quality, but battery life could be better.',
    },
  });

  // Create Orders & OrderItems
  const order1 = await prisma.order.create({
    data: {
      userId: user1.id,
      totalAmount: 398.00,
      orderStatus: 'DELIVERED',
      paymentStatus: 'PAID',
      orderItems: {
        create: [
          {
            variantId: product1.variants[0].id, // Sony WH-1000XM5 Black
            quantity: 1,
            lockedPrice: 398.00,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: admin.id,
      totalAmount: 498.00,
      orderStatus: 'PENDING',
      paymentStatus: 'UNPAID',
      orderItems: {
        create: [
          {
            variantId: product2.variants[0].id, // AirPods Pro 2 White
            quantity: 2,
            lockedPrice: 249.00,
          },
        ],
      },
    },
  });

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
