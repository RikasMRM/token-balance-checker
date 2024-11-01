import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-3/4" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-24 w-full" />
    </CardContent>
  </Card>
);
