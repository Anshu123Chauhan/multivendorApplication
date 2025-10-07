import React, { useEffect, useState, useMemo } from "react";
import { Trash2, Minus, Plus, Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router";
import { useNotification } from "../reusableComponent/NotificationProvider";
import ConfirmMassage from "../reusableComponent/ConfirmMassage";

export default function AddToCart() {
  const { showNotification } = useNotification();
  const [products, setProducts] = useState([]);
  const [shipping, setShipping] = useState(0);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);


  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);

  const handleUpdateQty = async (product, delta) => {
    const newQty = Math.max(1, product.quantity + delta);
    try {
      if (!user?.token) return alert("Please login!");

      await axios.put(
        "http://localhost:5000/api/ecommerce/cart/update",
        {
          productId: product.productId,
          quantity: newQty,
          variant: product.variant || null,
        },
        { headers: { Authorization: user.token } }
      );

      updateQty(product.productId, delta); // local state update
    } catch (err) {
      console.error("Quantity update failed:", err);
      alert("Failed to update quantity.");
    }
  };

  const handleRemoveItem = async (product) => {
    try {
      if (!user?.token) return showNotification("Please login!", "success");

      await axios.delete("http://localhost:5000/api/ecommerce/cart/remove", {
        headers: { Authorization: user.token },
        data: {
           productId: product.productId, 
           variant: product.variant
          },
      });

      setProducts((prev) =>
        prev.filter((item) => item.productId !== product.productId)
      );

      showNotification("Item removed successfully!", "success");
    } catch (err) {
      console.error("Remove failed:", err);
      showNotification("Failed to remove item.", "error");
    }
  };

  const handleClearCart = async () => {
    try {
      if (!user?.token) return showNotification("Please login!", "success");

      await axios.delete("http://localhost:5000/api/ecommerce/cart/clear", {
        headers: { Authorization: user.token },
      });

      showNotification("Cart cleared successfully!", "success");
      setOpenDialog(false)
      setProducts([]);
    } catch (error) {
      showNotification("Failed to clear cart.", "error");
    }
  };

  // Fetch cart items on mount
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?.token) return alert("Please login to view cart!");

      try {
        const response = await axios.get(
          "http://localhost:5000/api/ecommerce/cart/list",
          { headers: { Authorization: user.token } }
        );

        const itemsArray = response.data?.cart?.items || [];
        setProducts(itemsArray);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        alert("Failed to fetch cart data.");
      }
    };

    fetchCart();
  }, [user]);

  // Derived values
  const totalItems = useMemo(
    () =>
      Array.isArray(products)
        ? products.reduce((sum, p) => sum + (p.quantity || 1), 0)
        : 0,
    [products]
  );

  const subtotal = useMemo(
    () =>
      Array.isArray(products)
        ? products.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 1), 0)
        : 0,
    [products]
  );

  const gst = useMemo(() => subtotal * 0.18, [subtotal]);
  const grandTotal = subtotal + shipping + gst;

  // Local state updates
  const updateQty = (productId, delta) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.productId === productId
          ? { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) }
          : p
      )
    );
  };

  const toggleSaveForLater = (productId) =>
    setProducts((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, saved: !p.saved } : p))
    );

  const proceedToCheckout = () => {
    navigate("/checkout")
    // alert("Proceeding to checkout...");
  };

  return (
    <div className="max-w-[80vw] mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Cart Items */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">
              My Cart ({totalItems} items)
            </h2>
            <div>

              {products.length > 0 && (<button
                onClick={() => setOpenDialog(true)}
                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 hover:bg-red-50 transition"
              >
                Empty Cart
              </button>)}

              <ConfirmMassage
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onConfirm={handleClearCart}
                message="Are you sure you want to clear your cart?"
              />
            </div>
          </div>

          <div className="space-y-4">
            {products.length === 0 && (
              <div className="p-10 bg-gray-50 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#37312F] text-amber-700 mb-4">
                  <ShoppingCart size={40} />
                </div>
                <p className="text-xl font-semibold mb-2">Your Cart is Empty</p>
                <p className="text-gray-500 mb-6">
                  Looks like you haven’t added anything yet.
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-2 bg-[#37312F] text-white hover:bg-[#504f4f] transition"
                >
                  Continue Shopping
                </button>
              </div>
            )}

            {products.map((p) => (
              <motion.div
                key={p.productId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 p-4 bg-gray-50 items-center"
              >
                <img
                  src={
                    p.variant?.selectedVariant?.images?.[0] || p.image || "https://via.placeholder.com/100"
                  }
                  alt={p.name}
                  className="w-28 h-28 object-cover rounded-md"
                />

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-lg">{p.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Quantity: {p.quantity}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        ₹{(p.price * p.quantity).toFixed(0)}
                      </div>
                      <div className="text-sm line-through text-gray-400">
                        ₹{p.mrp || p.price}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 border rounded-md overflow-hidden">
                      <button
                        onClick={() => handleUpdateQty(p, -1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <div className="px-4 py-1 font-medium">{p.quantity}</div>
                      <button
                        onClick={() => handleUpdateQty(p, +1)}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleSaveForLater(p.productId)}
                        className="text-sm px-3 py-1 rounded-md hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Heart
                          size={14}
                          className={p.saved ? "text-pink-600" : "text-gray-400"}
                        />
                        <span className="text-xs">{p.saved ? "Saved" : "Save"}</span>
                      </button>

                      <button
                        onClick={() => handleRemoveItem(p)}
                        className="text-sm px-3 py-1 rounded-md hover:bg-red-50 flex items-center gap-2 text-red-600"
                      >
                        <Trash2 size={14} />
                        <span className="text-xs">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT: Order Summary */}
        <aside className="bg-gray-50 rounded-lg p-4 shadow-sm h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Price Details</h3>
            <div className="text-sm text-gray-500">{products.length} item(s)</div>
          </div>

          <div className="divide-y divide-gray-100 text-sm">
            <div className="py-3 flex justify-between">
              <div>Subtotal</div>
              <div>₹{subtotal.toFixed(0)}</div>
            </div>

            <div className="py-3 flex justify-between">
              <div>Shipping</div>
              <div>{shipping === 0 ? "Free" : `₹${shipping}`}</div>
            </div>

            <div className="py-3 flex justify-between">
              <div>GST</div>
              <div>₹{gst.toFixed(0)}</div>
            </div>

            <div className="py-3 flex justify-between font-semibold text-lg">
              <div>Total</div>
              <div>₹{grandTotal.toFixed(0)}</div>
            </div>
          </div>

          <button
            onClick={proceedToCheckout}
            className="w-full mt-4 py-2 bg-[#37312F] hover:hover:bg-[#504f4f] text-white font-semibold hover:brightness-95"
          >
            Continue
            {/* Place Order — ₹{grandTotal.toFixed(0)} */}
          </button>
        </aside>
      </div>
    </div>
  );
}


