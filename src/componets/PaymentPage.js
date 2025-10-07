










// import React, { useState } from "react";
// import { CreditCard, Smartphone, Banknote, Wallet, XCircle } from "lucide-react";

// const PaymentPage = () => {
//   const [selectedPayment, setSelectedPayment] = useState("");
//   const [orderPlaced, setOrderPlaced] = useState(false);
//   const [message, setMessage] = useState(""); // for custom messages

//   const paymentMethods = [
//     { id: "cod", label: "Cash on Delivery (COD)", icon: <Banknote size={20} /> },
//     { id: "upi", label: "UPI", icon: <Smartphone size={20} /> },
//     { id: "netbanking", label: "Net Banking", icon: <Banknote size={20} /> },
//     { id: "card", label: "Credit / Debit Card", icon: <CreditCard size={20} /> },
//     { id: "wallet", label: "Wallets", icon: <Wallet size={20} /> },
//   ];

//   const handlePayment = () => {
//     if (selectedPayment === "cod") {
//       setMessage("Thank You! Your order has been placed successfully. You can pay at delivery.");
//     } else {
//       setMessage("Sorry! This payment method is currently not available.");
//     }
//     setOrderPlaced(true);
//   };

//   if (orderPlaced) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
//         {selectedPayment === "cod" ? (
//           <Banknote size={80} className="text-green-600 mb-4" />
//         ) : (
//           <XCircle size={80} className="text-red-600 mb-4" />
//         )}
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">
//           {selectedPayment === "cod" ? "Thank You!" : "Oops!"}
//         </h1>
//         <p className="text-gray-600 text-center mb-6">{message}</p>
//         <button
//           onClick={() => {
//             setOrderPlaced(false);
//             setSelectedPayment("");
//           }}
//           className="px-6 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition"
//         >
//           Back to Payment
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
//       <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
//         Select Payment Method
//       </h2>

//       {/* Two-column layout */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {/* LEFT SIDE - Payment options */}
//         <div className="flex flex-col gap-3">
//           {paymentMethods.map((method) => (
//             <div
//               key={method.id}
//               onClick={() => setSelectedPayment(method.id)}
//               className={`cursor-pointer border rounded-xl p-4 flex justify-between items-center transition 
//                 ${selectedPayment === method.id
//                   ? "border-orange-500 bg-orange-50 shadow-sm"
//                   : "border-gray-300 hover:border-orange-400"
//                 }`}
//             >
//               <div className="flex items-center gap-3">
//                 {method.icon}
//                 <span className="font-medium">{method.label}</span>
//               </div>
//               {selectedPayment === method.id && (
//                 <span className="text-orange-600 font-bold">✓</span>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* RIGHT SIDE - Selected option details */}
//         <div className="border rounded-xl p-6 min-h-[300px] flex flex-col justify-between">
//           {!selectedPayment ? (
//             <p className="text-gray-500 text-center my-auto">
//               Please select a payment method
//             </p>
//           ) : (
//             <>
//               <div className="space-y-4">
//                 {selectedPayment === "upi" && (
//                   <div className="space-y-2">
//                     <label className="text-gray-700 font-medium">Enter UPI ID</label>
//                     <input
//                       type="text"
//                       placeholder="example@upi"
//                       className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                 )}

//                 {selectedPayment === "netbanking" && (
//                   <div className="space-y-2">
//                     <label className="text-gray-700 font-medium">Select Bank</label>
//                     <select className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500">
//                       <option>HDFC Bank</option>
//                       <option>ICICI Bank</option>
//                       <option>SBI</option>
//                       <option>Axis Bank</option>
//                       <option>Other Banks</option>
//                     </select>
//                   </div>
//                 )}

//                 {selectedPayment === "card" && (
//                   <div className="space-y-3">
//                     <input
//                       type="text"
//                       placeholder="Card Number"
//                       className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                     <div className="flex gap-3">
//                       <input
//                         type="text"
//                         placeholder="MM/YY"
//                         className="border border-gray-300 rounded-xl p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       />
//                       <input
//                         type="password"
//                         placeholder="CVV"
//                         maxLength="3"
//                         className="border border-gray-300 rounded-xl p-3 w-28 focus:outline-none focus:ring-2 focus:ring-orange-500"
//                       />
//                     </div>
//                     <input
//                       type="text"
//                       placeholder="Cardholder Name"
//                       className="border border-gray-300 rounded-xl p-3 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
//                     />
//                   </div>
//                 )}

//                 {selectedPayment === "wallet" && (
//                   <div>
//                     <p className="font-medium mb-2">Select Wallet</p>
//                     <div className="flex gap-3 flex-wrap">
//                       {["PhonePe", "Paytm", "Google Pay", "Mobikwik"].map((wallet) => (
//                         <button
//                           key={wallet}
//                           className="px-4 py-2 border rounded-xl hover:bg-orange-50 transition"
//                         >
//                           {wallet}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {selectedPayment === "cod" && (
//                   <p className="text-gray-700 font-medium">
//                     You can pay in cash when your order is delivered.
//                   </p>
//                 )}
//               </div>

//               {/* Action Button */}
//               <button
//                 onClick={handlePayment}
//                 className="mt-6 w-full bg-orange-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-orange-700 transition"
//               >
//                 {selectedPayment === "cod" ? "Place Order" : "Pay Now"}
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;
