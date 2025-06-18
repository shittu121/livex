"use client"

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const FirstPage = () => {
    const [loaded, setLoaded] = useState(false);
  
    useEffect(() => {
      setLoaded(true);
    }, []);
  
    return (
      <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('/images/bg-image.svg')",
              backgroundPosition: "center",
              height: "100vh",
            }}
          />
          <div className="absolute inset-0 bg-opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80" />
        </div>
        
        {/* Content Container */}
        <div className="z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 w-full max-w-4xl mx-auto">
          {/* Logo Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={loaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              delay: 0.2
            }}
            className="mb-16"
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-center">
              <div className="inline-block" style={{ 
                background: "linear-gradient(90deg, #d4af37 0%, #f2d272 50%, #d4af37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}>
                <Image src="/livex-logo.png" alt='logo' height={150} width={150} className='h-full w-auto object-cover' />
              </div>
              <span className="text-white relative">
                <motion.span
                  initial={{ opacity: 0, scale: 0 }}
                  animate={loaded ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="absolute -top-1 -right-4 text-2xl text-yellow-300"
                >
                  ✦
                </motion.span>
              </span>
            </h1>
          </motion.div>
          
          {/* Tagline Animation */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-xl sm:text-2xl font-medium text-gray-300 mb-12 max-w-96 text-center"
          >
            Welcome to LivX, Experience live events like never before
          </motion.h2>
          
          {/* Buttons Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md mx-auto"
          >
            <Link href="/auth/sign-up" className="w-full sm:w-1/2">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-full py-4 rounded-full font-medium text-black text-lg"
                style={{ 
                  background: "linear-gradient(90deg, #d4af37 0%, #f2d272 50%, #d4af37 100%)",
                  boxShadow: "0 10px 15px -3px rgba(212, 175, 55, 0.2), 0 4px 6px -2px rgba(212, 175, 55, 0.1)"
                }}
              >
                SIGN UP
              </motion.button>
            </Link>
            
            <Link href="/auth/login" className="w-full sm:w-1/2">
              <motion.button
                whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(212, 175, 55, 0.1)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-full py-4 rounded-full font-medium text-lg"
                style={{ 
                  border: "2px solid #d4af37",
                  color: "#d4af37"
                }}
              >
                SIGN IN
              </motion.button>
            </Link>
          </motion.div>
          
          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={loaded ? { 
              opacity: 1, 
              y: [0, 10, 0] 
            } : {}}
            transition={{ 
              opacity: { delay: 1.8, duration: 1 },
              y: { repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 2 }
            }}
          >
            <svg className="w-6 h-12" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="22" height="46" rx="11" stroke="#d4af37" strokeWidth="2" />
              <motion.circle 
                cx="12" 
                cy="16" 
                r="4" 
                fill="#d4af37" 
                animate={{ y: [0, 16, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5, 
                  ease: "easeInOut", 
                  delay: 2
                }}
              />
            </svg>
          </motion.div>
        </div>
      </div>
    );
}

export default FirstPage