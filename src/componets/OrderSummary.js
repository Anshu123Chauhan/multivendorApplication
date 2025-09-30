import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MapPin, Plus, CreditCard, Wallet, Banknote, CheckCircle2 } from "lucide-react";
import { apiurl } from "../config/config";

const ADDRESS_STORAGE_KEY = "ens_account_addresses";

const emptyAddress = {
  name: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  landmark: "",
  address: "",
  country: "India",
};

const paymentOptions = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay with cash when the order is delivered",
    icon: Banknote,
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    description: "Visa, MasterCard, RuPay supported",
    icon: CreditCard,
  },
  {
    id: "upi",
    label: "UPI",
    description: "Google Pay, PhonePe, Paytm and more",
    icon: Wallet,
  },
];

const toCurrency = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return value ?? "";
  }
  return numeric.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  });
};

const normalizeAddress = (address) => {
  if (!address) {
    return { ...emptyAddress };
  }

  const merged = { ...emptyAddress, ...address };
  const stableId = address._id || address.id;

  if (stableId) {
    merged._id = stableId;
    merged.id = stableId;
  }

  return merged;
};

export default function OrderSummary() {
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({ ...emptyAddress });
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [shippingFee, setShippingFee] = useState(49);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (error) {
      console.error("Failed to parse user token", error);
      return null;
    }
  }, []);

  const apiBase = apiurl || "http://localhost:5000";

  useEffect(() => {
    const stored = localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((item) => normalizeAddress(item));
          setAddresses(normalized);
          if (!selectedAddressId && normalized.length > 0) {
            setSelectedAddressId(normalized[0].id || normalized[0]._id);
          }
        }
      } catch (error) {
        console.error("Failed to read stored addresses", error);
      }
    }
  }, []);

  const persistAddresses = (next) => {
    const normalized = next.map((item) => normalizeAddress(item));
    setAddresses(normalized);
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(normalized));
    if (!selectedAddressId && normalized.length > 0) {
      setSelectedAddressId(normalized[0].id || normalized[0]._id);
    }
  };

  const fetchAddresses = async () => {
    if (!user?.token) {
      return;
    }

    try {
      const response = await axios.get(`${apiBase}/ecommerce/customer/address/list`, {
        headers: { Authorization: user.token },
      });
      const next = response?.data?.addresses || [];
      persistAddresses(next);
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchCart = async () => {
    if (!user?.token) {
      return;
    }

    try {
      const response = await axios.get(`${apiBase}/ecommerce/cart/list`, {
        headers: { Authorization: user.token },
      });
      const items = response?.data?.cart?.items || [];
      setCartItems(items);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = useMemo(
    () =>
      Array.isArray(cartItems)
        ? cartItems.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
            0
          )
        : 0,
    [cartItems]
  );

  const gst = useMemo(() => subtotal * 0.18, [subtotal]);
  const totalPayable = subtotal + gst + (cartItems.length ? shippingFee : 0);

  const handleAddressFormChange = (event) => {
    const { name, value } = event.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();

    const requiredFields = ["name", "phone", "street", "city", "state", "postalCode", "address"];
    const hasMissing = requiredFields.some((field) => !`${addressForm[field] || ""}`.trim());

    if (hasMissing) {
      toast.error("Please complete all required address fields");
      return;
    }

    if (!user?.token) {
      toast.error("Please sign in to save an address.");
      return;
    }

    try {
      const payload = {
        ...addressForm,
        phone: `${addressForm.phone}`.trim(),
      };

      const response = await axios.post(`${apiBase}/ecommerce/customer/address/add`, payload, {
        headers: { Authorization: user.token },
      });

      const nextAddresses = response?.data?.addresses || response?.data?.address || [];
      if (Array.isArray(nextAddresses) && nextAddresses.length > 0) {
        persistAddresses(nextAddresses);
        toast.success("Address saved successfully");
      } else {
        await fetchAddresses();
      }

      setShowAddressForm(false);
      setAddressForm({ ...emptyAddress });
    } catch (error) {
      console.error("Failed to save address", error);
      const message = error?.response?.data?.message || "Unable to save address";
      toast.error(message);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsPlacingOrder(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setShowThankYou(true);
      toast.success("Order placed successfully!");
      setTimeout(() => {
        setShowThankYou(false);
        navigate("/confirmation");
      }, 1500);
    } catch (error) {
      toast.error("Something went wrong while placing your order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8">
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#2F251F] flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-amber-600" /> Select delivery address
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Choose where you want us to deliver your order.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddressForm((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-amber-200 px-4 py-2 text-sm font-medium text-amber-700 transition hover:border-amber-300 hover:bg-amber-50"
              >
                <Plus className="h-4 w-4" /> Add address
              </button>
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddressSubmit} className="mt-6 grid gap-4 rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    name="name"
                    value={addressForm.name}
                    onChange={handleAddressFormChange}
                    placeholder="Full name"
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  />
                  <input
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressFormChange}
                    placeholder="Phone"
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  />
                  <input
                    name="postalCode"
                    value={addressForm.postalCode}
                    onChange={handleAddressFormChange}
                    placeholder="Postal code"
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  />
                  <input
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressFormChange}
                    placeholder="City"
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  />
                  <input
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressFormChange}
                    placeholder="State"
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  />
                  <input
                    name="landmark"
                    value={addressForm.landmark}
                    onChange={handleAddressFormChange}
                    placeholder="Landmark (optional)"
                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  />
                </div>
                <textarea
                  name="street"
                  value={addressForm.street}
                  onChange={handleAddressFormChange}
                  placeholder="Street, house number, area"
                  rows={2}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
                <textarea
                  name="address"
                  value={addressForm.address}
                  onChange={handleAddressFormChange}
                  placeholder="Additional address details"
                  rows={2}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                />
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressForm(false);
                      setAddressForm({ ...emptyAddress });
                    }}
                    className="text-sm text-gray-500 hover:text-amber-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#2F251F] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#46352c]"
                  >
                    Save address
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 grid gap-4">
              {addresses.length === 0 && (
                <p className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 px-4 py-8 text-center text-sm text-gray-500">
                  No saved addresses yet. Add an address to continue.
                </p>
              )}

              {addresses.map((address) => {
                const addressId = address.id || address._id;
                return (
                  <label
                    key={addressId}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                      selectedAddressId === addressId
                        ? "border-amber-400 bg-amber-50"
                        : "border-gray-200 hover:border-amber-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedAddress"
                      value={addressId}
                      checked={selectedAddressId === addressId}
                      onChange={() => setSelectedAddressId(addressId)}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#2F251F]">
                        {address.name} · {address.phone}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.street}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} - {address.postalCode}
                      </p>
                      {address.landmark && (
                        <p className="text-xs text-gray-400">Landmark: {address.landmark}</p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#2F251F] mb-4">Order items</h2>
            <div className="space-y-4">
              {cartItems.length === 0 && (
                <p className="rounded-2xl border border-dashed border-amber-200 bg-amber-50/50 px-4 py-8 text-center text-sm text-gray-500">
                  Your cart is empty. Add products to place an order.
                </p>
              )}

              {cartItems.map((item) => {
                const image =
                  item.variant?.selectedVariant?.images?.[0] ||
                  item.image ||
                  "https://via.placeholder.com/120";

                return (
                  <div
                    key={item.productId}
                    className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50/60 p-4"
                  >
                    <img
                      src={image}
                      alt={item.name}
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[#2F251F]">
                            {item.name}
                          </p>
                          {item.variant?.selectedVariant?.size && (
                            <p className="text-xs text-gray-500">
                              Size: {item.variant.selectedVariant.size}
                            </p>
                          )}
                          {item.variant?.selectedVariant?.color && (
                            <p className="text-xs text-gray-500">
                              Color: {item.variant.selectedVariant.color}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            Qty: {item.quantity || 1}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-[#2F251F]">
                          {toCurrency((item.price || 0) * (item.quantity || 1))}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#2F251F] mb-4">Payment method</h2>
            <div className="grid gap-3">
              {paymentOptions.map(({ id, label, description, icon: Icon }) => (
                <label
                  key={id}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                    paymentMethod === id
                      ? "border-[#2F251F] bg-amber-50"
                      : "border-gray-200 hover:border-amber-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={id}
                    checked={paymentMethod === id}
                    onChange={() => setPaymentMethod(id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="flex items-center gap-2 text-sm font-semibold text-[#2F251F]">
                      <Icon className="h-4 w-4 text-amber-600" /> {label}
                    </p>
                    <p className="text-xs text-gray-500">{description}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#2F251F]">Order summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{toCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{cartItems.length ? toCurrency(shippingFee) : toCurrency(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (18%)</span>
                <span>{toCurrency(gst)}</span>
              </div>
              <div className="flex justify-between border-t border-dashed border-gray-200 pt-3 text-base font-semibold text-[#2F251F]">
                <span>Total payable</span>
                <span>{toCurrency(totalPayable)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="mt-6 w-full rounded-full bg-[#2F251F] py-3 text-sm font-semibold text-white transition hover:bg-[#46352c] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isPlacingOrder ? "Placing order..." : "Place order"}
            </button>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 text-xs text-gray-500 shadow-sm">
            <h3 className="text-sm font-semibold text-[#2F251F]">Need help?</h3>
            <p className="mt-2">
              Contact our support at <span className="font-medium text-amber-700">support@ens.com</span> or call +91 99999 99999
            </p>
          </section>
        </aside>
      </div>

      {showThankYou && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-96 rounded-3xl bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-[#2F251F]">Thank you!</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your order has been placed successfully. Well send you the tracking details shortly.
            </p>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}


