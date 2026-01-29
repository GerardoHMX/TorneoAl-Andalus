/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
    "./**/*.html"
  ],
  safelist: [
    // Clases que se generan dinámicamente o que Tailwind puede no detectar
    'text-md',
    'sm:text-md',
    'md:text-md',
    'lg:text-md',
    'xl:text-md',
    // Clases de ancho que pueden no detectarse correctamente
    'w-80',
    'md:w-80',
    'lg:w-80',
  ],
  theme: {
    extend: {
        colors: {
            'brand': {
                'red': '#c62828',
                'red-100': 'rgb(198 40 41)',
                'red-200': '#a82222',
                'red-300': 'rgb(143 28 28)',
                'gold': '#fbc02d',
                'green': '#2e7d32',
                'blue': '#1565c0',
                'blue-100': 'rgb(211 229 247)',
                'blue-200': 'rgb(0 151 206)',
                'blue-300': 'rgb(0 93 155)',
                'white': '#ffffff',
                'orange': 'rgb(244 71 6)',
                'gray': '#bababa',
                'text-dark': '#1a1a1a',
                'text-light': '#6c757d',
                'bg-light': '#f8f9fa',
                'bg-dark': '#212529'
            }
        },
        fontSize: {
            'md': '1rem', // text-md equivalente a text-base
        },
        borderRadius: {
          'brand': '0px'
        },
        boxShadow: {
          'brand-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
          'brand-md': '0 4px 16px rgba(0, 0, 0, 0.12)',
          'brand-lg': '0 8px 32px rgba(0, 0, 0, 0.16)'
        }
    }
  },
  plugins: []
}
