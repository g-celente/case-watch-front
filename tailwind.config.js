/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores primárias - roxo/violeta
        primary: {
          DEFAULT: '#6C63FF',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        // Cores de fundo - branco predominante
        background: {
          DEFAULT: '#ffffff',
          secondary: '#f8fafc',
        },
        // Cores de texto - preto predominante
        foreground: {
          DEFAULT: '#0f172a',
          muted: '#64748b',
        },
        // Cores específicas do sistema
        border: '#e2e8f0',
        input: '#ffffff',
        card: '#ffffff',
        popover: '#ffffff',
        muted: {
          DEFAULT: '#f1f5f9',
          foreground: '#64748b',
        },
        accent: {
          DEFAULT: '#f1f5f9',
          foreground: '#0f172a',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}

