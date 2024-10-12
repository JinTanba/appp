const _abi = require('./abi.json');
const { 
  createPublicClient, parseSignature, BaseError, ContractFunctionRevertedError, 
  http, Address, Hex, parseAbi, WalletClient, createWalletClient, hexToSignature 
} = require('viem');
const { mainnet } = require('viem/chains');
import { maxUint256 } from 'viem'
import delegateHelperABI from './delegateHelperABI.json';
export enum DelegateToken {
    AAVE = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    AAAVE = "0xA700b4eB416Be35b2911fd5Dee80678ff64fF6C9",
    stkAAVE = "0x4da27a545c0c5B758a6BA100e3a049001de870f5"
}

const delegatee = "0x08651EeE3b78254653062BA89035b8F8AdF924CE"; // デリゲート先アドレス
const delegateHelper = "0x94363B11b37BC3ffe43AB09cff5A010352FE85dC";
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
});

const token = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"; // Aaveトークンのアドレス

// const walletClient = createWalletClient({
//   account: account,
//   chain: mainnet,
//   transport: http("https://mainnet.infura.io/v3/4d95e2bfc962495dafdb102c23f0ec65")
// });

// 既存のimport文はそのまま

async function generateSignature(token: DelegateToken, walletClient: any) {
  try {
      const [account] = await walletClient.getAddresses();
      console.log("account", account);

      const abi = _abi[token];
      
      // 現在のブロック番号を取得
      const currentBlock = await publicClient.getBlockNumber();
      console.log("currentBlock", currentBlock);
      
      let balance, nonce;

      // delegatorの現在のバランスを取得
      try {
        balance = await publicClient.readContract({
          address: token,
          abi: abi,
          functionName: "balanceOf",
          args: [account],
        });
      } catch (err) {
          balance = 0;
      }

      console.log("balance", balance);

      // delegatorの現在のnonceを取得（ここでは現在のnonceを使用）
      try {
        nonce = await publicClient.readContract({
          address: token,
          abi: abi,
          functionName: DelegateToken.AAAVE == token ? "nonces" : "_nonces",
          args: [account],
        });
      } catch (err) {
          nonce = 0;
      }

      console.log("- nonce", nonce);

      // deadlineを設定しない時は、maxUint256を使用する
      const deadline = maxUint256;

      // EIP-712ドメインセパレーターを取得
      const domainData = await publicClient.readContract({
        address: token,
        abi: abi,
        functionName: "eip712Domain",
        args: [],
      });

      console.log("domainData", domainData);

      // ドメイン情報を構築
      const domain = {
        name: domainData[1], // ドメイン名
        version: domainData[2], // バージョン
        chainId: Number(domainData[3]), // チェーンID
        verifyingContract: domainData[4], // 検証コントラクトアドレス
      };

      console.log("--- domain", domain);

      // EIP-712の型定義を設定
      const types = {
        Delegate: [
          { name: 'delegator', type: 'address' },
          { name: 'delegatee', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
        ],
        DelegateByType: [
          { name: 'delegator', type: 'address' },
          { name: 'delegatee', type: 'address' },
          { name: 'nonce', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
          { name: 'delegationType', type: 'uint8' },
        ],
      };

      console.log("--- nonce", Number(nonce));

      // メッセージデータを構築（nonceをそのまま使用）
      const message = {
        delegator: account,
        delegatee: delegatee,
        nonce: BigInt(Number(nonce)), // nonceをそのまま使用
        deadline: deadline, // BigIntのまま使用
        delegationType: 1,
      };

      console.log("walletClient", await walletClient.getAddresses());

      // EIP-712署名を生成
      const signature = await walletClient.signTypedData({
        account,
        domain,
        types,
        primaryType: "Delegate",
        message,
      });

      console.log("signature", signature);

      // 署名を分解（v, r, s）する
      const { v, r, s } = parseSignature(signature);
      console.log("v", v);
      console.log("r", r);
      console.log("s", s);

      return { v, r, s, account };
  } catch (error: any) {
      if (error.code === 4001) { // ユーザーがリクエストを拒否した場合
          console.error("ユーザーが署名リクエストを拒否しました。");
          // 必要に応じて、ユーザーにフィードバックを提供するコードを追加
      } else {
          console.error("署名生成中に予期しないエラーが発生しました:", error);
          // 他のエラーハンドリングを追加
      }
      throw error; // エラーを再スローして、呼び出し元でも処理できるようにする
  }
}


async function metaDelegateALL(walletClient: any) {
  const tokens = [DelegateToken.AAAVE, DelegateToken.AAVE, DelegateToken.stkAAVE];
  return metaDelegate(tokens, walletClient);
}

export async function metaDelegate(tokens: DelegateToken[], walletClient: any) {
try {
  // generate delegateParams
  const [account] = await walletClient.getAddresses();
  const delegateParams = [];
  for (const token of tokens) {
    try {
        const { v, r, s, account } = await generateSignature(token, walletClient);

        console.log("account", account);

        delegateParams.push({
          underlyingAsset: token,
          delegationType: 2,
          delegator: account,
          delegatee: delegatee,
          deadline: maxUint256,
          v: Number(v),
          r: r,
          s: s,
        });

    } catch (err: any) {
        if (err instanceof BaseError) {
          console.error("BaseError:", err);
          const revertError = (err as any).walk((e: any) => e instanceof ContractFunctionRevertedError);
          if (revertError instanceof ContractFunctionRevertedError) {
            console.error("Revert Error Name:", revertError.data?.errorName || '');
            console.error("Revert Error Details:", revertError);
          }
        } else {
          console.error("Unexpected Error:", err);
        }
        // ユーザーがキャンセルした場合は、処理を中断またはスキップ
        if (err.code === 4001) {
            console.log("ユーザーによって署名がキャンセルされました。");
            return;
        }
    }
  }

  if (delegateParams.length === 0) {
      console.log("委任パラメータがありません。処理を中断します。");
      return;
  }

  // simulate
  const { request, result } = await publicClient.simulateContract({
    address: delegateHelper,
    abi: delegateHelperABI,
    functionName: 'batchMetaDelegate',
    account: account, // simulateContractではアカウントアドレスを指定
    args:[delegateParams],
  });

  console.log("Simulation result:", result);
  console.log("Simulation request:", request);

  const hash = await walletClient.writeContract(request);
  console.log("Transaction Hash:", hash);
  return hash;
} catch (error) {
  console.error("metaDelegate 関数内でエラーが発生しました:", error);
  // 必要に応じてユーザーに通知するコードを追加
}
}
export async function getBalance(token: DelegateToken, address: any) {
  try {
    const abi = _abi[token]
    const balance = await publicClient.readContract({
      address: token,
      abi: abi,
      functionName: "balanceOf",
      args: [address],
    });
    console.log("balance", balance);
    console.log("token", token);
    return balance;
  } catch (err) {
    console.error("Unexpected Error:", err);
    return 0;
  }

}

export async function getDelegatee(token: DelegateToken, address: any) {
  try {
    const abi = _abi[token]
    const [vote, proposal] = await publicClient.readContract({
    address: token,
    abi: abi,
    functionName: "getDelegates",
    args: [address],
  });
    console.log("vote", vote);
    console.log("proposal", proposal);
    return { vote: await publicClient.getEnsName({ address: vote }), proposal: await publicClient.getEnsName({ address: proposal }) };
  } catch (err) {
    console.error("Unexpected Error:", err);
    return { vote: 0, proposal: 0 };
  }
}
