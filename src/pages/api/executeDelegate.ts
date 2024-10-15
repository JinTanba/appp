// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import {createPublicClient, createWalletClient, http} from "viem"
import {mainnet} from "viem/chains"
import { privateKeyToAccount } from 'viem/accounts'
import delegateHelperABI from '../../delegateHelperABI.json';
const delegateHelper = "0x94363B11b37BC3ffe43AB09cff5A010352FE85dC";

const publicClient = createPublicClient({
    chain: mainnet,
    transport: http("https://eth-mainnet.g.alchemy.com/v2/AHvTHUHmlCKWoa5hezH-MTrKWw_MjtUZ")
});

function customParse(obj: any) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (obj.type === 'BigInt' && typeof obj.value === 'string') {
    console.log("---- obj.value", obj.value);
    return BigInt(obj.value);
  }
  
  for (let key in obj) {
    obj[key] = customParse(obj[key]);
  }
  
  return obj;
}

const privKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;
if (!privKey) {
    throw new Error("PRIVATE_KEY is not set");
}

const account = privateKeyToAccount(privKey as `0x${string}`);

const walletClient = createWalletClient({
    account: account,
    chain: mainnet,
    transport: http("https://mainnet.infura.io/v3/4d95e2bfc962495dafdb102c23f0ec65")
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("---- req.body", req.body);
  const params = customParse(req.body);

  console.log("---- params", params);

  const { request, result } = await publicClient.simulateContract({
    address: delegateHelper,
    abi: delegateHelperABI,
    functionName: 'batchMetaDelegate',
    account: account.address,
    args:[params]
  });

  console.log("---- request", request);
  console.log("---- result", result);

  const hash = await walletClient.writeContract({
    address: delegateHelper,
    abi: delegateHelperABI,
    functionName: 'batchMetaDelegate',
    args: [params],
  });

  
  
  res.status(200).json({ txHash: hash });
}