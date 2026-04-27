import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { prisma } from './db';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get all products (Example API)
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: true,
      },
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create a product
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, category, basePrice } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        basePrice,
      },
    });
    res.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // We also need to delete the variants first or cascade delete.
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    await prisma.product.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, basePrice } = req.body;
    const product = await prisma.product.update({
      where: { id },
      data: { name, description, category, basePrice },
    });
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        orderItems: { include: { variant: { include: { product: true } } } }
      }
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
