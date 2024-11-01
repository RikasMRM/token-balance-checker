import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

const provider = new ethers.JsonRpcProvider(
  process.env.ETHEREUM_RPC_URL ||
    "https://eth-mainnet.g.alchemy.com/v2/your-api-key"
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const walletAddress = searchParams.get("walletAddress");
    const tokenAddress = searchParams.get("tokenAddress");

    if (!walletAddress || !tokenAddress) {
      return NextResponse.json(
        { success: false, error: "Missing parameters" },
        { status: 400 }
      );
    }

    if (!ethers.isAddress(walletAddress)) {
      return NextResponse.json(
        { success: false, error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    if (!ethers.isAddress(tokenAddress)) {
      return NextResponse.json(
        { success: false, error: "Invalid token address" },
        { status: 400 }
      );
    }

    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      provider
    );

    const [balance, decimals, symbol] = await Promise.all([
      tokenContract.balanceOf(walletAddress),
      tokenContract.decimals(),
      tokenContract.symbol(),
    ]);

    const formattedBalance = ethers.formatUnits(balance, decimals);

    return NextResponse.json({
      success: true,
      data: {
        walletAddress,
        tokenAddress,
        balance: formattedBalance,
        symbol,
      },
    });
  } catch (error) {
    console.error("Error in token balance API:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch balance",
      },
      { status: 500 }
    );
  }
}
