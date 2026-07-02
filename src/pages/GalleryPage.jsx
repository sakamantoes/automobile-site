import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Search,
  ArrowUpRight,
  Gauge,
  Fuel,
  Settings2,
  Star,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  Car,
  Users,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  Wrench,
  Cog,
  Menu,
} from 'lucide-react';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import images from '../assets/image.js';

// Use local images for cars
const LOCAL_CAR_IMAGES = [
  images.Car1, images.Car2, images.Car3, images.Car4, images.Car5,
  images.Car6, images.Car7, images.Car8, images.Car9, images.Car10,
  images.Car11, images.Car12, images.Car13, images.Car14, images.Car15,
  images.Car16, images.Car17, images.Car18, images.Car19, images.Car20,
  images.Car21, images.Car22, images.Car23, images.Car24, images.Car25,
  images.Car26, images.Car27,
];

// Pexels car images for additional vehicles
const PEXELS_CAR_IMAGES = [
  "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1200", // Sports car
  "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1200", // Luxury car
  "https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?auto=compress&cs=tinysrgb&w=1200", // SUV
  "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=1200", // Mercedes
  "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1200", // BMW
  "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=1200", // Audi
  "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1200", // Porsche
  "https://images.pexels.com/photos/119435/pexels-photo-119435.jpeg?auto=compress&cs=tinysrgb&w=1200", // Ferrari
  "https://images.pexels.com/photos/103510/pexels-photo-103510.jpeg?auto=compress&cs=tinysrgb&w=1200", // Lamborghini
  "https://images.pexels.com/photos/1394661/pexels-photo-1394661.jpeg?auto=compress&cs=tinysrgb&w=1200", // Tesla
  "https://images.pexels.com/photos/1317990/pexels-photo-1317990.jpeg?auto=compress&cs=tinysrgb&w=1200", // Range Rover
  "https://images.pexels.com/photos/1255675/pexels-photo-1255675.jpeg?auto=compress&cs=tinysrgb&w=1200", // Lexus
  "https://images.pexels.com/photos/169878/pexels-photo-169878.jpeg?auto=compress&cs=tinysrgb&w=1200", // Toyota
  "https://images.pexels.com/photos/170809/pexels-photo-170809.jpeg?auto=compress&cs=tinysrgb&w=1200", // Honda
  "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1200", // Nissan
  "https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?auto=compress&cs=tinysrgb&w=1200", // Hyundai
  "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=1200", // Kia
  "https://images.pexels.com/photos/112460/pexels-photo-112460.jpeg?auto=compress&cs=tinysrgb&w=1200", // Mazda
  "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=1200", // Subaru
  "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1200", // Volvo
  "https://images.pexels.com/photos/119435/pexels-photo-119435.jpeg?auto=compress&cs=tinysrgb&w=1200", // Jaguar
  "https://images.pexels.com/photos/103510/pexels-photo-103510.jpeg?auto=compress&cs=tinysrgb&w=1200", // Bentley
  "https://images.pexels.com/photos/1394661/pexels-photo-1394661.jpeg?auto=compress&cs=tinysrgb&w=1200", // Aston Martin
  "https://images.pexels.com/photos/1317990/pexels-photo-1317990.jpeg?auto=compress&cs=tinysrgb&w=1200", // Maserati
  "https://images.pexels.com/photos/1255675/pexels-photo-1255675.jpeg?auto=compress&cs=tinysrgb&w=1200", // Alfa Romeo
  "https://images.pexels.com/photos/169878/pexels-photo-169878.jpeg?auto=compress&cs=tinysrgb&w=1200", // Dodge
  "https://images.pexels.com/photos/170809/pexels-photo-170809.jpeg?auto=compress&cs=tinysrgb&w=1200", // Chevrolet
  "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1200", // Ford
  "https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?auto=compress&cs=tinysrgb&w=1200", // Jeep
  "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=1200", // Land Rover
];

// Combine local and Pexels images
const ALL_CAR_IMAGES = [...LOCAL_CAR_IMAGES, ...PEXELS_CAR_IMAGES];

const carMakes = [
  "Toyota", "Honda", "Ford", "Chevrolet", "BMW", "Mercedes-Benz", 
  "Audi", "Lexus", "Porsche", "Ferrari", "Lamborghini", "Tesla",
  "Range Rover", "Volvo", "Jaguar", "Maserati", "Bentley", "Aston Martin",
  "Hyundai", "Kia", "Mazda", "Subaru", "Nissan", "Dodge", "Jeep"
];

const carModels = [
  "Camry", "Civic", "Mustang", "Corvette", "3 Series", "C-Class",
  "A4", "ES 350", "911", "F8 Tributo", "Aventador", "Model S",
  "Sport", "XC90", "F-PACE", "Ghibli", "Continental", "DB11",
  "Sonata", "Stinger", "MX-5", "WRX", "GT-R", "Challenger", "Wrangler"
];

const years = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];

const colors = ["Black", "White", "Silver", "Red", "Blue", "Green", "Yellow", "Orange"];

const transmissions = ["Automatic", "Manual", "CVT"];

const fuelTypes = ["Petrol", "Diesel", "Hybrid", "Electric"];

// Generate a large list of cars
const generateCars = () => {
  const cars = [];
  const totalCars = 60; // Generate 60 cars
  
  for (let i = 0; i < totalCars; i++) {
    const make = carMakes[i % carMakes.length];
    const model = carModels[i % carModels.length];
    const year = years[i % years.length];
    const color = colors[i % colors.length];
    const transmission = transmissions[i % transmissions.length];
    const fuel = fuelTypes[i % fuelTypes.length];
    const mileage = Math.floor(Math.random() * 50000) + 5000;
    const price = Math.floor(Math.random() * 80000) + 15000;
    
    // Randomly decide if we use local or pexels image
    const imgIndex = i % ALL_CAR_IMAGES.length;
    const image = ALL_CAR_IMAGES[imgIndex];
    
    cars.push({
      id: i + 1,
      name: `${make} ${model}`,
      make: make,
      model: model,
      year: year,
      color: color,
      transmission: transmission,
      fuel: fuel,
      mileage: mileage.toLocaleString(),
      price: `$${price.toLocaleString()}`,
      priceNum: price,
      img: image,
      specs: [transmission, fuel, `${mileage.toLocaleString()} mi`],
      rating: (4 + Math.random() * 0.9).toFixed(1),
      inStock: Math.random() > 0.2,
      featured: Math.random() > 0.8,
      newArrival: Math.random() > 0.7,
    });
  }
  
  return cars;
};

const allCars = generateCars();

// Filter options
const filterOptions = {
  makes: [...new Set(allCars.map(car => car.make))].sort(),
  years: [...new Set(allCars.map(car => car.year))].sort().reverse(),
  colors: [...new Set(allCars.map(car => car.color))].sort(),
  transmissions: [...new Set(allCars.map(car => car.transmission))].sort(),
  fuelTypes: [...new Set(allCars.map(car => car.fuel))].sort(),
};

// Lightbox Component
function CarLightbox({ car, onClose, allImages }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    // Get a selection of images for the lightbox
    const carImages = [];
    const startIdx = allCars.indexOf(car);
    for (let i = 0; i < Math.min(5, allCars.length); i++) {
      const idx = (startIdx + i) % allCars.length;
      carImages.push(allCars[idx].img);
    }
    setLightboxImages(carImages);
  }, [car]);

  if (!car) return null;

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
      style={{
        background: "rgba(0,0,0,0.95)",
        backdropFilter: "blur(20px)",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        className="relative bg-[#1a1a1a] rounded-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "slideUp 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full shadow-lg hover:bg-black/70 transition-colors"
          style={{ color: "#ffffff" }}
        >
          <X size={28} />
        </button>

        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="font-display text-2xl font-bold" style={{ color: "#ffffff" }}>
                {car.name}
              </h2>
              <p className="font-mono text-sm" style={{ color: "#999" }}>
                {car.year} · {car.color}
              </p>
            </div>
            <span className="font-display text-2xl font-bold" style={{ color: "var(--accent)" }}>
              {car.price}
            </span>
          </div>

          {/* Gallery */}
          <div className="relative mt-4">
            <div className="relative overflow-hidden rounded-xl" style={{ background: "#0a0a0a", height: 400 }}>
              <img
                src={lightboxImages[currentIndex] || car.img}
                alt={`${car.name} view ${currentIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </div>

            {lightboxImages.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full shadow-lg hover:bg-black/70 transition-colors"
                  style={{ color: "#ffffff" }}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 rounded-full shadow-lg hover:bg-black/70 transition-colors"
                  style={{ color: "#ffffff" }}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {lightboxImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    i === currentIndex ? "border-[var(--accent)]" : "border-transparent"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="p-3 rounded-lg" style={{ background: "#0a0a0a" }}>
              <p className="text-xs font-mono" style={{ color: "#666" }}>Transmission</p>
              <p className="font-medium" style={{ color: "#ffffff" }}>{car.transmission}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "#0a0a0a" }}>
              <p className="text-xs font-mono" style={{ color: "#666" }}>Fuel</p>
              <p className="font-medium" style={{ color: "#ffffff" }}>{car.fuel}</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "#0a0a0a" }}>
              <p className="text-xs font-mono" style={{ color: "#666" }}>Mileage</p>
              <p className="font-medium" style={{ color: "#ffffff" }}>{car.mileage} mi</p>
            </div>
            <div className="p-3 rounded-lg" style={{ background: "#0a0a0a" }}>
              <p className="text-xs font-mono" style={{ color: "#666" }}>Year</p>
              <p className="font-medium" style={{ color: "#ffffff" }}>{car.year}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button className="flex-1 btn-primary justify-center">
              <Calendar size={18} />
              Book a Test Drive
            </button>
            <button className="flex-1 btn-outline justify-center">
              <Phone size={18} />
              Contact Dealer
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

// Car Card Component
function CarCard({ car, onOpen }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, sx: 50, sy: 50, active: false });

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 8,
      ry: (px - 0.5) * 10,
      sx: px * 100,
      sy: py * 100,
      active: true,
    });
  }, []);

  const onLeave = useCallback(() => {
    setTilt((t) => ({ ...t, rx: 0, ry: 0, active: false }));
  }, []);

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="car-card cursor-pointer"
      onClick={() => onOpen(car)}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) ${
          tilt.active ? "scale3d(1.015,1.015,1.015)" : "scale3d(1,1,1)"
        }`,
      }}
    >
      <div className="car-card-media">
        <img src={car.img} alt={car.name} loading="lazy" />
        <div
          className="car-card-spot"
          style={{
            opacity: tilt.active ? 1 : 0,
            background: `radial-gradient(circle at ${tilt.sx}% ${tilt.sy}%, rgba(255,255,255,0.08), transparent 45%)`,
          }}
        />
        {car.featured && (
          <span className="car-badge featured">Featured</span>
        )}
        {car.newArrival && (
          <span className="car-badge new">New</span>
        )}
        {!car.inStock && (
          <span className="car-badge sold">Sold</span>
        )}
      </div>
      <div className="car-card-body">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display" style={{ fontSize: 17, fontWeight: 600, color: "var(--text)" }}>
            {car.name}
          </h3>
          <div className="flex items-center gap-1">
            <Star size={14} color="var(--accent)" fill="var(--accent)" />
            <span style={{ fontSize: 13, color: "var(--text)" }}>{car.rating}</span>
          </div>
        </div>
        <p className="font-mono" style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
          {car.year} · {car.color}
        </p>
        <div className="car-specs">
          <span>
            <Settings2 size={13} /> {car.transmission}
          </span>
          <span>
            <Fuel size={13} /> {car.fuel}
          </span>
          <span>
            <Gauge size={13} /> {car.mileage}
          </span>
        </div>
        <div className="flex items-center justify-between" style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
          <span className="font-display" style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>
            {car.price}
          </span>
          <span className="flex items-center gap-1" style={{ fontSize: 12, color: "var(--muted)" }}>
            View Details <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </article>
  );
}

// Navbar Component
function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0"
      style={{
        zIndex: 60,
        transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
        background: scrolled ? "rgba(0,0,0,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: `1px solid ${scrolled ? "var(--line)" : "transparent"}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between" style={{ height: 76 }}>
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
              boxShadow: "0 4px 16px rgba(0,102,204,0.35)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img 
              src={images.Logo2} 
              alt="Lord Group Autos" 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover",
                display: "block",
              }} 
            />
          </span>
          <span 
            className="font-display" 
            style={{ 
              fontSize: 20, 
              fontWeight: 700, 
              letterSpacing: "-0.02em", 
              color: "var(--text)",
              lineHeight: 1.2,
            }}
          >
            Lord Group
            <span style={{ color: "var(--accent)" }}> AUTOS</span>
          </span>
        </div>
        <nav className="hidden lg:flex items-center gap-8">
          <a href="/" className="nav-link">Home</a>
          <a href="/gallery" className="nav-link" style={{ color: "var(--accent)" }}>Gallery</a>
          <a href="/spare-parts" className="nav-link">Spare Parts</a>
          <a href="/#about" className="nav-link">About</a>
          <a href="/#contact" className="nav-link">Contact</a>
        </nav>
        <button className="icon-btn lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={19} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: 90,
          pointerEvents: open ? "auto" : "none",
          opacity: open ? 1 : 0,
          transition: "opacity 0.35s ease",
          background: "rgba(0,0,0,0.98)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between" style={{ height: 76 }}>
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center"
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img 
                src={images.Logo2} 
                alt="Lord Group Autos" 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover",
                  display: "block",
                }} 
              />
            </span>
            <span className="font-display" style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
              Lord Group<span style={{ color: "var(--accent)" }}> AUTOS</span>
            </span>
          </div>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={19} />
          </button>
        </div>
        <nav className="flex flex-col px-8 pt-6 gap-1">
          <a href="/" onClick={() => setOpen(false)} className="font-display" style={{ fontSize: 28, padding: "14px 0", borderBottom: "1px solid var(--line)", color: "var(--text)" }}>Home</a>
          <a href="/gallery" onClick={() => setOpen(false)} className="font-display" style={{ fontSize: 28, padding: "14px 0", borderBottom: "1px solid var(--line)", color: "var(--accent)" }}>Gallery</a>
          <a href="/spare-parts" onClick={() => setOpen(false)} className="font-display" style={{ fontSize: 28, padding: "14px 0", borderBottom: "1px solid var(--line)", color: "var(--text)" }}>Spare Parts</a>
          <a href="/#about" onClick={() => setOpen(false)} className="font-display" style={{ fontSize: 28, padding: "14px 0", borderBottom: "1px solid var(--line)", color: "var(--text)" }}>About</a>
          <a href="/#contact" onClick={() => setOpen(false)} className="font-display" style={{ fontSize: 28, padding: "14px 0", borderBottom: "1px solid var(--line)", color: "var(--text)" }}>Contact</a>
        </nav>
      </div>
    </header>
  );
}

// Footer Component
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)", marginTop: 70 }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img 
              src={images.Logo2} 
              alt="Lord Group Autos" 
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover",
                display: "block",
              }} 
            />
          </span>
          <span className="font-display" style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>
            Lord Group<span style={{ color: "var(--accent)" }}> AUTOS</span>
          </span>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--muted)" }} className="text-center">
          Victoria Island, Lagos, Nigeria
        </p>
        <div className="flex items-center gap-4">
          <FaFacebook size={16} color="var(--muted)" className="hover:text-[#1877f2] transition-colors cursor-pointer" />
          <FaTwitter size={16} color="var(--muted)" className="hover:text-[#1da1f2] transition-colors cursor-pointer" />
          <FaInstagram size={16} color="var(--muted)" className="hover:text-[#e4405f] transition-colors cursor-pointer" />
          <FaLinkedin size={16} color="var(--muted)" className="hover:text-[#0a66c2] transition-colors cursor-pointer" />
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--line)" }}>
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-center">
          <p style={{ fontSize: 11.5, color: "var(--muted)" }}>&copy; 2026 Lord Group Motors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Main Gallery Page Component
const GalleryPage = () => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [filteredCars, setFilteredCars] = useState(allCars);
  const [filters, setFilters] = useState({
    make: '',
    year: '',
    color: '',
    transmission: '',
    fuel: '',
    priceRange: '',
    search: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 12;

  // Apply filters
  useEffect(() => {
    let result = [...allCars];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(car => 
        car.name.toLowerCase().includes(searchLower) ||
        car.make.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower)
      );
    }

    if (filters.make) {
      result = result.filter(car => car.make === filters.make);
    }

    if (filters.year) {
      result = result.filter(car => car.year === filters.year);
    }

    if (filters.color) {
      result = result.filter(car => car.color === filters.color);
    }

    if (filters.transmission) {
      result = result.filter(car => car.transmission === filters.transmission);
    }

    if (filters.fuel) {
      result = result.filter(car => car.fuel === filters.fuel);
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(car => car.priceNum >= min && car.priceNum <= max);
    }

    setFilteredCars(result);
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      make: '',
      year: '',
      color: '',
      transmission: '',
      fuel: '',
      priceRange: '',
      search: '',
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const endIndex = startIndex + carsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-root">
      <GlobalStyle />
      <NavBar />

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ paddingTop: 76 }}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, rgba(0,102,204,0.15), transparent 60%), var(--bg)",
          }}
        />
        <div className="relative max-w-6xl mx-auto text-center px-6 pt-16 pb-12">
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
              lineHeight: 1.04,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--text)",
            }}
          >
            Explore Our
            <br />
            <span style={{ color: "var(--accent)" }}>Premium Collection</span>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 17, marginTop: 16, maxWidth: 520, marginInline: "auto" }}>
            {filteredCars.length} vehicles available — each thoroughly inspected and ready for delivery
          </p>

          {/* Search Bar */}
          <div className="search-bar" style={{ marginTop: 30 }}>
            <Search size={18} color="var(--muted)" style={{ marginLeft: 10 }} />
            <input
              type="text"
              placeholder="Search by make, model..."
              className="search-input"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
            <button 
              className="search-submit"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} color="#ffffff" />
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            className="btn-outline"
            onClick={() => setShowFilters(!showFilters)}
            style={{ marginTop: 16 }}
          >
            <Filter size={16} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <div className="max-w-7xl mx-auto px-6 md:px-10" style={{ marginTop: 20 }}>
          <div className="filters-panel">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Make</label>
                <select
                  className="filter-select"
                  value={filters.make}
                  onChange={(e) => handleFilterChange('make', e.target.value)}
                >
                  <option value="">All Makes</option>
                  {filterOptions.makes.map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Year</label>
                <select
                  className="filter-select"
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                >
                  <option value="">All Years</option>
                  {filterOptions.years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Color</label>
                <select
                  className="filter-select"
                  value={filters.color}
                  onChange={(e) => handleFilterChange('color', e.target.value)}
                >
                  <option value="">All Colors</option>
                  {filterOptions.colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Transmission</label>
                <select
                  className="filter-select"
                  value={filters.transmission}
                  onChange={(e) => handleFilterChange('transmission', e.target.value)}
                >
                  <option value="">All</option>
                  {filterOptions.transmissions.map(trans => (
                    <option key={trans} value={trans}>{trans}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Fuel Type</label>
                <select
                  className="filter-select"
                  value={filters.fuel}
                  onChange={(e) => handleFilterChange('fuel', e.target.value)}
                >
                  <option value="">All</option>
                  {filterOptions.fuelTypes.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Price Range</label>
                <select
                  className="filter-select"
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                >
                  <option value="">Any Price</option>
                  <option value="15000-25000">$15,000 - $25,000</option>
                  <option value="25000-40000">$25,000 - $40,000</option>
                  <option value="40000-60000">$40,000 - $60,000</option>
                  <option value="60000-80000">$60,000 - $80,000</option>
                  <option value="80000-100000">$80,000+</option>
                </select>
              </div>
            </div>

            <div className="filters-actions">
              <button className="btn-outline" onClick={clearFilters}>
                Clear All
              </button>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>
                {filteredCars.length} vehicles found
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Car Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-10" style={{ paddingTop: 50 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentCars.map((car, index) => (
            <CarCard key={car.id} car={car} onOpen={setSelectedCar} />
          ))}
        </div>

        {/* Empty State */}
        {currentCars.length === 0 && (
          <div className="text-center" style={{ padding: 80 }}>
            <Car size={64} color="var(--muted)" />
            <h3 className="font-display" style={{ fontSize: 24, color: "var(--text)", marginTop: 20 }}>
              No vehicles found
            </h3>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>
              Try adjusting your filters to find more options
            </p>
            <button className="btn-outline" onClick={clearFilters} style={{ marginTop: 16 }}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination" style={{ marginTop: 40, display: 'flex', justifyContent: 'center', gap: 8 }}>
            <button
              className="pagination-btn"
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="pagination-btn"
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </section>

      {/* Lightbox */}
      {selectedCar && (
        <CarLightbox car={selectedCar} onClose={() => setSelectedCar(null)} allImages={allCars} />
      )}

      <Footer />

      {/* Global Styles */}
      <GlobalStyle />
    </div>
  );
};

// Global Style Component
function GlobalStyle() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

      :root {
        --bg: #0a0a0a;
        --surface: #1a1a1a;
        --surface-alt: #2a2a2a;
        --line: #333333;
        --line-strong: #444444;
        --text: #ffffff;
        --muted: #999999;
        --accent: #0066cc;
        --accent-deep: #004d99;
      }

      * { box-sizing: border-box; }

      .app-root {
        background: var(--bg);
        color: var(--text);
        font-family: 'Inter', sans-serif;
        min-height: 100vh;
        overflow-x: hidden;
      }

      .font-display { font-family: 'Space Grotesk', sans-serif; }
      .font-mono { font-family: 'IBM Plex Mono', monospace; }

      .nav-link {
        font-size: 14px;
        color: var(--muted);
        transition: color 0.25s ease;
        text-decoration: none;
      }
      .nav-link:hover { color: var(--text); }

      .icon-btn {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--surface);
        border: 1px solid var(--line);
        color: var(--text);
        transition: border-color 0.25s ease, background 0.25s ease;
        cursor: pointer;
      }
      .icon-btn:hover { border-color: var(--accent); background: var(--surface-alt); }

      .btn-outline {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border-radius: 999px;
        border: 1px solid var(--line-strong);
        font-size: 13.5px;
        color: var(--text);
        transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        background: transparent;
        cursor: pointer;
        text-decoration: none;
      }
      .btn-outline:hover {
        border-color: var(--accent);
        background: rgba(0,102,204,0.15);
        transform: translateY(-1px);
      }

      .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 14px 26px;
        border-radius: 999px;
        border: none;
        cursor: pointer;
        background: var(--accent);
        color: #ffffff;
        font-weight: 600;
        font-size: 14.5px;
        box-shadow: 0 10px 30px rgba(0,102,204,0.28);
        transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        text-decoration: none;
      }
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 16px 36px rgba(0,102,204,0.4);
        background: #0080ff;
      }

      .search-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--surface);
        border: 1px solid var(--line-strong);
        border-radius: 999px;
        padding: 6px;
        max-width: 520px;
        margin-inline: auto;
      }
      .search-input {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: var(--text);
        font-size: 14px;
        padding: 10px 4px;
      }
      .search-input::placeholder { color: var(--muted); }
      .search-submit {
        width: 40px;
        height: 40px;
        border-radius: 999px;
        border: none;
        cursor: pointer;
        background: var(--accent);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: background 0.25s ease;
      }
      .search-submit:hover { background: #0080ff; }

      .car-card {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 20px;
        overflow: hidden;
        transition: transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease;
        transform-style: preserve-3d;
        will-change: transform;
        height: 100%;
      }
      .car-card:hover {
        border-color: var(--line-strong);
        box-shadow: 0 24px 50px rgba(0,0,0,0.5);
      }
      .car-card-media {
        position: relative;
        height: 200px;
        overflow: hidden;
        background: var(--bg);
      }
      .car-card-media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
      .car-card:hover .car-card-media img { transform: scale(1.06); }
      .car-card-spot {
        position: absolute;
        inset: 0;
        transition: opacity 0.2s ease;
        pointer-events: none;
      }
      .car-card-body { padding: 16px 18px 18px; }
      .car-specs {
        display: flex;
        gap: 12px;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid var(--line);
      }
      .car-specs span {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: var(--muted);
      }

      .car-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 4px 12px;
        border-radius: 999px;
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .car-badge.featured {
        background: var(--accent);
        color: #ffffff;
      }
      .car-badge.new {
        background: #22c55e;
        color: #ffffff;
      }
      .car-badge.sold {
        background: #ef4444;
        color: #ffffff;
      }

      .filters-panel {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 20px 24px;
      }
      .filters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
      }
      .filter-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .filter-label {
        font-size: 12px;
        font-weight: 600;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .filter-select {
        background: var(--bg);
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 8px 12px;
        color: var(--text);
        font-size: 14px;
        transition: border-color 0.3s ease;
        font-family: 'Inter', sans-serif;
        cursor: pointer;
      }
      .filter-select:focus {
        outline: none;
        border-color: var(--accent);
      }
      .filters-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--line);
      }

      .pagination-btn {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        border: 1px solid var(--line);
        background: transparent;
        color: var(--text);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.25s ease;
        font-size: 14px;
      }
      .pagination-btn:hover:not(:disabled) {
        border-color: var(--accent);
        background: rgba(0,102,204,0.1);
      }
      .pagination-btn.active {
        background: var(--accent);
        border-color: var(--accent);
        color: #ffffff;
      }
      .pagination-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      @media (max-width: 768px) {
        .filters-grid {
          grid-template-columns: 1fr 1fr;
        }
        .filters-actions {
          flex-direction: column;
          gap: 12px;
          align-items: stretch;
        }
      }
    `}</style>
  );
}

export default GalleryPage;