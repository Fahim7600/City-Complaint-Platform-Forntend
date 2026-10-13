import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ComplaintNotFound() {
  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <Card className="border border-border/80 bg-card/80 backdrop-blur-md text-center p-8 space-y-5 shadow-lg">
        <div className="flex size-16 mx-auto items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-inner">
          <FileQuestion className="size-8" />
        </div>

        <div className="space-y-1.5">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Complaint Not Found
          </h2>
          <p className="text-xs text-muted-foreground">
            This complaint does not exist, has been removed, or you do not have authorization to inspect it.
          </p>
        </div>

        <Link href="/dashboard/complaints" className="block pt-2">
          <Button className="w-full text-xs font-semibold">
            <ArrowLeft className="size-3.5 mr-2" />
            Back to my complaints
          </Button>
        </Link>
      </Card>
    </div>
  );
}
