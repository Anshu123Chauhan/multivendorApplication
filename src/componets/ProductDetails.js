import { React, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AnimatePage from "../animation/AnimatePage";
import SizeChartModal from "./SizeChartModal";
import { use } from "react";

export const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainimage, setMainImage] = useState("")
  const [selectedcolor, setSelectedColor] = useState("")
  const [selectedsize, setSelectedSize] = useState("")

  const [selectedImage, setSelectedImage] = useState("");


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
        ...(selectedVariant && { variant: { selectedVariant } }),
      };

      const response = await axios.post(
        "http://localhost:5000/api/ecommerce/cart/add",
        payload,
        {
          headers: {
            Authorization: user.token,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Added to cart:", response.data);
      alert("Product added to cart successfully!");
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
        const response = await axios.get(
          `http://localhost:5000/api/ecommerce/product/${id}`
        );
        const data = response.data;

        setProduct(data);

        // Agar variants hain to first valid variant map se select karo
        if (data.variants && data.variants.length > 0) {
          const firstVariant = data.variants
            .map((v) => (!v.isDeleted ? v : null))
            .find((v) => v !== null);

          if (firstVariant) {
            setSelectedVariant(firstVariant);

            // Set main image
            if (firstVariant.images?.length > 0) {
              setMainImage(firstVariant.images[0]);
            }

            // Set color & size dynamically
            const colorAttr = firstVariant.attributes?.find(
              (attr) => attr.type.toLowerCase() === "color"
            );
            const sizeAttr = firstVariant.attributes?.find(
              (attr) => attr.type.toLowerCase() === "size"
            );

            if (colorAttr) setSelectedColor(colorAttr.value);
            if (sizeAttr) setSelectedSize(sizeAttr.value);
          }
        } else {
          // Agar koi variant nahi hai, product ka main image use karo
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
          <div className="flex justify-center">
            <img
              src={selectedImage || product.images?.[0] || ""}
              alt={product.name}
              className="max-h-[500px] object-contain"
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
              <button
                onClick={handleAddToCart}
                className="bg-amber-700 text-white px-5 py-2 text-sm font-medium shadow hover:bg-amber-800 transition">
                Add to Cart
              </button>
              <button className="border border-amber-700 text-amber-700 px-5 py-2 text-sm font-medium hover:bg-[#c7c7c7] transition">
                Buy Now
              </button>
              <button
                className="text-blue-600 text-sm underline hover:text-blue-800"
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



























// import { React, useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import AnimatePage from "../animation/AnimatePage";
// import SizeChartModal from "./SizeChartModal";

// export const ProductDetails = () => {
//   const { id } = useParams(); // get product ID from route
//   const [product, setProduct] = useState(null); // store fetched product
//   const [open, setOpen] = useState(false);
//   console.log("jjjjjjjjjj", id)

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/ecommerce/product/${id}`
//         );
//         setProduct(response.data);
//       } catch (error) {
//         console.error("Error fetching product:", error);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   if (!product) {
//     return <p className="text-center mt-10">Loading...</p>;
//   }

//   console.log(product)
//   return (
//     <AnimatePage>
//       <SizeChartModal open={open} onClose={() => setOpen(false)} />
//       <div className="bg-gray-50 py-6 font-sans">
//         {/* Using the API product data but keeping the UI exactly same */}
//         <div className="w-full px-24 py-4 flex gap-6">
//           {/* LEFT IMAGE SECTION */}
//           <div className="flex gap-4 w-1/2">
//             {/* Thumbnails */}
//             <div className="flex flex-col gap-3 overflow-y-auto bg-gray-50">
//               {product.variants?.map((variant, i) => (
//                 <div
//                   key={i}
//                   className="p-1 cursor-pointer border border-gray-300 hover:border-amber-800"
//                 >
//                   <img
//                     src={variant.images}
//                     alt={variant.sku}
//                     className="w-16 h-20 object-cover"
//                   />
//                 </div>
//               ))}

//             </div>

//             {/* Main Image */}
//             <div className="flex-1 border flex items-center justify-center">
//               <img
//                 src={product.variants?.[0]?.images[0] || product.images?.[0] || ""}
//                 alt={product.name}
//                 className="max-h-[500px] object-contain"
//               />
//             </div>
//           </div>

//           {/* RIGHT DETAILS SECTION */}
//           <div className="w-1/2 bg-gray-50 text-[#37312F] p-6 text-left">
//             {/* Product Name */}
//             <h2 className="text-2xl font-bold mb-2">{product.name}</h2>

//             {/* Description */}
//             <p className="text-sm text-[#37312F] mb-2">
//               {product.description ||
//                 "This is a high-quality product designed for comfort and durability."}
//             </p>

//             {/* Price (keeping static values as before) */}
//             <div className="mb-2">
//               <div className="flex items-baseline gap-3 mt-2">
//                 <span className="text-2xl font-bold text-gray-800">₹2,079</span>
//                 <span className="line-through text-gray-500">₹3,199</span>
//                 <span className="text-green-600 font-semibold">35% off</span>
//               </div>
//             </div>

//             {/* Reviews */}
//             <div className="flex items-center gap-2 mb-4">
//               <span className="bg-amber-800 text-white px-2 py-0.5 rounded text-sm font-medium">
//                 4★
//               </span>
//               <span className="text-sm">2,817 ratings and 179 reviews</span>
//             </div>

//             {/* Color Options */}
//             <div className="mb-4">
//               <p className="font-medium mb-2 text-left">Color</p>
//               <div className="flex gap-3">
//                 {["Black", "Blue", "Gray"].map((color) => (
//                   <button
//                     key={color}
//                     className="border rounded px-4 py-1 text-sm hover:border-blue-600"
//                   >
//                     {color}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Size Options */}
//             <div className="mb-4">
//               <p className="font-medium mb-2 text-left">Size</p>
//               <div className="flex gap-3 flex-wrap">
//                 {["28", "30", "32", "34", "36", "38"].map((size) => (
//                   <button
//                     key={size}
//                     className="border rounded px-4 py-1 text-sm hover:border-blue-600"
//                   >
//                     {size}
//                   </button>
//                 ))}
//                 <span
//                   className="text-blue-600 underline cursor-pointer"
//                   onClick={() => setOpen(true)}
//                 >
//                   Size Chart
//                 </span>
//               </div>
//             </div>

//             {/* Offers */}
//             <div className="mb-4">
//               <p className="font-medium mb-2 text-left">Available offers</p>
//               <ul className="list-disc list-outside pl-5 text-sm space-y-1 text-[#37312F] text-left">
//                 <li>Bank Offer 10% Off on Supermoney UPI. Max discount of ₹50.</li>
//                 <li>5% Cashback on Flipkart SBI Credit Card upto ₹4,000</li>
//                 <li>5% Cashback on Axis Bank Flipkart Debit Card</li>
//               </ul>
//             </div>

//             {/* Delivery */}
//             <div className="mb-6 text-left">
//               <p className="font-medium mb-2">Deliver to</p>
//               <input
//                 type="text"
//                 placeholder="Enter pincode"
//                 className="border rounded px-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-amber-800"
//               />
//               <p className="text-sm mt-2">Expected delivery by 22 Sep, Monday</p>
//             </div>

//             {/* Buttons */}
//             <div className="flex gap-4 mt-8">
//               <button className="bg-[#37312F] text-white px-8 py-3 rounded font-semibold hover:bg-[#675e5b] transition">
//                 Add to Cart
//               </button>
//               <button className="bg-amber-700 text-white px-8 py-3 rounded font-semibold hover:bg-amber-600 transition">
//                 Buy Now
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </AnimatePage>
//   );
// };
