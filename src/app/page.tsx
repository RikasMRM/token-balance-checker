"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { TokenBalanceForm } from "@/components/token-balance/token-balance-form";
import { BalanceDisplay } from "@/components/token-balance/balance-display";
import { LoadingSkeleton } from "@/components/token-balance/loading-skeleton";
import { useTokenBalance } from "@/hooks/use-token-balance";

export default function TokenBalanceCheckerPage() {
  const { loading, error, balanceData, fetchBalance } = useTokenBalance();

  return (
    <main className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Token Balance Checker
          </h1>
          <p className="text-muted-foreground">
            Check ERC20 token balances for any Ethereum wallet
          </p>
        </div>

        <TokenBalanceForm onSubmit={fetchBalance} loading={loading} />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <LoadingSkeleton />
        ) : (
          balanceData && <BalanceDisplay data={balanceData} />
        )}
      </div>
    </main>
  );
}
