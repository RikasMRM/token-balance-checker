import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { COMMON_TOKENS } from "@/constants/tokens";

interface TokenBalanceFormProps {
  onSubmit: (walletAddress: string, tokenAddress: string) => void;
  loading: boolean;
}

export const TokenBalanceForm = ({
  onSubmit,
  loading,
}: TokenBalanceFormProps) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [customTokenAddress, setCustomTokenAddress] = useState("");

  const handleSubmit = () => {
    const tokenAddress =
      selectedToken === "custom" ? customTokenAddress : selectedToken;
    onSubmit(walletAddress, tokenAddress);
  };

  const isFormValid =
    walletAddress &&
    selectedToken &&
    (selectedToken !== "custom" || customTokenAddress);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check Token Balance</CardTitle>
        <CardDescription>
          Enter wallet details to check ERC20 token balance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="wallet">
            Wallet Address
          </label>
          <Input
            id="wallet"
            placeholder="0x..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Token</label>
          <Select value={selectedToken} onValueChange={setSelectedToken}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a token" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_TOKENS.map((token) => (
                <SelectItem key={token.address} value={token.address}>
                  {token.symbol} - {token.name}
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom Token</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedToken === "custom" && (
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="custom-token">
              Custom Token Address
            </label>
            <Input
              id="custom-token"
              placeholder="0x..."
              value={customTokenAddress}
              onChange={(e) => setCustomTokenAddress(e.target.value)}
            />
          </div>
        )}

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!isFormValid || loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Checking..." : "Check Balance"}
        </Button>
      </CardContent>
    </Card>
  );
};
