import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AnimatePage from "../animation/AnimatePage";
import SizeChartModal from "./SizeChartModal";
import { useNavigate } from "react-router-dom";
import { use } from "react";
import { apiurl } from "../config/config";
export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainimage, setMainImage] = useState("")
  const [selectedcolor, setSelectedColor] = useState("")
  const [selectedsize, setSelectedSize] = useState("")
  const [stock, setStock] = useState(0);
  const [selectedImage, setSelectedImage] = useState("");
  
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    try {
      // Get user object from localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      console.log(user, "user data");

      if (!user?.token) {
        return alert("Please login to add product to cart!");
      }

      // agar product me variant hai lekin user ne select nahi kiya
      if (product.variants?.length > 0 && !selectedVariant) {
        return alert("Please select a variant!");
      }

      const payload = {
        productId: product._id,
        name: product.name,
        description: product.description,
        price: selectedVariant?.price || product.sellingPrice,
        quantity: 1,
        image: selectedVariant?.images?.[0] || product.images?.[0] || "", // <-- image logic
        ...(selectedVariant && { variant:  selectedVariant  }),
      };

      const response = await axios.post(
        `${apiurl}/ecommerce/cart/add`,
        payload,
        {
          headers: {
            Authorization: user.token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Added to cart:", response.data);
      // alert("Product added to cart successfully!");
      navigate("/cart")
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Failed to add product to cart.");
    }
  };





  // Variant aur product data fetch hone ke baad default set karo
  useEffect(() => {
    if (product?.variants?.length > 0) {
      const firstVariant = product.variants[0];
      setSelectedVariant(firstVariant);
      setSelectedImage(firstVariant.images?.[0] || ""); // first image set as default
    } else {
      setSelectedImage(product?.images?.[0] || "");
    }
  }, [product]);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiurl}/ecommerce/product/${id}`);
        const data = response.data;
        setProduct(data);

        // Agar variants exist
        if (data.variants && data.variants.length > 0) {
          const firstVariant = data.variants
            .filter(v => !v.isDeleted) // valid variants
            .find(() => true); // first valid

          if (firstVariant) {
            setSelectedVariant(firstVariant);
            setStock(firstVariant.stock || 0); // ✅ set variant stock
            if (firstVariant.images?.length > 0) setMainImage(firstVariant.images[0]);
            const colorAttr = firstVariant.attributes?.find(attr => attr.type.toLowerCase() === "color");
            const sizeAttr = firstVariant.attributes?.find(attr => attr.type.toLowerCase() === "size");
            if (colorAttr) setSelectedColor(colorAttr.value);
            if (sizeAttr) setSelectedSize(sizeAttr.value);
          }
        } else {
          // No variants → use product-level inventory
          setStock(data.inventory || 0);
          if (data.images?.length > 0) setMainImage(data.images[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);


  if (!product) return <p className="text-center">Loading...</p>;

  // Image priority -> Variant image → Product image
  const mainImage =
    selectedVariant?.images?.[0] || product.images?.[0] || "";

  // Price priority -> Variant price → Product sellingPrice
  const price = selectedVariant?.price || product.sellingPrice;
  const mrp = selectedVariant?.mrp || product.mrp;

  // Size / Color (from attributes if exist)
  const sizeAttr = selectedVariant?.attributes?.find(
    (attr) => attr.type.toLowerCase() === "size"
  );
  const colorAttr = selectedVariant?.attributes?.find(
    (attr) => attr.type.toLowerCase() === "color"
  );

  return (
    <AnimatePage>
      <div className="bg-gray-50 py-6 font-sans">
        {/* Using the API product data but keeping the UI exactly same */}
        <div className="w-full px-24 py-4 flex gap-6">
          {/* LEFT IMAGE SECTION */}
          <div className="flex flex-col gap-3 overflow-y-auto bg-gray-50">
            {selectedVariant?.images?.map((img, i) => (
              <div
                key={i}
                className={`p-1 cursor-pointer  rounded ${selectedImage === img
                  ? "border-amber-800"
                  : "border-gray-300 hover:border-amber-800"
                  }`}
                onClick={() => setSelectedImage(img)} // click karte hi main image change
              >
                <img
                  src={img}
                  alt={`variant-img-${i}`}
                  className="w-16 h-20 object-cover"
                />
              </div>
            ))}
          </div>

          {/* Main Image */}
          <div className="flex justify-center w-[40%]">
            <img
              src={selectedImage || product.images?.[0] || ""}
              alt={product.name}
              className="max-h-[500px] object-cover"
            />
          </div>

          {/* Right - Product Details */}
          <div className="text-left">
            {/* Product Name */}
            <h1 className="text-xl font-semibold mb-2 text-gray-800">
              {product.name}
            </h1>

            {/* Static ratings */}
            <div className="flex items-center mb-3 text-sm">
              <span className="text-yellow-500 mr-1">★★★★☆</span>
              <span className="text-gray-500">(1,234 reviews)</span>
            </div>

            {/* Dynamic price */}
            <div className="mb-4 text-left">
              <span className="text-lg font-semibold text-gray-900">₹{price}</span>
              {mrp && (
                <span className="ml-2 text-sm text-gray-500 line-through">₹{mrp}</span>
              )}
            </div>

            {/* Dynamic Description */}
            <p className="mb-4 text-sm text-left text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Dynamic Color & Size if available */}
            {/* Color Options */}





            {/* Color Options */}
            {product.variants?.some(v =>
              v.attributes?.some(attr => attr.type.toLowerCase() === "color")
            ) && (
                <div className="mb-4 text-left">
                  <span className="font-medium text-gray-700 block mb-2">Colors:</span>
                  <div className="flex gap-2 flex-wrap">
                    {product.variants?.map((variant) => {
                      const colorAttr = variant.attributes?.find(
                        (attr) => attr.type.toLowerCase() === "color"
                      )?.value;

                      if (!colorAttr) return null;

                      const isSelected = selectedVariant?.sku === variant.sku; // 🔹 compare using SKU

                      return (
                        <button
                          key={variant.sku}
                          onClick={() => {
                            setSelectedVariant(variant);
                            if (variant.images?.length > 0) setMainImage(variant.images[0]);
                          }}
                          className={`px-3 py-1 border text-sm cursor-pointer transition 
              ${isSelected
                              ? "border-amber-800 text-amber-800 font-semibold"
                              : "border-gray-300 text-gray-600 hover:border-amber-700 hover:text-amber-700"}`}
                        >
                          {colorAttr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Size Options */}
            {product.variants?.some(v =>
              v.attributes?.some(attr => attr.type.toLowerCase() === "size")
            ) && (
                <div className="mb-4 text-left">
                  <span className="font-medium text-gray-700 block mb-2">Sizes:</span>
                  <div className="flex gap-2 flex-wrap">
                    {product.variants?.map((variant) => {
                      const sizeAttr = variant.attributes?.find(
                        (attr) => attr.type.toLowerCase() === "size"
                      )?.value;

                      if (!sizeAttr) return null;

                      const isSelected = selectedVariant?.sku === variant.sku; // 🔹 compare using SKU

                      return (
                        <button
                          key={variant.sku}
                          onClick={() => {
                            setSelectedVariant(variant);
                            if (variant.images?.length > 0) setMainImage(variant.images[0]);
                          }}
                          className={`px-3 py-1 border text-sm cursor-pointer transition 
                           ${isSelected
                              ? "border-amber-800 text-amber-800 font-semibold"
                              : "border-gray-300 text-gray-600 hover:border-amber-700 hover:text-amber-700"}`}
                        >
                          {sizeAttr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}








            {/* Static Delivery Info */}
            <div className="mb-4 text-left">
              <p className="font-medium text-gray-700 mb-2 text-sm">Delivery</p>
              <input
                type="text"
                placeholder="Enter Pincode"
                className="border border-gray-300 px-3 py-2 w-56 text-sm focus:outline-none focus:ring-1 focus:ring-amber-700"
              />
              <p className="text-xs text-gray-500 mt-2">
                Delivery by 23 Jul, Tuesday
              </p>
            </div>

            {/* Static Offers */}
            <div className="mb-4 text-left">
              <p className="font-medium text-gray-700 mb-2 text-sm">Available Offers</p>
              <ul className="list-disc text-xs text-gray-600 space-y-1">
                <li>10% Instant Discount with Axis Bank Credit Card</li>
                <li>5% Cashback on Flipkart Axis Bank Card</li>
                <li>Special Price: Get extra 5% off (price inclusive)</li>
              </ul>
            </div>

            {/* Buttons (Static) */}
            <div className="flex space-x-3 mt-6">
              {stock > 0 ? (
                <>
                <button
                  onClick={handleAddToCart}
                  className="bg-amber-700 text-white px-4 py-2 whitespace-nowrap text-sm font-medium shadow hover:bg-amber-800 transition"
                >
                  Add to Cart
                </button>
                <button className="border border-amber-700 text-amber-700 px-4 py-2 whitespace-nowrap text-sm font-medium hover:bg-[#c7c7c7] transition">
                  Buy Now
                </button>
              </>
              ) : (
                <button
                  disabled
                  className="bg-gray-400 text-white px-4 py-2 whitespace-nowrap text-sm font-medium shadow cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
             
              <button
                className="text-[#37312F] text-sm underline hover:text-[#37312F] whitespace-nowrap"
                onClick={() => setOpen(true)}
              >
                Size Chart
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Size Chart Modal */}
      <SizeChartModal open={open} onClose={() => setOpen(false)} />
    </AnimatePage>
  );
};
























