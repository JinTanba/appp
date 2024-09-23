import { IBM_Plex_Sans } from 'next/font/google'
import Image from 'next/image'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '600'],
})

const iconUrl = "/aavetoken.png"

interface TokenInfoProps {
  iconUrl: string;
  tokenName: string;
  buttonText: string;
  delegateToken: string;
  balance: string;
  delegated: string;
}

const tokenData = [
  {
    iconUrl: iconUrl,
    tokenName: "AAVE",
    buttonText: "delegate",
    delegateToken: "aAAVE",
    balance: "10000",
    delegated: "10000"
  },
  {
    iconUrl: iconUrl,
    tokenName: "stkAAVE",
    buttonText: "delegate",
    delegateToken: "aAAVE",
    balance: "10000",
    delegated: "10000"
  },
  {
    iconUrl: iconUrl,
    tokenName: "aAAVE",
    buttonText: "delegate",
    delegateToken: "stkAAVE",
    balance: "10000",
    delegated: "10000"
  }
];

function TokenInfo({ iconUrl, tokenName, buttonText, delegateToken, balance, delegated }: TokenInfoProps) {
    return (
      <div className={`${ibmPlexSans.className} mb-24 w-[30vw]`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-[80px] h-[80px] relative mr-10">
              <Image
                src={iconUrl}
                alt={`${tokenName} icon`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h2 className="text-white text-[60px] mb-2 font-extralight leading-none tracking-[-3.66px]">
              {tokenName}
            </h2>
          </div>
          <button className="w-[147px] h-[50px] rounded-[15px] bg-[rgba(22,22,22,0.20)] text-white text-sm font-light flex items-center justify-center mr-2">
            delegate <span className="ml-1 font-semibold">{delegateToken}</span>
          </button>
        </div>
        <div className="flex text-white text-sm font-light">
          <p className="mr-8">your balance: <span className="font-bold">{balance}</span></p>
          <p>total delegated to us: <span className="font-bold">{delegated}</span></p>
        </div>
      </div>
      )
}

export default function Delegate() {
  return (
    <div className={`${ibmPlexSans.className} flex flex-col justify-center h-screen w-1/2 pl-20`}>
      {tokenData.map((token, index) => (
        <TokenInfo key={index} {...token} />
      ))}
    </div>
  )
}

