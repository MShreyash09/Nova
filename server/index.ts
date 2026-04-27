import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { prisma } from './db';
import { hashPassword, comparePassword, generateToken, authMiddleware } from './auth';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Razorpay instance
const rzpKeyId = process.env.RAZORPAY_KEY_ID || '';
const rzpKeySecret = process.env.RAZORPAY_KEY_SECRET || '';
console.log(`Razorpay Key ID loaded: ${rzpKeyId ? rzpKeyId.substring(0, 12) + '...' : '(EMPTY!)'}`);
console.log(`Razorpay Key Secret loaded: ${rzpKeySecret ? '***' + rzpKeySecret.slice(-4) : '(EMPTY!)'}`);

const razorpay = new Razorpay({
  key_id: rzpKeyId,
  key_secret: rzpKeySecret,
});

// ─────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ─────────────────────────────────────────────
// AUTH ROUTES
// ─────────────────────────────────────────────

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: { firstName, lastName, email, passwordHash },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// Get current user (protected)
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Auth me error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// ─────────────────────────────────────────────
// PRODUCT ROUTES
// ─────────────────────────────────────────────

// Get all products
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

// ─────────────────────────────────────────────
// USER ROUTES (admin)
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// ORDER ROUTES
// ─────────────────────────────────────────────

// Get all orders (admin)
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

// Create order + Razorpay order (protected)
app.post('/api/orders/create', authMiddleware, async (req, res) => {
  try {
    const { variantId, quantity } = req.body;
    const userId = req.userId!;

    if (!variantId || !quantity || quantity < 1) {
      res.status(400).json({ error: 'Variant and quantity are required' });
      return;
    }

    // Fetch the variant with product info to get the price
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      res.status(404).json({ error: 'Product variant not found' });
      return;
    }

    if (variant.stockQuantity < quantity) {
      res.status(400).json({ error: 'Insufficient stock' });
      return;
    }

    // Calculate total: use priceOverride if set, otherwise use basePrice
    const unitPrice = variant.priceOverride || variant.product.basePrice;
    const totalAmount = Number(unitPrice) * quantity;

    // Create Razorpay order (amount in paise for INR)
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    });

    // Create DB order
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        orderStatus: 'PENDING',
        paymentStatus: 'UNPAID',
        razorpayOrderId: razorpayOrder.id,
        orderItems: {
          create: [
            {
              variantId,
              quantity,
              lockedPrice: Number(unitPrice),
            },
          ],
        },
      },
      include: {
        orderItems: {
          include: { variant: { include: { product: true } } },
        },
      },
    });

    res.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      productName: variant.product.name,
      variantColor: variant.color,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Verify Razorpay payment (protected)
app.post('/api/orders/verify', authMiddleware, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      res.status(400).json({ error: 'Missing payment verification data' });
      return;
    }

    // Verify signature using HMAC SHA256
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      res.status(400).json({ error: 'Payment verification failed' });
      return;
    }

    // Update order as paid
    const order = await prisma.order.update({
      where: { razorpayOrderId },
      data: {
        paymentStatus: 'PAID',
        orderStatus: 'PROCESSING',
        razorpayPaymentId,
      },
    });

    // Decrease stock quantity
    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: order.id },
    });

    for (const item of orderItems) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: {
          stockQuantity: { decrement: item.quantity },
        },
      });
    }

    res.json({
      success: true,
      orderId: order.id,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// ─────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
