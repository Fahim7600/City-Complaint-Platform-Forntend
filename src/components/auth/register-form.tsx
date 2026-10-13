"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Check, Eye, EyeOff, Loader2, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { setTokens } from "@/lib/auth-cookies";
import { getErrorMessage } from "@/lib/axios";
import { registerSchema, type RegisterFormData } from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth-store";

export function RegisterForm() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const { setUser } = useAuthStore();
  const { resolvedTheme } = useTheme();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const passwordValue = useWatch({ control, name: "password" }) || "";

  // Password strength computation
  const passwordCriteria = React.useMemo(() => {
    return [
      { label: "At least 8 characters", met: passwordValue.length >= 8 },
      { label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(passwordValue) },
      { label: "One lowercase letter (a-z)", met: /[a-z]/.test(passwordValue) },
      { label: "One number (0-9)", met: /[0-9]/.test(passwordValue) },
    ];
  }, [passwordValue]);

  const strengthScore = React.useMemo(() => {
    return passwordCriteria.filter((c) => c.met).length;
  }, [passwordCriteria]);

  const strengthPercent = (strengthScore / 4) * 100;

  const strengthColor =
    strengthScore <= 1
      ? "bg-destructive text-destructive"
      : strengthScore <= 2
        ? "bg-amber-500 text-amber-500"
        : strengthScore === 3
          ? "bg-teal-500 text-teal-600 dark:text-teal-400"
          : "bg-emerald-500 text-emerald-600 dark:text-emerald-400";

  const strengthLabel =
    strengthScore === 0
      ? "Very Weak"
      : strengthScore === 1
        ? "Weak"
        : strengthScore === 2
          ? "Fair"
          : strengthScore === 3
            ? "Good"
            : "Strong";

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (response && response.accessToken) {
        setTokens({
          accessToken: response.accessToken,
          role: response.user.role,
          expiresInDays: 7,
        });
        setUser(response.user);
        toast.success("Account created! Welcome to CityFix");
        router.replace("/dashboard");
      } else {
        toast.success("Account registered successfully! Please sign in.");
        router.replace("/login");
      }
    } catch (err) {
      const message = getErrorMessage(err);
      toast.error(message);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 1. Page Heading */}
      <div className="space-y-1.5 text-center sm:text-left">
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Create an account ✨
        </h1>
        <p className="text-sm text-muted-foreground">
          Join CityFix to report neighborhood issues and follow municipal resolutions.
        </p>
      </div>

      {/* 2. Registration Form Card */}
      <Card className="border border-border/80 shadow-md backdrop-blur-sm bg-card/95">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-semibold">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Citizen"
                disabled={isSubmitting}
                className={errors.name ? "border-destructive focus-visible:ring-destructive/20" : ""}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="jane@example.com"
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

            {/* Phone (Optional) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="phone" className="text-xs font-semibold">
                  Phone Number
                </Label>
                <span className="text-[11px] text-muted-foreground">Optional</span>
              </div>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+1 (555) 019-2834"
                disabled={isSubmitting}
                className={errors.phone ? "border-destructive focus-visible:ring-destructive/20" : ""}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
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
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive font-medium">
                  {errors.password.message}
                </p>
              )}

              {/* Real-time Password Strength Meter */}
              {passwordValue.length > 0 && (
                <div className="space-y-2 pt-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Password strength:</span>
                    <span className={`font-semibold capitalize ${strengthColor.split(" ")[1]}`}>
                      {strengthLabel}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ease-out ${strengthColor.split(" ")[0]}`}
                      style={{ width: `${strengthPercent}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                    {passwordCriteria.map((c) => (
                      <div
                        key={c.label}
                        className={`flex items-center gap-1.5 ${
                          c.met ? "text-teal-600 dark:text-teal-400 font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {c.met ? (
                          <Check className="size-3 text-teal-500 shrink-0" />
                        ) : (
                          <X className="size-3 text-muted-foreground/60 shrink-0" />
                        )}
                        <span className="truncate">{c.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  disabled={isSubmitting}
                  className={`pr-10 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive font-medium">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="neon"
              size="lg"
              disabled={isSubmitting}
              className="w-full mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                <>
                  <Sparkles className="size-4 mr-1.5" />
                  Register Citizen Account
                </>
              )}
            </Button>
          </form>

          {/* 3. Google OAuth Button */}
          <div className="mt-5 pt-5 border-t border-border flex flex-col items-center">
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    void loginWithGoogle(credentialResponse.credential, "/dashboard");
                  }
                }}
                onError={() => {
                  toast.error("Google registration failed or was cancelled.");
                }}
                theme={resolvedTheme === "dark" ? "filled_black" : "outline"}
                shape="rectangular"
                text="signup_with"
                size="large"
                width="100%"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Link to Sign In */}
      <div className="text-center text-sm text-muted-foreground pt-1">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-accent underline underline-offset-4 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
