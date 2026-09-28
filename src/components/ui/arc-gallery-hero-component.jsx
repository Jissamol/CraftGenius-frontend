import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ArcGalleryHero({
  images = [],
  startAngle = -85,
  endAngle = 85,
  radiusLg = 500,
  radiusMd = 350,
  radiusSm = 120,
  cardSizeLg = 160,
  cardSizeMd = 120,
  cardSizeSm = 70,
  className = "",
  children
}) {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLg = windowWidth >= 1024;
  const isMd = windowWidth >= 768 && windowWidth < 1024;
  const radius = isLg ? radiusLg : isMd ? radiusMd : radiusSm;
  const cardSize = isLg ? cardSizeLg : isMd ? cardSizeMd : cardSizeSm;
  
  // Use up to 9 images to form a beautiful arc without clutter
  const displayImages = images.slice(0, 9);

  return (
    <div className={`relative w-full overflow-hidden flex flex-col items-center justify-center pb-24 pt-16 lg:pt-24 min-h-[85vh] ${className}`}>
      {/* Arc Images */}
      <div className="absolute top-[65%] md:top-[60%] lg:top-[70%] left-1/2 transform -translate-x-1/2 w-full h-0 flex items-center justify-center pointer-events-none">
        {displayImages.map((src, index) => {
          const angleRange = endAngle - startAngle;
          const step = displayImages.length > 1 ? angleRange / (displayImages.length - 1) : 0;
          const angle = startAngle + step * index;
          const angleRad = (angle * Math.PI) / 180;

          const x = Math.sin(angleRad) * radius;
          const y = -Math.cos(angleRad) * radius;
          
          // Slight rotation so cards face outward
          const rotation = angle * 0.8; 

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, x: 0, y: 50, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, x, y, rotate: rotation }}
              transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="absolute pointer-events-auto rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border-[6px] border-[#F7F6F2] overflow-hidden"
              style={{
                width: `${cardSize}px`,
                height: `${cardSize * 1.3}px`,
                marginTop: `-${cardSize * 1.3 / 2}px`,
                marginLeft: `-${cardSize / 2}px`,
                zIndex: 10 - Math.abs(index - Math.floor(displayImages.length / 2))
              }}
            >
              <img
                src={src}
                alt={`Product Gallery ${index}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700 bg-gray-200"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 text-center flex flex-col items-center justify-center px-5 max-w-4xl mx-auto mt-[15vh] md:mt-[20vh] lg:mt-[25vh]">
        {children}
      </div>
    </div>
  );
}
