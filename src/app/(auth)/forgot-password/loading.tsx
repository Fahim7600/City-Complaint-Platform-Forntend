import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ForgotPasswordLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="space-y-2 text-center sm:text-left">
        <Skeleton className="size-11 rounded-2xl mx-auto sm:mx-0" />
        <Skeleton className="h-8 w-60 mx-auto sm:mx-0" />
        <Skeleton className="h-4 w-80 mx-auto sm:mx-0" />
      </div>

      <Card className="border border-border/80 shadow-md">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
          <Skeleton className="h-11 w-full rounded-xl mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}
