import React, { useState, useEffect } from "react";

export default function OffersBanner() {
    const offers = [
        {
            text: "🔥 Discover the Latest Trends — Just Arrived!",
            img: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            text: "👜 Elevate Your Style with Our Exclusive Collections",
            img: "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            text: "👟 Designed for Comfort. Made to Move.",
            img: "https://plus.unsplash.com/premium_photo-1676166012743-aee27f3415a7?q=80&w=1367&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            text: "🎁 Seamless Shopping, Stunning Styles – Only Here",
            img: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
    ];

    const [current, setCurrent] = useState(0);
    const [flip, setFlip] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFlip(true); // start flip
            setTimeout(() => {
                setCurrent((prev) => (prev + 1) % offers.length);
                setFlip(false); // reset flip after change
            }, 1000); // flip animation = 1s
        }, 3000); // 1s flip + 2s hold = 3s total cycle

        return () => clearInterval(interval);
    }, [offers.length]);

    return (
        <section className="py-12  bg-gray-50 flex justify-center items-center">
            <div className="w-full h-56 perspective overflow-hidden">
                <div
                    className={`relative w-full h-full ${flip ? "animate-card-flip" : ""
                        }`}
                >
                    <img
                        src={offers[current].img}
                        alt="Offer"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <h3 className="text-white text-4xl font-bold px-4 text-center">
                            {offers[current].text}
                        </h3>
                    </div>
                </div>
            </div>
        </section>
    );
}
