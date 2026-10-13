"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Phone, Save, User as UserIcon, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  updateProfileSchema,
  type UpdateProfileFormData,
} from "@/schemas/profile-schemas";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth-store";
import { getErrorMessage } from "@/lib/axios";
import type { User } from "@/types/user";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
      avatarUrl: user.avatarUrl || "",
    },
  });

  const watchedAvatarUrl = watch("avatarUrl");
  const displayAvatar = watchedAvatarUrl || user.avatarUrl || undefined;

  const initials = (user.name || "Citizen")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const onSubmit = async (data: UpdateProfileFormData) => {
    setIsSubmitting(true);
    try {
      const updatedUser = await userService.updateMe({
        name: data.name.trim(),
        phone: data.phone?.trim() || undefined,
        avatarUrl: data.avatarUrl?.trim() || undefined,
      });

      // Update auth store so sidebar & greeting reflect new name immediately
      setUser(updatedUser);
      reset({
        name: updatedUser.name,
        phone: updatedUser.phone || "",
        avatarUrl: updatedUser.avatarUrl || "",
      });

      toast.success("Profile updated");
    } catch (err) {
      toast.error(getErrorMessage(err) || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-border/70 bg-card/60 backdrop-blur-sm">
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-4 border-b border-border/50">
          <Avatar className="size-16 rounded-2xl border-2 border-primary/20 shadow-sm">
            {displayAvatar && <AvatarImage src={displayAvatar} alt={user.name} />}
            <AvatarFallback className="rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-600 text-white font-bold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h3 className="font-heading text-lg font-bold text-foreground">
              {user.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {user.email} • Citizen Account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-name" className="text-xs font-semibold">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="profile-name"
                {...register("name")}
                placeholder="Your full legal name"
                className={cn(
                  "pl-9 h-9 text-xs bg-background/80 border-border/70",
                  errors.name && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
            </div>
            {errors.name && (
              <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email (Read Only) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-email" className="text-xs font-semibold">
                Email Address
              </Label>
              <span className="text-[11px] text-muted-foreground">Read-only</span>
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="profile-email"
                value={user.email}
                disabled
                className="pl-9 h-9 text-xs bg-muted/50 border-border/50 text-muted-foreground cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-phone" className="text-xs font-semibold">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="profile-phone"
                {...register("phone")}
                placeholder="e.g. +1 (555) 123-4567"
                className={cn(
                  "pl-9 h-9 text-xs bg-background/80 border-border/70",
                  errors.phone && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
            </div>
            {errors.phone && (
              <p className="text-xs font-medium text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Avatar URL */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-avatar" className="text-xs font-semibold">
              Avatar Image URL
            </Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-2.5 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="profile-avatar"
                {...register("avatarUrl")}
                placeholder="https://example.com/avatar.jpg"
                className={cn(
                  "pl-9 h-9 text-xs bg-background/80 border-border/70",
                  errors.avatarUrl && "border-destructive focus-visible:ring-destructive/30"
                )}
              />
            </div>
            {errors.avatarUrl && (
              <p className="text-xs font-medium text-destructive">
                {errors.avatarUrl.message}
              </p>
            )}
          </div>

          {/* Submit Button: Enabled ONLY when form is dirty */}
          <div className="pt-2 flex items-center justify-end">
            <Button
              type="submit"
              disabled={!isDirty || isSubmitting}
              className={cn(
                "text-xs font-semibold transition-all duration-200",
                isDirty
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                  : "opacity-60 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="size-3.5 mr-1.5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
