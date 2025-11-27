# UnlearnNaija / Thunderspace ⚡️

A next-generation digital research archive built for speed, aesthetics, and discovery.

## 🌟 Features

- **Immersive Experience**: "Thunderboy" design system with raw textures, electric colors, and fluid animations.
- **Global Search**: Instant search with smart suggestions for topics, authors, and posts.
- **Archive Tuner**: Tactile controls for filtering and sorting content on mobile.
- **Rich Media Support**: PDF, Audio, and Article support with a custom audio player.
- **Admin Dashboard**: Comprehensive tools for managing archives, users, and viewing analytics.
- **Mobile-First**: Optimized for touch with a floating dock, shattered menu, and gesture controls.
- **Authentication**: Secure user management via Supabase.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend / Auth**: [Supabase](https://supabase.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) & [Nuqs](https://nuqs.47ng.com/) (URL state)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/thunderspace.git
    cd thunderspace
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Setup:**

    Create a `.env.local` file in the root directory and add your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

-   `src/app`: Next.js App Router pages and layouts.
-   `src/components`: Reusable UI components.
    -   `ui`: Basic design system primitives (buttons, cards).
    -   `features`: Complex feature-specific components (KnowledgeGrid, AudioPlayer).
    -   `admin`: Admin dashboard components.
-   `src/lib`: Utility functions, Supabase client, and stores.

## 🎨 Design System

The "Thunderboy" aesthetic is defined in `globals.css` and `tailwind.config.ts`. It features:
-   **Colors**: Thunder Yellow (`#FFC800`), Deep Charcoal, and Soft Beige.
-   **Typography**: Inter (Headings) and JetBrains Mono (Code/Accents).
-   **Effects**: Noise textures, glassmorphism, and "broken" grid layouts.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
