"use client";

import { useState } from "react";

interface Token {
  symbol: string;
  name: string;
  address: string;
}

const COMMON_TOKENS: Token[] = [
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  },
  {
    symbol: "BNB",
    name: "Binance Coin",
    address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
  },
];

interface TokenBalanceData {
  balance: string;
  symbol: string;
  walletAddress: string;
  tokenAddress: string;
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balanceData, setBalanceData] = useState<TokenBalanceData | null>(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);

      const tokenAddress =
        selectedToken === "custom" ? customTokenAddress : selectedToken;
      const response = await fetch(
        `/api/token/balance?walletAddress=${walletAddress}&tokenAddress=${tokenAddress}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch balance");
      }

      if (data.success && data.data) {
        setBalanceData(data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Token Balance Checker
          </h1>
          <p className="text-gray-600">
            Check ERC20 token balances for any Ethereum wallet
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="wallet"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Wallet Address
              </label>
              <input
                id="wallet"
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="token"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Token
              </label>
              <select
                id="token"
                value={selectedToken}
                onChange={(e) => setSelectedToken(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a token</option>
                {COMMON_TOKENS.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.symbol} - {token.name}
                  </option>
                ))}
                <option value="custom">Custom Token</option>
              </select>
            </div>

            {selectedToken === "custom" && (
              <div>
                <label
                  htmlFor="custom-token"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Custom Token Address
                </label>
                <input
                  id="custom-token"
                  type="text"
                  value={customTokenAddress}
                  onChange={(e) => setCustomTokenAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <button
              onClick={fetchBalance}
              disabled={
                loading ||
                !walletAddress ||
                !selectedToken ||
                (selectedToken === "custom" && !customTokenAddress)
              }
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Checking..." : "Check Balance"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {balanceData && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Balance Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Token Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {parseFloat(balanceData.balance).toLocaleString()}{" "}
                  {balanceData.symbol}
                </p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Wallet Address</p>
                <p className="font-mono text-sm break-all">
                  {balanceData.walletAddress}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Token Contract</p>
                <p className="font-mono text-sm break-all">
                  {balanceData.tokenAddress}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
