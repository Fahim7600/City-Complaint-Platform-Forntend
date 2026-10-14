import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TechnicianJobNotFound() {
  return (
    <div className="max-w-md mx-auto py-20 px-4">
      <Card className="border border-border/80 bg-card/80 backdrop-blur-md text-center p-8 space-y-5 shadow-xl">
        <div className="flex size-16 mx-auto items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 shadow-inner">
          <Wrench className="size-8" />
        </div>

        <div className="space-y-1.5">
          <h2 className="font-heading text-xl font-bold text-foreground">
            Job Not Found
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This work order does not exist or has not been assigned to your technician account.
          </p>
        </div>

        <Link href="/technician" className="block pt-2">
          <Button className="w-full text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-md">
            <ArrowLeft className="size-3.5 mr-2" />
            Back to my assigned jobs
          </Button>
        </Link>
      </Card>
    </div>
  );
}
