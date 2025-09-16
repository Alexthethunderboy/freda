"use client";
import Hero from "../components/Hero";
import Modal from "../components/Modal";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LottieWrapper from "../components/LottieWrapper";
import confetti from "canvas-confetti";
import { createPortal } from "react-dom";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [letter, setLetter] = useState("");
  const [envelopeData, setEnvelopeData] = useState<any | null>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const isValidLottie = (data: any) => !!data && ("v" in data) && ("layers" in data || "assets" in data);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetch("/letter.txt")
      .then((res) => res.text())
      .then((text) => setLetter(text))
      .catch(() => setLetter(""));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openLetter = async () => {
    try {
      const res = await fetch("/assets/Envelope.json", { cache: "force-cache" });
      if (!res.ok) throw new Error("Envelope not found");
      const data = await res.json();
      if (isValidLottie(data)) setEnvelopeData(data);
      else throw new Error("Invalid Lottie JSON structure");
    } catch (err) {
      console.warn(
        "Envelope animation missing; showing modal without intro. If you want the intro, add public/assets/Envelope.json"
      );
    } finally {
      setModalOpen(true);
      const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
      confetti({ particleCount: isMobile ? 30 : 60, spread: 60, origin: { y: 0.8 } });
    }
  };

  const makeWish = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    confetti({ particleCount: isMobile ? 30 : 60, spread: 70, origin: { y: 0.7 } });
  };

  return (
    <>
    <div className="font-sans min-h-screen">
      <Hero onBlowOut={makeWish} />
      <div className="flex flex-col items-center mt-2">
        <motion.button
          ref={ctaRef}
          className="bg-accentPink text-textPrimary/90 font-poppins px-6 py-3 rounded shadow-lg focus:ring-2 focus:ring-accentYellow mb-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={openLetter}
        >
          Open my letter
        </motion.button>
        <motion.button
          className="bg-accentYellow text-textPrimary font-poppins px-6 py-3 rounded shadow-lg focus:ring-2 focus:ring-accentYellow mt-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={makeWish}
          aria-label="Make a wish and blow out the candles"
        >
          Make a wish
        </motion.button>
      </div>
      {/* <Timeline /> */}
    </div>
    {mounted &&
      createPortal(
        (
          <AnimatePresence>
            {modalOpen && (
              <Modal
                isOpen={modalOpen}
                onClose={() => {
                  setModalOpen(false);
                  ctaRef.current?.focus();
                }}
                title="A Birthday Letter"
                description="To Freda, with love."
              >
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center "
                >
                  {envelopeData ? (
                    <LottieWrapper
                      animationData={envelopeData}
                      alt="Envelope opening animation"
                      className="w-32 h-32 mb-4"
                    />
                  ) : (
                    <svg
                      className="w-32 h-32 mb-4"
                      viewBox="0 0 64 64"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label="Envelope icon"
                      role="img"
                    >
                      <rect x="6" y="12" width="52" height="40" rx="4" fill="#FF8DC7" />
                      <path d="M8 14l24 18L56 14" fill="none" stroke="#fff" strokeWidth="3" />
                      <path d="M8 50l18-18" fill="none" stroke="#fff" strokeWidth="3" />
                      <path d="M56 50L38 32" fill="none" stroke="#fff" strokeWidth="3" />
                    </svg>
                  )}
                  <div className="font-poppins text-textPrimary whitespace-pre-line">
                    {letter}
                  </div>
                </motion.div>
              </Modal>
            )}
          </AnimatePresence>
        ),
        document.body
      )}
    </>
  );
}
