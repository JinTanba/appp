import { useEffect, useState } from "react"
import { IBM_Plex_Sans } from 'next/font/google'
import Delegate from "./delegate"

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
})

const AnimatedBackground = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#69ABB9' }}/>
        <stop offset="50%" style={{ stopColor: '#706C9A' }}/>
        <stop offset="100%" style={{ stopColor: '#602366' }}/>
        <animateTransform
          attributeName="gradientTransform"
          type="rotate"
          from="0 0.5 0.5"
          to="360 0.5 0.5"
          dur="30s"
          repeatCount="indefinite"
          calcMode="linear"
          keySplines="0.25 0.1 0.25 1"
        />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" />
  </svg>
)

export default function BackgroundWithOverlay() {


  return (
    <div className="relative min-h-screen w-full">
      <AnimatedBackground />
      <div 
        className="absolute inset-0 w-full h-full bg-[rgba(178,178,178,0.10)] backdrop-blur-[23.5px] flex pl-30"
      >
        <TopComponent />
        <Delegate />
      </div>
    </div>
  )
}


function TopComponent() {
  const [currentMode, changeMode] = useState(1)

  useEffect(() => {
    setTimeout(() => {
      console.log("Misw",currentMode)
      const newMode = currentMode % 3
      changeMode(newMode)
    },2000)
  }, [])

  return (
    <div className="flex flex-col justify-center h-screen w-1/2 pl-40 pb-10">
      <nav className="mb-2 flex space-x-6">
        {['about', 'AAVE', 'aAAVE', 'stkAAVE'].map((item, index) => (
          <button
            key={item + index}
            className={`text-white text-center ${ibmPlexSans.className} text-xl font-extralight ${
              index === 0 ? '' : 'opacity-50'
            }`}
          >
            {item}
          </button>
        ))}
      </nav>
      
      <h1 className={`${ibmPlexSans.className} text-white text-[150px] font-extralight mb-2`} >
        SaucyBlock 
      </h1>
      
      <p className={`${ibmPlexSans.className} text-[#BFBFBF] text-xs font-light leading-4 w-[615px] mb-5`}>
        Available as a browser extension and as a mobile app, MetaMask equips you with a key vault, 
        secure login, token wallet, and token exchange—Available as a browser extension and as a mobile app, 
        MetaMask equips you with a key vault, secure login, token wallet, and token exchange—
      </p>
      
      <button className="w-[222.902px] h-[55px] rounded-[15px] bg-[rgba(22,22,22,0.20)] text-white font-['IBM_Plex_Sans'] text-sm flex items-center justify-center">
        <span className={`${ibmPlexSans.className} font-bold mr-2`}>👻</span> delegate ALL you have
      </button>
    </div>
  )
}