import { data } from "autoprefixer";
import { useSelector, useDispatch } from "react-redux";


const SizeChartModal = ({ open, onClose }) => {
    const { product } = useSelector((state) => state.allCart);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {product.map((data) => (
                <div className="bg-white rounded-lg w-[850px] max-h-[90vh] overflow-y-auto text-[#37312F] shadow-lg relative">
                    {/* Close Button */}
                    <button
                        className="absolute top-2 right-4 text-2xl font-bold text-[#37312F] hover:text-amber-700"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                    {/* Product Info */}
                    <div className="flex gap-4 p-6 border-b">
                        <img
                            src={data.img}
                            alt="Product"
                            className="w-28 h-32 object-cover rounded"
                        />
                        <div className="text-left">
                            <h2 className="text-lg font-bold">{data.title}</h2>
                            <p className="text-sm">
                               {data.description}
                            </p>
                            <p className="mt-2">
                                <span className="text-xl font-bold">₹377</span>{" "}
                                <span className="line-through text-gray-500">₹1799</span>{" "}
                                <span className="text-green-500 font-semibold">(79% OFF)</span>
                            </p>
                            <p className="text-sm mt-1">Get it by Thu, Sep 25 - 201307</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b text-sm font-medium">
                        <button className="flex-1 py-3 text-center border-b-2 border-amber-800 text-amber-800">
                            Size Chart
                        </button>
                        <button className="flex-1 py-3 text-center hover:text-amber-800">
                            How to measure
                        </button>
                    </div>

                    {/* Unit Toggle */}
                    <div className="flex justify-end items-center p-4">
                        <div className="flex border rounded-full overflow-hidden text-xs">
                            <button className="px-3 py-1 bg-[#37312F] text-white">in</button>
                            <button className="px-3 py-1 text-[#37312F]">cm</button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="p-6">
                        <table className="w-full border text-sm text-center">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-2 py-2">Size</th>
                                    <th className="border px-2 py-2">Brand Size</th>
                                    <th className="border px-2 py-2">Chest (in)</th>
                                    <th className="border px-2 py-2">Front Length (in)</th>
                                    <th className="border px-2 py-2">Across Shoulder (in)</th>
                                    <th className="border px-2 py-2">Waist (in)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { size: "39", brand: "S", chest: "41.0", length: "29.0", shoulder: "17.1", waist: "37.0" },
                                    { size: "40", brand: "M", chest: "43.0", length: "29.5", shoulder: "17.9", waist: "39.0" },
                                    { size: "42", brand: "L", chest: "45.0", length: "30.0", shoulder: "18.6", waist: "41.0" },
                                    { size: "44", brand: "XL", chest: "47.0", length: "30.5", shoulder: "19.4", waist: "43.0" },
                                ].map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="border px-2 py-2">{row.size}</td>
                                        <td className="border px-2 py-2">{row.brand}</td>
                                        <td className="border px-2 py-2">{row.chest}</td>
                                        <td className="border px-2 py-2">{row.length}</td>
                                        <td className="border px-2 py-2">{row.shoulder}</td>
                                        <td className="border px-2 py-2">{row.waist}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SizeChartModal;
