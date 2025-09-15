import React, { useState } from "react";

export default function SellerRegistration() {
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    businessAddress: "",
    phone: "",
    email: "",
    nationalIdType: "aadhaar",
    nationalIdNumber: "",
    gst: "",
    bankAccount: "",
    addressProof: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.businessName) newErrors.businessName = "Business Name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.nationalIdNumber) newErrors.nationalIdNumber = "ID number is required";
    if (!formData.gst) newErrors.gst = "GSTIN is required";
    if (!formData.bankAccount) newErrors.bankAccount = "Bank Account is required";
    if (!formData.addressProof) newErrors.addressProof = "Address Proof image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      console.log("Form Data:", formData);
      alert("Seller registered successfully!");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1556740749-887f6717d7e4')",
      }}
    >
      <div className="bg-white/90 backdrop-blur-md p-8 m-2 rounded-2xl shadow-2xl max-w-3xl w-full">
        <h2 className="text-2xl font-bold text-center">Seller Registration</h2>

        {/* Full Name + Business Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.businessName && (
              <p className="text-red-500 text-sm">{errors.businessName}</p>
            )}
          </div>
        </div>

        {/* Business Address (full row) */}
        <div className="mb-4">
          <input
            type="text"
            name="businessAddress"
            placeholder="Registered Business Address"
            value={formData.businessAddress}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        {/* Phone + Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>
        </div>

        {/* National ID Type + Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <select
              name="nationalIdType"
              value={formData.nationalIdType}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="aadhaar">Aadhaar Card</option>
              <option value="pan">PAN Card</option>
              <option value="passport">Passport</option>
              <option value="voter">Voter ID</option>
              <option value="dl">Driving License</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              name="nationalIdNumber"
              placeholder={`Enter ${formData.nationalIdType.toUpperCase()} Number`}
              value={formData.nationalIdNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.nationalIdNumber && (
              <p className="text-red-500 text-sm">{errors.nationalIdNumber}</p>
            )}
          </div>
        </div>

        {/* GST + Bank Account */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              name="gst"
              placeholder="GSTIN"
              value={formData.gst}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.gst && (
              <p className="text-red-500 text-sm">{errors.gst}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="bankAccount"
              placeholder="Bank Account Number"
              value={formData.bankAccount}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.bankAccount && (
              <p className="text-red-500 text-sm">{errors.bankAccount}</p>
            )}
          </div>
        </div>

        {/* Address Proof Upload (full row) */}
        <div className="mb-4">
          <input
            type="file"
            name="addressProof"
            accept="image/*"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          {errors.addressProof && (
            <p className="text-red-500 text-sm">{errors.addressProof}</p>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>
      </div>
    </div>
  );
}
