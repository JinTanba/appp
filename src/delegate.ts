const _abi = require('./abi.json');
const { 
  createPublicClient, parseSignature, BaseError, ContractFunctionRevertedError, http, maxUint256
} = require('viem');
const { mainnet } = require('viem/chains');




export enum DelegateToken {
    AAVE = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    AAAVE = "0xA700b4eB416Be35b2911fd5Dee80678ff64fF6C9",
    stkAAVE = "0x4da27a545c0c5B758a6BA100e3a049001de870f5"
}


const delegatee = "0x08651EeE3b78254653062BA89035b8F8AdF924CE"; // デリゲート先アドレス

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http()
});


export async function metaDelegate(token: DelegateToken, walletClient: any) {
    const [account] = await walletClient.getAddresses()
    console.log("account", account);

    try {
    const abi = _abi[token]

    const currentBlock = await publicClient.getBlockNumber();
    console.log("currentBlock", currentBlock);

    const balance = await publicClient.readContract({
      address: token,
      abi: abi,
      functionName: "balanceOf",
      args: [account],
    });

    if (balance == 0) {
        console.log("balance is 0");
        return;
    }

    console.log("balance", balance);

    // delegatorの現在のnonceを取得（ここでは現在のnonceを使用）
    const nonce = await publicClient.readContract({
      address: token,
      abi: abi,
      functionName: DelegateToken.AAAVE == token ? "nonces" : "_nonces",
      args: [account],
    });

    console.log("- nonce", nonce);

    // 署名の有効期限を現在時刻から1時間後に設定
    const deadline = maxUint256// 1時間後

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
    console.log("--- nonce", Number(nonce));
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

    console.log("account", account);

    // シミュレーションの場合
    try {
      const { request, result } = await publicClient.simulateContract({
        address: token,
        abi: abi,
        functionName: 'metaDelegate',
        account: account, // simulateContractではアカウントアドレスを指定
        args: [
          account,
          delegatee,
          deadline,
          // 1,
          Number(v),
          r,
          s,
        ],
      });
      console.log("Simulation result:", result);
      console.log("Simulation request:", request);

      const hash = await walletClient.writeContract(request);
      console.log("Transaction Hash:", hash);
      return hash;
    } catch (err) {
      console.log("--- err ----\n\n\n\n");

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

      console.log("\n\n\n\n--- err ---");
      return null;
    }

    // 実際にトランザクションを送信する場合は以下を有効化
    /*
    const tx = await walletClient.writeContract({
      address: token,
      abi: abi,
      functionName: 'metaDelegate',
      args: [
        account,
        delegatee,
        deadline,
        v,
        r,
        s,
      ],
    });
    console.log("Transaction Hash:", tx.hash);
    */

  } catch (err) {
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
  }
}

export async function getBalance(token: DelegateToken, address: any) {
  console.log("^^^^^^^token", token);
  const abi = _abi[token]
  const balance = await publicClient.readContract({
    address: token,
    abi: abi,
    functionName: "balanceOf",
    args: [address],
  });
  return balance;
}