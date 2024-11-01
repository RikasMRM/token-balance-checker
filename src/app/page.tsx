"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { TokenBalanceForm } from "@/components/token-balance/token-balance-form";
import { BalanceDisplay } from "@/components/token-balance/balance-display";
import { LoadingSkeleton } from "@/components/token-balance/loading-skeleton";
import { useTokenBalance } from "@/hooks/use-token-balance";

export default function TokenBalanceCheckerPage() {
  const { loading, error, balanceData, fetchBalance } = useTokenBalance();

  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <main className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-2xl px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Token Balance Checker
            </h1>
            <p className="text-muted-foreground">
              Check ERC20 token balances for any Ethereum wallet
            </p>
          </div>

          <div className="mt-8">
            <TokenBalanceForm onSubmit={fetchBalance} loading={loading} />

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="mt-4">
                <LoadingSkeleton />
              </div>
            ) : (
              balanceData && (
                <div className="mt-4">
                  <BalanceDisplay data={balanceData} />
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
