import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function VerifyResetCodeLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="space-y-2 text-center sm:text-left">
        <Skeleton className="size-11 rounded-2xl mx-auto sm:mx-0" />
        <Skeleton className="h-8 w-60 mx-auto sm:mx-0" />
        <Skeleton className="h-4 w-80 mx-auto sm:mx-0" />
      </div>

      <Card className="border border-border/80 shadow-md">
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-center gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="size-12 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </CardContent>
      </Card>
    </div>
  );
}
