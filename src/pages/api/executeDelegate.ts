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
const privKey = process.env.PRIVATE_KEY;
if (!privKey) {
    throw new Error("PRIVATE_KEY is not set");
}
const account = privateKeyToAccount(privKey as `0x${string}`);
const walletClient = createWalletClient({
    account: account,
    chain: mainnet,
    transport: http("https://eth-mainnet.g.alchemy.com/v2/AHvTHUHmlCKWoa5hezH-MTrKWw_MjtUZ")
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { params } = req.body;

  const { request, result } = await publicClient.simulateContract({
    address: delegateHelper,
    abi: delegateHelperABI,
    functionName: 'batchMetaDelegate',
    account: account.address, // simulateContractではアカウントアドレスを指定
    args:[params],
  });

  const hash = walletClient.writeContract(request);

  res.status(200).json({ txHash: hash });
}