import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TokenBalanceData } from "@/types/token";

interface BalanceDisplayProps {
  data: TokenBalanceData;
}

export const BalanceDisplay = ({ data }: BalanceDisplayProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Balance Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground">Token Balance</p>
        <p className="text-2xl font-bold">
          {parseFloat(data.balance).toLocaleString()} {data.symbol}
        </p>
      </div>
      <div className="pt-4 border-t">
        <p className="text-sm text-muted-foreground">Wallet Address</p>
        <p className="font-mono text-sm break-all">{data.walletAddress}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Token Contract</p>
        <p className="font-mono text-sm break-all">{data.tokenAddress}</p>
      </div>
    </CardContent>
  </Card>
);
