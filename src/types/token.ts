export interface Token {
  symbol: string;
  name: string;
  address: string;
}

export interface TokenBalanceData {
  balance: string;
  symbol: string;
  walletAddress: string;
  tokenAddress: string;
}
