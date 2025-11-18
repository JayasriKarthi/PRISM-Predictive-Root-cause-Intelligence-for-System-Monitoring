/** @type {import('tailwindcss').Config} */
const defaultConfig = require("shadcn/ui/tailwind.config")
const plugin = require('tailwindcss/plugin')

module.exports = {
  ...defaultConfig,
  content: [...defaultConfig.content, "./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    ...defaultConfig.theme,
    extend: {
      ...defaultConfig.theme.extend,
      colors: {
        ...defaultConfig.theme.extend.colors,
        background: '#F5F5F5',
        card: '#FFFFFF',
        hover: '#F3E8FF',
        primary: '#A78BFA',
        secondary: '#8B5CF6',
        accent: '#C4B5FD',
        heading: '#0A0A0A',
        body: '#1E293B',
        link: '#8B5CF6',
        'link-hover': '#7C3AED',
        icon: '#1E293B',
        'icon-active': '#A78BFA',
        footer: '#F3E8FF',
        'disabled-text': '#9CA3AF',
        'disabled-bg': '#E5E7EB',
        border: '#D1D5DB'
      },
      borderRadius: {
        ...defaultConfig.theme.extend.borderRadius,
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate"), plugin(function({ addUtilities }) {
    addUtilities({
      '.border-border': { 'border-color': 'hsl(var(--border))' },
      '.outline-ring': { 'outline-color': 'hsl(var(--ring))' }
    })
  })],
}
