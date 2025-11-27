# Freda's Birthday Website

A production-ready, single-page birthday site for SIMISOLA FREDAMARY ADEWUNMI (Freda).

## Features
- Responsive, mobile-first design
- Accessible modal for birthday letter
- Animated cake (Lottie), confetti, and micro-animations
- Memory timeline with photo cards and Lottie flourishes
- Easter egg: blow out candles (mic/click)
- Performance-optimized, lazy-loaded assets
- Vercel-ready deployment

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run locally:**
   ```bash
   npm run dev
   ```
3. **Build for production:**
   ```bash
   npm run build
   ```
4. **Deploy to Vercel:**
   - Push to GitHub and import to Vercel, or use Vercel CLI.

## Project Structure
- `/src/components` — Modular React components
- `/public/assets` — Images and Lottie JSONs
- `/content/letter.txt` — Birthday letter (paste your letter here)

## Asset Credits
- Lottie cake: [LottieFiles](https://lottiefiles.com)
- Envelope animation: [LottieFiles](https://lottiefiles.com)
- Confetti: [canvas-confetti](https://github.com/catdad/canvas-confetti)
- Photos: Provided by Alex
- Fonts: [Playfair Display](https://fonts.google.com/specimen/Playfair+Display), [Poppins](https://fonts.google.com/specimen/Poppins)

## QA Checklist
### Accessibility
- [x] Modal follows ARIA dialog pattern
- [x] Focus trap and return
- [x] Keyboard navigation
- [x] Images have descriptive alt text
- [x] Respects prefers-reduced-motion

### Performance
- [x] Lazy-load Lottie and images
- [x] Defer noncritical scripts
- [x] Confetti limited on mobile
- [x] Lighthouse score 90+

### Mobile
- [x] Responsive layout
- [x] Touch targets sized
- [x] Fast initial load

## .env.example
_No environment variables required for basic usage._

## License
MIT
