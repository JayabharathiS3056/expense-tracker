/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        wheat: { DEFAULT:'#f5deb3', light:'#fdf6e9', dark:'#e8c98a', deeper:'#d4a96a' },
        sienna:{ DEFAULT:'#a0522d', light:'#c4733f', dark:'#7a3e22', deeper:'#5c2e18' },
      },
      fontFamily: { sans:['Inter','sans-serif'] },
      animation: {
        'fade-up':'fadeUp 0.7s ease forwards',
        'fade-in':'fadeIn 0.6s ease forwards',
        'slide-right':'slideRight 0.7s ease forwards',
        'slide-left':'slideLeft 0.7s ease forwards',
        'float':'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:{ '0%':{ opacity:'0', transform:'translateY(30px)' }, '100%':{ opacity:'1', transform:'translateY(0)' } },
        fadeIn:{ '0%':{ opacity:'0' }, '100%':{ opacity:'1' } },
        slideRight:{ '0%':{ opacity:'0', transform:'translateX(-30px)' }, '100%':{ opacity:'1', transform:'translateX(0)' } },
        slideLeft:{ '0%':{ opacity:'0', transform:'translateX(30px)' }, '100%':{ opacity:'1', transform:'translateX(0)' } },
        float:{ '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-10px)' } },
      }
    }
  },
  plugins:[]
}