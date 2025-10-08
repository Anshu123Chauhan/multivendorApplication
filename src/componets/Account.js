import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUserName,
  selectUserPic,
  selectUserEmail,
  setLogOut,
} from "../feautres/userSlice";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { User, Package, MapPin, Heart, LogOut, Edit2, Plus, Trash2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { apiurl } from "../config/config";
import axios from "axios";
import Swal from "sweetalert2";
import OrdersList from "./OrdersList";
const ADDRESS_STORAGE_KEY = "ens_account_addresses";

const emptyAddress = {
  _id: "",
  name: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  landmark: "",
  country: "India",
  address: "",
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

const Account = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userName = useSelector(selectUserName);
  const userPic = useSelector(selectUserPic);
  const email = useSelector(selectUserEmail);

  const [activeTab, setActiveTab] = useState("profile");
  const [avatar, setAvatar] = useState(userPic || "");
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({ ...emptyAddress });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const persistAddresses = (next = []) => {
    const normalized = next.map((item) => normalizeAddress(item));
    setAddresses(normalized);
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(normalized));
  };

  const user = useMemo(() => {
    const token = JSON.parse(localStorage.getItem("user"));
    return token;
  }, []);


  useEffect(() => {
    const stored = localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAddresses(parsed.map((item) => normalizeAddress(item)));
        }
      } catch (error) {
        console.error("Failed to parse stored addresses:", error);
      }
    }
  }, []);

  const fetchAddressList = async () => {
    if (!user?.token) {
      return;
    }

    try {
      const response = await axios.get(
        `${apiurl}/ecommerce/customer/address/list`,
        {
          headers: {
            Authorization: user?.token,
          },
        }
      );
      if (response?.data.success === true) {
        persistAddresses(response?.data?.addresses || []);
      }
    } catch (error) {
      console.error("Error fetching store list:", error);
    }
  };
  useEffect(() => {
    fetchAddressList();
  }, [user?.token]);

  const handleAddNewAddress = () => {
    setAddressForm({ ...emptyAddress });
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleEditAddress = (address) => {
    setAddressForm(normalizeAddress(address));
    setIsEditing(true);
    setIsFormOpen(true);
  };
  const deleteAddress = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteAddress(id);
        Swal.fire("Deleted!", "The address has been removed.", "success");
      }
    });
  };


  const handleDeleteAddress = async (id) => {
    const safeId = `${id ?? ""}`;

    try {
      const response = await axios.delete(
        `${apiurl}/ecommerce/customer/address/remove/${safeId}`,
        {
          headers: { Authorization: user?.token },
        }
      );

      if (response?.data?.success) {
        persistAddresses(
          addresses.filter((addr) => addr.id !== safeId && addr._id !== safeId)
        );
        await fetchAddressList();
        toast.info("Address removed");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Unable to delete address.");
    }
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = async (event) => {
    event.preventDefault();

    const trim = (value) => `${value ?? ""}`.trim();
    const payload = {
      ...addressForm,
      name: trim(addressForm.name),
      phone: trim(addressForm.phone),
      street: trim(addressForm.street),
      city: trim(addressForm.city),
      state: trim(addressForm.state),
      postalCode: trim(addressForm.postalCode),
      address: trim(addressForm.address),
      landmark: trim(addressForm.landmark),
      country: trim(addressForm.country || emptyAddress.country),
    };

    const requiredFields = ["name", "phone", "city", "state", "postalCode", "address"];

    if (requiredFields.some((field) => !payload[field])) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (!user?.token) {
      toast.error("Please sign in to save an address.");
      return;
    }

    const addressId = addressForm._id || addressForm.id;
    const isUpdate = Boolean(isEditing && addressId);

    if (isEditing && !addressId) {
      toast.error("Missing address information. Please try again.");
      return;
    }

    const { id, ...apiPayload } = payload;
    const requestUrl = isUpdate
      ? `${apiurl}/ecommerce/customer/address/update/${addressId}`
      : `${apiurl}/ecommerce/customer/address/add`;
    const requestMethod = isUpdate ? axios.put : axios.post;

    try {
      const response = await requestMethod(requestUrl, apiPayload, {
        headers: { Authorization: user.token },
      });
      const { success, message, addresses: serverAddresses } = response?.data || {};

      if (!success) {
        toast.error(message || "Unable to save address.");
        return;
      }

      if (Array.isArray(serverAddresses)) {
        persistAddresses(serverAddresses);
      } else {
        await fetchAddressList();
      }

      toast.success(message || (isUpdate ? "Address updated" : "Address saved"));
      setIsFormOpen(false);
      setAddressForm({ ...emptyAddress });
      setIsEditing(false);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Unable to save address.";
      toast.error(errorMessage);
    }
  };
  const logOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(setLogOut());
        toast.success("Signed out successfully");
        navigate("/");
      })
      .catch((error) => toast.error(error.message));
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "logout", label: "Logout", icon: LogOut },
  ];
  let userdetails=jwtDecode(user?.token)
  
  const displayName = userdetails?.name || "there";
  const displayEmail = userdetails?.email || "Update your email for better communication.";

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-amber-50 border border-amber-100">
                  {avatar ? (
                    <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-amber-600 text-xl font-semibold">
                      {(displayName?.[0] || "U").toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <h2 className="text-2xl font-semibold text-[#2F251F]">Hey, {displayName}</h2>
                  <p className="text-sm text-gray-500 mt-1">{displayEmail}</p>
                  <div className="mt-4 text-sm text-gray-600 leading-relaxed">
                    <p className="text-left">
                      Save your favourite looks, track orders, and manage delivery addresses all in one place.
                    </p>
                    <p className="mt-2 text-left">
                      Need help? Our customer heroes are available 24/7 to keep your ENS experience incredible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "orders":
        return (
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8 text-center text-gray-500">

          <OrdersList />

            {/* <Package className="mx-auto w-12 h-12 text-amber-400" />
            <h3 className="mt-4 text-lg font-semibold text-[#2F251F]">You haven&apos;t placed any orders yet.</h3>
            <p className="mt-2 text-sm">
              Explore the latest arrivals and add your favourites to the cart. We&apos;ll take care of the rest!
            </p>
            <button
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2F251F] text-white text-sm font-semibold hover:bg-[#4a3b32]"
              onClick={() => navigate("/shop")}
            >
              Browse collections
            </button> */}
          </div>
        );

      case "addresses":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-[#2F251F] text-left">Saved Addresses</h2>
                <p className="text-sm text-gray-500 mt-1">Manage your delivery locations for a smoother checkout.</p>
              </div>
              <button
                onClick={handleAddNewAddress}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2F251F] text-white text-sm font-semibold hover:bg-[#4a3b32]"
              >
                <Plus className="w-4 h-4" /> Add address
              </button>
            </div>

            {isFormOpen && (
              <form onSubmit={handleAddressSubmit} className="bg-white border border-amber-100 rounded-3xl shadow-sm p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                 
                  <input
                    name="name"
                    value={addressForm.name}
                    onChange={handleAddressChange}
                    placeholder="Full name"
                    className="border border-gray-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    name="phone"
                    value={addressForm.phone}
                    onChange={handleAddressChange}
                    placeholder="Phone number"
                    className="border border-gray-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    name="postalCode"
                    value={addressForm.postalCode}
                    onChange={handleAddressChange}
                    placeholder="Postal code"
                    className="border border-gray-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    className="border border-gray-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    placeholder="State"
                    className="border border-gray-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                  name="street"
                  value={addressForm.street}
                  onChange={handleAddressChange}
                  placeholder="Street, house number, floor"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                </div>
                
                 <textarea
                  name="address"
                  value={addressForm.address}
                  onChange={handleAddressChange}
                  placeholder="Full Address"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  name="landmark"
                  value={addressForm.landmark}
                  onChange={handleAddressChange}
                  placeholder="Landmark (optional)"
                  className="w-full border border-gray-200 rounded-xl w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2F251F] text-white text-sm font-semibold hover:bg-[#4a3b32]"
                  >
                    {isEditing ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isEditing ? "Update address" : "Save address"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setAddressForm({ ...emptyAddress });
                    }}
                    className="text-sm text-gray-500 hover:text-amber-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {!addresses.length === 0 ? (
              <div className="bg-white border border-dashed border-amber-200 rounded-3xl py-12 text-center text-sm text-gray-500">
                No addresses saved yet. Add one to speed through checkout next time.
              </div>
            ) : (
              <div className="grid gap-4">
                {addresses.map((address) => (
                  <div key={address.id} className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                          <MapPin className="w-3 h-3" /> {address.label || "Saved address"}
                        </span>
                        <p className="mt-3 text-sm font-semibold text-[#2F251F] text-left">
                          {address.name} - {address.phone}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 text-left">{address.street}</p>
                        <p className="text-sm text-gray-600 text-left">
                          {address.city}, {address.state} - {address.postalCode}
                        </p>
                        {address.landmark && (
                          <p className="text-xs text-gray-500 mt-1">Landmark: {address.landmark}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditAddress(address)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200 text-amber-700 hover:bg-amber-50"
                        >
                          <Edit2 className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => deleteAddress(address.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "wishlist":
        return (
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8 text-center text-gray-500">
            <Heart className="mx-auto w-12 h-12 text-amber-400" />
            <h3 className="mt-4 text-lg font-semibold text-[#2F251F]">Your wishlist is waiting.</h3>
            <p className="mt-2 text-sm">
              Save styles you love and revisit them anytime. Tap the heart icon on products to build your list.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const handleTabClick = (tabId) => {
    if (tabId === "logout") {
      logOut();
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[260px,1fr] gap-6">
          <aside className="bg-white shadow-sm border border-gray-100 rounded-3xl p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">My Account</h2>
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => handleTabClick(id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition ${
                    activeTab === id ? "bg-[#2F251F] text-white shadow" : "text-gray-600 hover:bg-amber-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="space-y-6">{renderContent()}</main>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Account;






















