import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ProductVariant {
  id: string;
  color: string;
  sku: string;
  stockQuantity: number;
  priceOverride: string | null;
  product?: {
    name: string;
    basePrice: string;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  variants: ProductVariant[];
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

export default function PreOrderSection() {
  const { user, token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState("");
  const revealRef = useScrollReveal<HTMLElement>();

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          // Auto-select first variant if available
          if (data.length > 0 && data[0].variants.length > 0) {
            setSelectedVariant(data[0].variants[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Get all variants across all products
  const allVariants = products.flatMap((p) =>
    p.variants.map((v) => ({
      ...v,
      productName: p.name,
      productPrice: p.basePrice,
    }))
  );

  const selectedVariantData = allVariants.find((v) => v.id === selectedVariant);
  const unitPrice = selectedVariantData
    ? Number(selectedVariantData.priceOverride || selectedVariantData.productPrice)
    : 0;
  const totalPrice = unitPrice * quantity;

  const handlePayment = async () => {
    if (!user || !token) return;
    if (!selectedVariant) {
      setError("Please select a variant");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Step 1: Create order on server
      const orderResponse = await fetch(`${API_URL}/api/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          variantId: selectedVariant,
          quantity,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // Step 2: Open Razorpay Checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "NOVA Spatial Audio",
        description: `${orderData.productName} - ${orderData.variantColor}`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
        theme: {
          color: "#00b8d4",
          backdrop_color: "rgba(0, 0, 0, 0.8)",
        },
        handler: async function (response: any) {
          // Step 3: Verify payment on server
          try {
            const verifyResponse = await fetch(`${API_URL}/api/orders/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              setOrderSuccess(true);
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            setError("Payment verification failed. Please contact support.");
          }
          setIsProcessing(false);
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        setError(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      razorpay.open();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setIsProcessing(false);
    }
  };

  // Success state
  if (orderSuccess) {
    return (
      <section id="preorder" className="py-32">
        <div className="container mx-auto px-6 max-w-lg text-center">
          <div className="glass-strong rounded-3xl p-12">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Order <span className="text-gradient-cyan">Confirmed!</span>
            </h2>
            <p className="text-muted-foreground font-body mb-2">
              Thank you, <span className="text-primary">{user?.firstName}</span>! Your payment was successful.
            </p>
            <p className="text-muted-foreground/60 font-body text-sm">
              We'll send order details to <span className="text-primary">{user?.email}</span>.
              Expected shipping: Q3 2026.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="preorder" ref={revealRef} className="py-32">
      <div className="container mx-auto px-6 max-w-lg">
        <div data-reveal="up" className="text-center mb-12">
          <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-4">
            Limited Edition
          </p>
          <h2 className="font-heading text-5xl font-bold text-foreground">
            Reserve <span className="text-gradient-cyan">Yours</span>
          </h2>
          <p className="text-muted-foreground font-body mt-4">
            Secure your NOVA headphones today. Ships Q3 2026.
          </p>
        </div>

        {!user ? (
          /* Not logged in — prompt to login */
          <div
            data-reveal="scale"
            data-reveal-delay="0.2"
            className="glass-strong rounded-3xl p-8 text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground">
              Sign in to Pre-Order
            </h3>
            <p className="text-muted-foreground font-body">
              Create an account or sign in to place your order and complete payment.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                to="/login"
                className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-base glow-cyan hover:glow-cyan-strong transition-all duration-300 hover:scale-[1.02]"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-8 py-4 rounded-xl border border-border text-foreground font-heading font-semibold text-base hover:border-primary/50 transition-all duration-300"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          /* Logged in — show order form */
          <div
            data-reveal="scale"
            data-reveal-delay="0.2"
            className="glass-strong rounded-3xl p-8 space-y-6"
          >
            {/* Welcome */}
            <div className="flex items-center gap-3 pb-4 border-b border-border/50">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-primary font-heading font-bold text-sm">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
              <div>
                <p className="text-foreground font-body text-sm font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-muted-foreground/60 font-body text-xs">{user.email}</p>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 text-destructive text-sm font-body">
                {error}
              </div>
            )}

            {/* Variant selector */}
            <div>
              <label className="block text-sm font-body text-muted-foreground mb-3">
                Select Product & Variant
              </label>
              <div className="grid gap-3">
                {allVariants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${selectedVariant === variant.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-border/80"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-foreground font-body text-sm font-medium">
                          {variant.productName}
                        </p>
                        <p className="text-muted-foreground font-body text-xs mt-0.5">
                          {variant.color} · SKU: {variant.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground font-heading font-bold">
                          ${Number(variant.priceOverride || variant.productPrice).toLocaleString("en-IN")}
                        </p>
                        <p className="text-muted-foreground/60 font-body text-xs">
                          {variant.stockQuantity > 0
                            ? `${variant.stockQuantity} in stock`
                            : "Out of stock"}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
                {allVariants.length === 0 && (
                  <p className="text-muted-foreground font-body text-sm text-center py-4">
                    No products available yet.
                  </p>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-body text-muted-foreground mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-border text-foreground font-body hover:border-primary/50 transition-colors flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-foreground font-heading font-bold text-lg w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-border text-foreground font-body hover:border-primary/50 transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total */}
            {selectedVariantData && (
              <div className="flex items-center justify-between py-4 border-t border-border/50">
                <span className="text-muted-foreground font-body">Total</span>
                <span className="text-foreground font-heading font-bold text-2xl">
                  ${totalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            )}

            {/* Pay button */}
            <button
              onClick={handlePayment}
              disabled={isProcessing || !selectedVariant || allVariants.length === 0}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-base glow-cyan hover:glow-cyan-strong transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay $${totalPrice.toLocaleString("en-IN")} — Secure Checkout`
              )}
            </button>

            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-muted-foreground/60 text-xs font-body">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                Secured by Razorpay
              </div>
              {/* <div className="flex items-center gap-1.5 text-muted-foreground/60 text-xs font-body">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                256-bit SSL
              </div> */}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
