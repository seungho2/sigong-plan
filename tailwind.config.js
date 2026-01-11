/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#F5F0EB',
                secondary: '#C19A6B',
                text: '#1A1A1A',
            },
            fontFamily: {
                sans: ['Roboto', 'sans-serif'],
                brand: ['Work Sans', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
