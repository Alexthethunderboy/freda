import React, { useState } from 'react';
import LottieWrapper from './LottieWrapper';
import cakeAnimation from '../../public/assets/cake.json';
import { motion } from 'framer-motion';

interface HeroProps {
  onBlowOut: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBlowOut }) => {
  const [play, setPlay] = useState(true);

  const handleCakeClick = () => {
    setPlay(false); // Simulate blow-out
    onBlowOut();
    setTimeout(() => setPlay(true), 2000); // Relight after confetti
  };

  return (
    <header className="min-h-[70vh] md:min-h-[80vh] flex items-center justify-center px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl w-full">
        <div className="text-center md:text-left">
          <h1 className="font-playfair text-3xl sm:text-5xl md:text-6xl font-bold mb-3">
            SIMISOLA FREDAMARY ADEWUNMI
          </h1>
          <p className="font-poppins text-base sm:text-lg md:text-xl text-textSecondary mb-6">
            Happy Birthday · 17 September
          </p>
          <p className="font-dancing text-2xl md:text-3xl text-accentPink">
            Make a wish, Freda ✨
          </p>
        </div>
        <div className="flex flex-col items-center">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-56 h-56 sm:w-72 sm:h-72 cursor-pointer rounded-xl bg-white/30 backdrop-blur p-3 shadow"
            onClick={handleCakeClick}
            aria-label="Birthday cake animation"
            tabIndex={0}
            role="button"
          >
            <LottieWrapper animationData={cakeAnimation} play={play} loop={play} alt="Animated birthday cake" className="w-full h-full" />
          </motion.div>
          <span className="sr-only">Click the cake to blow out the candles and celebrate!</span>
        </div>
      </div>
    </header>
  );
};

export default Hero;
