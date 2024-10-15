import React, { useEffect, useState } from 'react'
import { IBM_Plex_Sans } from 'next/font/google'
import Image from 'next/image'
import { createPublicClient, createWalletClient, http, custom, PublicClient, WalletClient, Address, Hash, Hex, parseAbi, parseUnits, parseEther, zeroAddress } from 'viem'
import { mainnet } from 'viem/chains'
import { switchChain } from 'viem/actions'
import { metaDelegate, DelegateToken, getBalance, getDelegatee, metaDelegateALL } from "../delegate"
import { formatEther } from 'viem'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LogOut, X } from 'lucide-react'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700'],
})

const bgImageLink = "https://firebasestorage.googleapis.com/v0/b/ucai-d6677.appspot.com/o/aavebg.png?alt=media&token=66c91456-3914-4f91-95ab-5aa727448ec7"

const tokenData: any[] = [
  {
    iconUrl: "/cute_aave2.png",
    tokenName: "delegate All",
    buttonText: "delegate all",
    delegateToken: "",
    address: ""
  },
  {
    iconUrl: "/aave.png",
    tokenName: "AAVE",
    buttonText: "delegate AAVE",
    delegateToken: "AAVE",
    address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"
  },
  {
    iconUrl: "/aAAVE.png",
    tokenName: "stkAAVE",
    buttonText: "delegate stkAAVE",
    delegateToken: "stkAAVE",
    address: "0x4da27a545c0c5B758a6BA100e3a049001de870f5"
  },
  {
    iconUrl: "/aave.png",
    tokenName: "aAAVE",
    buttonText: "delegate aAAVE",
    delegateToken: "aAAVE",
    address: "0xA700b4eB416Be35b2911fd5Dee80678ff64fF6C9"
  }
]

type TabButtonProps = {
  label: string
  isActive: boolean
  onClick: () => void
}

const TabButton = ({ label, isActive, onClick }: TabButtonProps) => (
  <button
    className={`px-2 py-1 text-[15px] ${ibmPlexSans.className} ${
      isActive
        ? 'text-white font-light'
        : 'text-white/70 hover:text-white font-extralight'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
)

const Title = ({ activeTab }: {activeTab: string}) => {
  let content = "SaucyBlock"
  
  return (
    <div className={`w-full md:w-[525px] text-white ${ibmPlexSans.className} text-[60px] md:text-[110px] font-extralight leading-none mb-2 tracking-[-3px] md:tracking-[-6.6px]`} style={{fontWeight: 100, textShadow:" 0px 4px 55px #FFF"}}>
      {content}
    </div>
  )
}

const DetailTexts = () => {
  return (
    <div className={`w-full md:w-[474px] text-white/70 ${ibmPlexSans.className} text-[11px] font-light leading-[16px] mb-6`}>
      Available as a browser extension and as a mobile app, MetaMask equips you with a key vault, secure login, token wallet, and token exchange—Available as a browser extension and as a mobile app, MetaMask equips you with a key vault, secure login, token wallet, and token exchange—
    </div>
  )
}

export const DelegateModal = ({ isOpen, onClose, onConfirm, isProcessing }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, isProcessing: boolean }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl h-[500px] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-between">
        <div>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <X className="h-4 w-4 text-black outline-none" />
            <span className="sr-only">Close</span>
          </button>
          <DialogHeader>
            <DialogTitle>Confirm Delegation</DialogTitle>
            <DialogDescription>
              Are you sure you want to proceed with the delegation?
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="flex justify-center items-center flex-grow">
          <Image src="/cute_aave.png" alt="Cute AAVE" width={300} height={300} />
        </div>
        
        <DialogFooter className="">
          {isProcessing ? (
            <div className="flex items-center justify-center w-full h-[40px] bg-[#2B2D3C] text-[#2B2D3C] rounded">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <p className="ml-2">Processing delegation...</p>
            </div>
          ) : (
            <Button 
              className="border-black-300 border bg-[#2B2D3C] text-white w-full h-[40px] hover:bg-black hover:text-white" 
              onClick={onConfirm}
            >
              delegate to saucyblock!!!
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AboutUs() {
  const [activeTab, setActiveTab] = useState('about')

  return (
    <div className="w-full md:w-[549px] flex flex-col">
      <div className="w-full md:w-[200px] h-[40px] flex justify-between items-center mb-10 overflow-x-auto md:overflow-x-visible">
        {['about', 'AAVE', 'aAAVE', 'stkAAVE'].map((tab) => (
          <TabButton
            key={tab}
            label={tab}
            isActive={activeTab === tab}
            onClick={() => setActiveTab(tab)}
          />
        ))}
      </div>
      <Title activeTab={activeTab} />
      <DetailTexts />
    </div>
  )
}

type TokenInfoProps = {
  iconUrl: string
  tokenName: string
  buttonText: string
  handleDelegate: () => Promise<void>
}

function Token({ info, handleDelegate }: { info: TokenInfo, handleDelegate: () => Promise<void> }) {
  const { iconUrl, tokenName, buttonText, balance, vote, proposal } = info
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const onConfirmDelegate = async () => {
    setIsProcessing(true)
    try {
      await handleDelegate()
    } finally {
      setIsProcessing(false)
      setIsModalOpen(false)
    }
  }

  return (
    <div
      className={`text-white p-4 md:p-6 rounded-2xl w-full md:w-[560px] flex flex-col justify-between ${ibmPlexSans.className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src={iconUrl}
            alt={`${tokenName} Logo`}
            width={60}
            height={60}
            className="rounded-full mr-0 md:mr-6"
          />
          <h1 className="text-[30px] md:text-[50px] font-extralight tracking-[-2px] md:tracking-[-3.6px]">
            {tokenName}
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-[120px] md:w-[147px] h-[35px] md:h-[45px] rounded-[15px] bg-[rgba(22,22,22,0.20)] flex items-center justify-center"
        >
          <span className="h-[33px] flex items-center opacity-[70%] text-white text-[10px] md:text-[12px] font-light">
            {buttonText}
          </span>
        </button>
      </div>
      <div className="flex flex-row text-left mt-2 md:mt-0 space-x-8">
        <div className={`${ibmPlexSans.className} font-white-20 text-[10px]`}>
          <span className={`${ibmPlexSans.className} font-white-20 opacity-[50%] text-[10px]`}>
            your balance:
          </span>
          <span className="mt-[-2px] text-[8px]">
            {balance ? (balance.slice(0,8)) : '-'}
          </span>
        </div>
        <div className={`${ibmPlexSans.className} font-white-20 text-[10px] mt-0.5 md:mt-0`}>
          <span className={`${ibmPlexSans.className} font-white opacity-[50%] text-[10px]`}>
            vote: 
          </span>
          <span className={`${ibmPlexSans.className} mt-[-2px] text-[8px] ${vote ? '' : 'opacity-[80%]'}`}>{vote || "Not delegated"}</span>
        </div>
        <div className={`${ibmPlexSans.className} font-white-20 text-[10px] mt-0.5 md:mt-0`}>
          <span className={`${ibmPlexSans.className} font-white opacity-[50%] text-[10px]`}>
            proposal: 
          </span>
          <span className={`${ibmPlexSans.className} mt-[-2px] text-[8px] ${proposal ? '' : 'opacity-[80%]'}`}>{proposal || "Not delegated"}</span>
        </div>
      </div>
      <DelegateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onConfirmDelegate}
        isProcessing={isProcessing}
      />
    </div>
  );
 
}

const AddressDisplay = ({ ensName, address, disconnectWallet, connectWallet }: { ensName: string | null, address: string | null, disconnectWallet: () => void, connectWallet: () => void }) => {
  const displayText = ensName || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected');
  const isConnected = Boolean(ensName || address);

  const handleClick = async () => {
    console.log("clicked");
    disconnectWallet();
  };
  
  return (
    <div 
      onClick={isConnected ? handleClick : connectWallet}
      className={`absolute z-[1000] top-4 right-4 text-white ${ibmPlexSans.className} text-sm text-[10px] font-extralight bg-black bg-opacity-50 px-3 py-1 rounded-[10px] flex items-center ${isConnected ? 'cursor-pointer hover:bg-opacity-70' : ''}`}
    >
      <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-500'}`}></span>
      {displayText}
      {isConnected && (
        <LogOut className="w-3 h-3 ml-2 text-white opacity-70 hover:opacity-100 z-1000" />
      )}
    </div>
  )
};


type TokenInfo = {
  iconUrl: string
  tokenName: string
  buttonText: string
  delegateToken: string
  address: string
  vote?: string
  proposal?: string
  balance?: string
}

export default function AppLayout() {
  const [isCorrectChain, setIsCorrectChain] = useState(false)
  const [address, setAddress] = useState<Address | null>(null)
  const [ensName, setEnsName] = useState<string | null>(null)
  const [publicClient, setPublicClient] = useState<PublicClient | null>(null)
  const [wallet, setWallet] = useState<WalletClient | null>(null);
  const [tokenDataWithBalances, setTokenDataWithBalances] = useState<TokenInfo[]>([])

  async function setupWallet() {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http("https://eth-mainnet.g.alchemy.com/v2/AHvTHUHmlCKWoa5hezH-MTrKWw_MjtUZ")
    })
    setPublicClient(publicClient)
    const wallet = createWalletClient({
      chain: mainnet,
      transport: custom((window as any).ethereum)
    })

    setWallet(wallet)
    try {
      const chainId = await wallet.getChainId()
      if (chainId !== mainnet.id) {
        await switchChain(wallet, { id: mainnet.id })
      }

      setIsCorrectChain(true)

      const [account] = await wallet.requestAddresses()
      setAddress(account)

      const name = await publicClient.getEnsName({ address: account })
      setEnsName(name)
    } catch (error) {
      console.error("Error setting up wallet:", error)
      setIsCorrectChain(false)
    }
  }

  useEffect(() => {
    if (!((window as any).ethereum)) return
    setupWallet()
  }, [])


  useEffect(() => {
    if (!address || !publicClient) return

    const fetchTokenData = async () => {
      const updatedTokenData = await Promise.all(
        tokenData.map(async (token) => {
          if (token.address) {
            const { vote, proposal } = await getDelegatee(token.address, address)
            const balance = await getBalance(token.address, address)
            return {
              ...token,
              vote: vote === zeroAddress ? "Not delegated" : vote,
              proposal: proposal === zeroAddress ? "Not delegated" : proposal,
              balance: formatEther(BigInt(balance))
            }
          }
          return token
        })
      )
      setTokenDataWithBalances(updatedTokenData)
    }

    fetchTokenData()
  }, [address, publicClient])
  

  const disconnectWallet = async () => {
    console.log("disconnecting wallet!!!!")
    const provider = (window as any).ethereum
    await provider.on("disconnect", () => {
      console.log("???")
    })
    setAddress(null)
    setEnsName(null)
    setWallet(null)
    // setPublicClient(null)
  }

  const handleDelegate = async (token: DelegateToken) => {
    const hash = token ? await metaDelegate([token], wallet) :   await metaDelegateALL(wallet)
    console.log(hash)
    
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgImageLink})`
        }}
      />
      <AddressDisplay ensName={ensName} address={address} disconnectWallet={disconnectWallet} connectWallet={setupWallet} />
      <div className="relative z-10 flex items-center justify-center min-h-screen w-full p-4 md:p-0">
        <div className="container w-full md:w-[1153px] md:h-[510px] mb-[20px]">
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/2 p-2 md:p-6 flex items-center justify-center mb-8 md:mb-0">
              <AboutUs />
            </div>
            <div className="w-full md:w-1/2 p-2 md:p-6">
            <div className="h-full flex items-center justify-center">
              <div className="w-full md:w-[548px] flex flex-col justify-between space-y-4 md:space-y-0">
                {
                  tokenDataWithBalances.map((token, index) => (
                    <Token 
                      key={index} 
                      info={token} 
                      handleDelegate={async () => await handleDelegate(token.address as DelegateToken)}
                    />
                  ))
                }
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}