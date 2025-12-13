import { useNavigate } from 'react-router-dom';
import HeroImage from '../assets/hero-bg.png';

const Hero = () => {
    const navigate = useNavigate();

    const handleShopClick = (category) => {
        navigate(`/shop?category=${category}`);
    };

    return (
        <div className="relative h-[90vh] w-full bg-black flex items-center justify-center overflow-hidden">
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={HeroImage}
                    alt="Fashion Hero"
                    className="w-full h-full object-cover opacity-90 scale-105 animate-subtle-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-10 max-w-5xl px-6 animate-fade-in-up">
                <span className="inline-block text-white/90 text-xs md:text-sm tracking-[0.3em] uppercase font-bold border-b border-white/30 pb-2 cursor-default">
                    Est. 2024 Collection
                </span>
                <h1 className="text-7xl md:text-9xl font-serif text-white font-medium tracking-tighter drop-shadow-2xl leading-[0.9]">
                    <span className="block">ELEGANCE</span>
                    <span className="block italic font-light text-white/90">REDEFINED</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
                    A curated selection of premium apparel designed for the modern individual.
                </p>
                {/* Buttons removed as per request */}
            </div>
        </div>
    );
};

export default Hero;
