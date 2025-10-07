import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { apiurl } from "../config/config";

const FALLBACK_VIDEO = "https://cdn.pixabay.com/video/2015/11/10/1309-145351537_medium.mp4";

const resolveMediaType = (src = "") => src.toLowerCase().match(/\.(mp4|mov|webm)$/);



export default function HeroBanner() {
    const [banners, setBanners] = useState([]);
    const [activeBanner, setActiveBanner] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBanners = async () => {
            setLoading(true);
            try {
                const base = apiurl || "http://localhost:5000";
                const response = await axios.get(`${base}/ecommerce/banners`);
                const entries = response?.data?.data.filter((banner) => banner?.status !== "inactive");
                setBanners(entries);
                if (entries.length > 0) {
                    setActiveBanner(0);
                }
            } catch (error) {
                console.error("Failed to fetch banners", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) {
            return;
        }

        const timer = setInterval(() => {
            setActiveBanner((prev) => (prev + 1) % banners.length);
        }, 10000);

        return () => clearInterval(timer);
    }, [banners.length]);

    const heroBanner = useMemo(() => banners[activeBanner], [banners, activeBanner]);
    const heroMedia = heroBanner?.image || FALLBACK_VIDEO;
    const isVideo = resolveMediaType(heroMedia);

    const heroButtons = useMemo(() => {
        if (!heroBanner) {
            return [];
        }

        return [
            { label: heroBanner.button1, url: heroBanner.url1 },
            { label: heroBanner.button2, url: heroBanner.url2 },
        ].filter((button) => button.label);
    }, [heroBanner]);

    const heroHeading ="NEW FOR YOU";
    const heroDescription = heroBanner?.description || "Discover curated styles tailored just for you.";

    return (
        <section className="relative h-screen w-full text-white">
            <div className="absolute inset-0">
                {isVideo ? (
                    <video
                        key={heroMedia}
                        src={heroMedia}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <img
                        key={heroMedia}
                        src={heroMedia}
                        alt={heroHeading}
                        className="h-full w-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="relative z-10 flex h-full flex-col items-center justify-end gap-4 px-4 pb-20 text-center">
                {loading && banners.length === 0 && (
                    <span className="rounded-full bg-white/20 px-4 py-1 text-xs uppercase tracking-[0.3em]">
                        Loading...
                    </span>
                )}
                <h2 className="text-3xl font-nunito tracking-[0.4em] sm:text-4xl">{heroHeading}</h2>
                {heroDescription && (
                    <p className="max-w-2xl text-sm text-white/80 sm:text-base">{heroDescription}</p>
                )}
                <div className="flex flex-wrap justify-center gap-4">
                    {heroButtons.length > 0 ? (
                        heroButtons.map(({ label, url }) => (
                            <a
                                key={label}
                                href={url || "#"}
                                target={url ? "_blank" : undefined}
                                rel={url ? "noopener noreferrer" : undefined}
                                className="font-nunito rounded-full bg-[#37312F] px-6 py-2 text-sm font-semibold shadow-lg transition hover:bg-white hover:text-[#2F251F] uppercase"
                            >
                                {label}
                            </a>
                        ))
                    ) : (
                        <button className="font-nunito rounded-full bg-[#37312F] px-6 py-2 text-sm font-semibold shadow-lg transition hover:bg-white hover:text-[#2F251F]">
                            Explore Now
                        </button>
                    )}
                </div>
            </div>

            {banners.length > 1 && (
                <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveBanner(index)}
                            className={`h-2.5 w-2.5 rounded-full transition ${
                                activeBanner === index ? "bg-white" : "bg-white/50"
                            }`}
                            aria-label={`View banner ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
