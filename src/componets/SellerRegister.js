import React, { useState } from "react";
import { apiurl } from "../config/config";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function SellerRegistration() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    businessName: "",
    businessAddress: "",
    phone: "",
    identityProof: "Aadhaar",
    identityProofNumber: "",
    accountHolder: "",
    gstNumber: "",
    bankAccount: "",
    ifscCode: "",
    addressProof: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    // If the field is file input (addressProof)
    if (name === "addressProof" && files && files[0]) {
      const uploadedUrl = await handleFileUpload(files[0]);
      if (uploadedUrl) {
        setFormData((prev) => ({
          ...prev,
          [name]: uploadedUrl, // store uploaded URL instead of raw file
        }));

        // Remove error if uploaded successfully
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[name];
          return newErrors;
        });
      }
      return;
    }

    // For normal inputs
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validation + error removal
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      // Remove error if value exists
      if (value) {
        delete newErrors[name];
      }

      // Email validation
      if (name === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.email = "Enter a valid email address";
        } else {
          delete newErrors.email;
        }
      }

      // Phone validation (10 digits only for India – adjust if needed)
      if (name === "phone") {
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(value)) {
          newErrors.phone = "Enter a valid 10-digit phone number";
        } else {
          delete newErrors.phone;
        }
      }

      return newErrors;
    });
  };

  const handleFileUpload = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "lakmesalon");
    data.append("cloud_name", "dv5del8nh");

    try {
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dv5del8nh/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      let result = await res.json();
      // console.log("Uploaded Image URL:", result.secure_url);
      return result.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handlePasswordChange = (e) => {
    handleChange(e);
    setStrength(checkStrength(e.target.value));
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    if (!formData.businessName)
      newErrors.businessName = "Business Name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.identityProofNumber)
      newErrors.identityProofNumber = "ID number is required";
    if (!formData.gstNumber) newErrors.gstNumber = "GSTIN is required";
    // if (!formData.bankAccount) newErrors.bankAccount = "Bank Account is required";
    if (!formData.addressProof)
      newErrors.addressProof = "Address Proof image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkStrength = (password) => {
    if (!password) return "";

    const conditions = [
      /.{8,}/, // at least 8 characters
      /[A-Z]/, // at least one uppercase
      /[a-z]/, // at least one lowercase
      /[0-9]/, // at least one number
      /[^A-Za-z0-9]/, // at least one special character
    ];

    const passed = conditions.filter((regex) => regex.test(password)).length;

    if (passed <= 2) return "Weak";
    if (passed === 3 || passed === 4) return "Medium";
    if (passed === 5) return "Strong";
    return "";
  };
  const handleSubmit = async () => {
  if (validate()) {
    try {
      const response = await axios.post(`${apiurl}/seller/register`, formData);

      console.log("Form Data:", response);

      if (response.status === 200) {
        toast.success(response.data.message || "Registered successfully!");
      } else {
        toast.warn(response.data.message || "Something went wrong!");
      }

    } catch (error) {
   
      if (error.response) {
        toast.warn(error.response.data.message || "Server error occurred!");
      } 
    
      else if (error.request) {
        toast.error("No response from server. Please try again!");
      } 

      else {
        toast.error("Unexpected error occurred!");
      }
      console.error("Error:", error);
    }
  } else {
    toast.error("Please fill all the mandatory fields");
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
              <p className="text-red-500 text-sm text-left">
                {errors.fullName}
              </p>
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
              <p className="text-red-500 text-sm text-left">
                {errors.businessName}
              </p>
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
              onChange={(e) => {
                // Allow only digits
                const value = e.target.value.replace(/\D/g, "");

                // Limit to 10 digits
                if (value.length <= 10) {
                  handleChange({
                    target: {
                      name: "phone",
                      value,
                    },
                  });
                }
              }}
              className="w-full p-3 border rounded-lg"
            />

            {errors.phone && (
              <p className="text-red-500 text-sm text-left">{errors.phone}</p>
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
              <p className="text-red-500 text-sm text-left">{errors.email}</p>
            )}
          </div>
        </div>

        {/* National ID Type + Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <select
              name="identityProof"
              value={formData.identityProof}
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
              name="identityProofNumber"
              placeholder={`Enter ${formData.identityProof.toUpperCase()} Number`}
              value={formData.identityProofNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.identityProofNumber && (
              <p className="text-red-500 text-sm text-left">
                {errors.identityProofNumber}
              </p>
            )}
          </div>
        </div>

        {/* GST + Bank Account */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              name="gstNumber"
              placeholder="GSTIN"
              value={formData.gstNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {errors.gstNumber && (
              <p className="text-red-500 text-sm text-left">
                {errors.gstNumber}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="bankAccount"
              placeholder="Bank Account Number (Optional)"
              value={formData.bankAccount}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {/* {errors.bankAccount && (
              <p className="text-red-500 text-sm text-left">{errors.bankAccount}</p>
            )} */}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <input
              type="text"
              name="accountHolder"
              placeholder="Account Holder (Optional)"
              value={formData.accountHolder}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {/* {errors.accountHolder && (
              <p className="text-red-500 text-sm text-left">{errors.accountHolder}</p>
            )} */}
          </div>
          <div>
            <input
              type="text"
              name="ifscCode"
              placeholder="IFSC Code (Optional)"
              value={formData.ifscCode}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            {/* {errors.ifscCode && (
              <p className="text-red-500 text-sm text-left">{errors.ifscCode}</p>
            )} */}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              <p className="text-red-500 text-sm text-left">
                {errors.addressProof}
              </p>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-lg"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-5 text-sm text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

            {errors.password && (
              <p className="text-red-500 text-sm text-left">
                {errors.password}
              </p>
            )}

            {formData.password && !errors.password && (
              <p
                className={`text-sm mt-1 ${
                  strength === "Weak"
                    ? "text-red-500"
                    : strength === "Medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                Password Strength: {strength}
              </p>
            )}
          </div>
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
