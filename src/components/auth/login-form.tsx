"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Briefcase,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  User as UserIcon,
  Wrench,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { apiClient } from "@/lib/axios";
import { DEMO_ACCOUNTS, type DemoAccount } from "@/lib/demo-accounts";
import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";
import type { Role } from "@/types/user";

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || undefined;
  const expiredParam = searchParams.get("expired");

  const { login, loginWithGoogle, demoLogin } = useAuth();
  const { resolvedTheme } = useTheme();

  const [showPassword, setShowPassword] = React.useState(false);
  const [activeDemoRole, setActiveDemoRole] = React.useState<Role | null>(null);

  // Cold-start warm-up: silently ping backend to wake Render server
  React.useEffect(() => {
    apiClient.get("/public/categories").catch(() => {});
  }, []);

  // Show session expired notification if redirected from token expiration
  React.useEffect(() => {
    if (expiredParam === "1") {
      toast.info("Your session expired, please sign in again");
    }
  }, [expiredParam]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data, redirectParam);
    } catch {
      // Handled in useAuth with toast
    }
  };

  const handleDemoLogin = async (role: Role) => {
    setActiveDemoRole(role);
    try {
      await demoLogin(role, redirectParam);
    } catch {
      // Handled in useAuth with toast
    } finally {
      setActiveDemoRole(null);
    }
  };

  const renderDemoIcon = (iconName: DemoAccount["iconName"]) => {
    switch (iconName) {
      case "User":
        return <UserIcon className="size-4.5 text-[#327c69] dark:text-[#77b7a8]" />;
      case "Wrench":
        return <Wrench className="size-4.5 text-[#a855f7]" />;
      case "Briefcase":
        return <Briefcase className="size-4.5 text-[#c084fc]" />;
      case "Shield":
        return <Shield className="size-4.5 text-[#ef4444]" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Page Heading */}
      <div className="space-y-1.5 text-center sm:text-left">
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to track your municipal requests and civic updates.
        </p>
      </div>

      {/* 2. Primary Form Card */}
      <Card className="border border-border/80 shadow-md backdrop-blur-sm bg-card/95">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                disabled={isSubmitting}
                className={errors.email ? "border-destructive focus-visible:ring-destructive/20" : ""}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="neon"
              size="lg"
              disabled={isSubmitting || activeDemoRole !== null}
              className="w-full mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* 3. Google OAuth Button */}
          <div className="mt-5 pt-5 border-t border-border flex flex-col items-center">
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    void loginWithGoogle(credentialResponse.credential, redirectParam);
                  }
                }}
                onError={() => {
                  toast.error("Google authentication failed or was cancelled.");
                }}
                theme={resolvedTheme === "dark" ? "filled_black" : "outline"}
                shape="rectangular"
                text="continue_with"
                size="large"
                width="100%"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Quick Demo Login Divider */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative bg-background px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          OR &bull; 🚀 Quick Demo Login
        </div>
      </div>

      {/* 5. Four Responsive Demo Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {(Object.keys(DEMO_ACCOUNTS) as Role[]).map((role) => {
          const demo = DEMO_ACCOUNTS[role];
          const isThisLoading = activeDemoRole === role;

          return (
            <Card
              key={role}
              className={`hover-lift border border-border/80 transition-all duration-300 bg-card/80 ${demo.glowColor}`}
            >
              <CardHeader className="p-3.5 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-muted/80">
                      {renderDemoIcon(demo.iconName)}
                    </div>
                    <CardTitle className="text-sm font-bold">
                      {demo.name.replace("Demo ", "")}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${demo.badgeColor}`}>
                    {role}
                  </Badge>
                </div>
                <CardDescription className="text-xs line-clamp-2 mt-1">
                  {demo.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3.5 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting || activeDemoRole !== null}
                  onClick={() => handleDemoLogin(role)}
                  className="w-full text-xs font-semibold hover:border-primary/50"
                >
                  {isThisLoading ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin mr-1.5" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <Zap className="size-3 mr-1 text-accent" />
                      Demo Login
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Render Wake-up Note */}
      <p className="text-center text-xs text-muted-foreground italic">
        Note: The backend service may take ~30s to wake up on cold start (Render free tier).
      </p>

      {/* 6. Link to Register */}
      <div className="text-center text-sm text-muted-foreground pt-2">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:text-accent underline underline-offset-4 transition-colors"
        >
          Create citizen account
        </Link>
      </div>
    </div>
  );
}
