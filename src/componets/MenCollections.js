import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

function MenCollections() {
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef();

    const menu = [
        {
            title: "Topwear",
            items: [
                "T-Shirts",
                "Casual Shirts",
                "Formal Shirts",
                "Sweatshirts",
                "Sweaters",
                "Jackets",
                "Blazers & Coats",
                "Suits",
                "Rain Jackets",
            ],
        },
        {
            title: "Indian & Festive Wear",
            items: ["Kurtas & Kurta Sets", "Sherwanis", "Nehru Jackets", "Dhotis"],
        },
        {
            title: "Bottomwear",
            items: [
                "Jeans",
                "Casual Trousers",
                "Formal Trousers",
                "Shorts",
                "Track Pants & Joggers",
            ],
        },
        {
            title: "Innerwear & Sleepwear",
            items: [
                "Briefs & Trunks",
                "Boxers",
                "Vests",
                "Sleepwear & Loungewear",
                "Thermals",
            ],
        },
        {
            title: "Footwear",
            items: [
                "Casual Shoes",
                "Sports Shoes",
                "Formal Shoes",
                "Sneakers",
                "Sandals & Floaters",
                "Flip Flops",
                "Socks",
            ],
        },
        {
            title: "Sports & Active Wear",
            items: [
                "Sports Shoes",
                "Sports Sandals",
                "Active T-Shirts",
                "Track Pants & Shorts",
                "Tracksuits",
                "Jackets & Sweatshirts",
                "Sports Accessories",
                "Swimwear",
            ],
        },
        {
            title: "Fashion Accessories",
            items: [
                "Wallets",
                "Belts",
                "Perfumes & Body Mists",
                "Trimmers",
                "Deodorants",
                "Ties, Cufflinks & Pocket Squares",
                "Accessory Gift Sets",
                "Caps & Hats",
                "Mufflers, Scarves & Gloves",
                "Phone Cases",
                "Rings & Wristwear",
                "Helmets",
                "Bags & Backpacks",
                "Luggages & Trolleys",
            ],
        },
    ];

    return (
        <div
            className="relative"
            ref={popupRef}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* Trigger */}
            <Link
                to="/shop"
                className="text-white text-sm md:text-base cursor-pointer hover:text-amber-800"
            >
                MEN
            </Link>

            {/* Popup */}
            {isOpen && (
                <div className="absolute left-1/2 md:left-48 top-6 transform -translate-x-1/2 w-[98vw] md:w-[1200px] bg-white shadow-lg border-t z-50 rounded-lg">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6 px-6 py-6">
                        {menu.map((section, idx) => (
                            <div key={idx}>
                                <h3 className="font-semibold uppercase text-[11px] sm:text-[12px] md:text-[13px] text-red-500 mb-2 tracking-wide">
                                    {section.title}
                                </h3>
                                <ul className="space-y-1 text-[11px] sm:text-[12px] md:text-[13px] text-gray-700">
                                    {section.items.map((item, i) => (
                                        <li
                                            key={i}
                                            className="hover:text-amber-800 cursor-pointer transition hover:underline underline-offset-2"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

            )}
        </div>
    );
}

export default MenCollections;
