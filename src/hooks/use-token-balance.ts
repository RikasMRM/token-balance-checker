import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TokenBalanceData } from "@/types/token";

export const useTokenBalance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balanceData, setBalanceData] = useState<TokenBalanceData | null>(null);
  const { toast } = useToast();

  const fetchBalance = useCallback(
    async (walletAddress: string, tokenAddress: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `/api/token/balance?walletAddress=${walletAddress}&tokenAddress=${tokenAddress}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch balance");
        }

        if (data.success && data.data) {
          setBalanceData(data.data);
          toast({
            title: "Balance fetched successfully",
            description: `Retrieved balance for ${data.data.symbol}`,
          });
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "An error occurred";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { loading, error, balanceData, fetchBalance };
};
