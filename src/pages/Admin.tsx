import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Admin = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const { toast } = useToast();

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    category: "",
    basePrice: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/products`);
      if (response.ok) {
        setProducts(await response.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/users`);
      if (response.ok) {
        setUsers(await response.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/orders`);
      if (response.ok) {
        setOrders(await response.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchOrders();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast({ title: "Product deleted successfully" });
        fetchProducts();
      } else {
        toast({ title: "Failed to delete product", variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openEditDialog = (product: any) => {
    setEditProduct(product);
    setEditForm({
      name: product.name,
      description: product.description || "",
      category: product.category,
      basePrice: String(product.basePrice),
    });
    setEditOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!editProduct) return;
    try {
      const response = await fetch(`${apiUrl}/api/products/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          description: editForm.description,
          category: editForm.category,
          basePrice: parseFloat(editForm.basePrice),
        }),
      });
      if (response.ok) {
        toast({ title: "Product updated successfully" });
        setEditOpen(false);
        fetchProducts();
      } else {
        toast({ title: "Failed to update product", variant: "destructive" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Products</h2>
            </div>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Base Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${product.basePrice}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {products.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No products found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <h2 className="text-2xl font-semibold mb-4">Users</h2>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <h2 className="text-2xl font-semibold mb-4">Orders</h2>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.user.firstName} {order.user.lastName}
                      </TableCell>
                      <TableCell>${order.totalAmount}</TableCell>
                      <TableCell>{order.orderStatus}</TableCell>
                      <TableCell>{order.paymentStatus}</TableCell>
                    </TableRow>
                  ))}
                  {orders.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details below and click save.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-desc" className="text-right">Description</Label>
              <Input
                id="edit-desc"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-cat" className="text-right">Category</Label>
              <Input
                id="edit-cat"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">Price</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={editForm.basePrice}
                onChange={(e) => setEditForm({ ...editForm, basePrice: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
