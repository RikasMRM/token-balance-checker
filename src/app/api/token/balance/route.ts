import { ethers, Contract } from "ethers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type TokenMetadata = {
  decimals: number;
  symbol: string;
};

interface TokenBalanceResponse {
  success: boolean;
  data?: {
    walletAddress: string;
    tokenAddress: string;
    balance: string;
    symbol: string;
  };
  error?: string;
}

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
] as const;

const ENV = z
  .object({
    ETHEREUM_RPC_URL: z.string().url(),
  })
  .parse(process.env);

const getProvider = () => {
  try {
    return new ethers.JsonRpcProvider(ENV.ETHEREUM_RPC_URL);
  } catch (error) {
    console.error("Failed to initialize provider:", error);
    throw new Error("Provider initialization failed");
  }
};

const RequestParams = z.object({
  walletAddress: z
    .string()
    .refine((address) => ethers.isAddress(address), "Invalid wallet address"),
  tokenAddress: z
    .string()
    .refine((address) => ethers.isAddress(address), "Invalid token address"),
});

const tokenMetadataCache = new Map<string, TokenMetadata>();

async function getTokenMetadata(
  contract: Contract,
  tokenAddress: string
): Promise<TokenMetadata> {
  const cached = tokenMetadataCache.get(tokenAddress);
  if (cached) return cached;

  const [decimals, symbol] = await Promise.all([
    contract.decimals(),
    contract.symbol(),
  ]);

  const metadata = { decimals, symbol };
  tokenMetadataCache.set(tokenAddress, metadata);
  return metadata;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<TokenBalanceResponse>> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = RequestParams.parse({
      walletAddress: searchParams.get("walletAddress"),
      tokenAddress: searchParams.get("tokenAddress"),
    });

    const provider = getProvider();
    const tokenContract = new ethers.Contract(
      params.tokenAddress,
      ERC20_ABI,
      provider
    );

    const [balance, metadata] = await Promise.all([
      tokenContract.balanceOf(params.walletAddress),
      getTokenMetadata(tokenContract, params.tokenAddress),
    ]);

    const formattedBalance = ethers.formatUnits(balance, metadata.decimals);

    return NextResponse.json({
      success: true,
      data: {
        walletAddress: params.walletAddress,
        tokenAddress: params.tokenAddress,
        balance: formattedBalance,
        symbol: metadata.symbol,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error in token balance API:", error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: "edge",
  regions: ["iad1"],
};
