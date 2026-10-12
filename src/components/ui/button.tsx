import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out outline-none select-none cursor-pointer hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_0_15px_-2px_rgba(168,85,247,0.35)] hover:bg-primary/90 hover:shadow-[0_0_24px_rgba(168,85,247,0.65)]",
        neon:
          "bg-gradient-to-r from-[#9333ea] via-[#a855f7] to-[#c084fc] text-white font-semibold shadow-[0_0_22px_rgba(168,85,247,0.7)] hover:shadow-[0_0_32px_rgba(192,132,252,0.95)] hover:brightness-110",
        outline:
          "border border-border bg-background/60 backdrop-blur-xs text-foreground hover:border-[#a855f7] dark:hover:border-[#c084fc] hover:text-foreground hover:shadow-[0_0_18px_rgba(168,85,247,0.45)] dark:hover:shadow-[0_0_22px_rgba(192,132,252,0.55)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_0_16px_rgba(239,68,68,0.5)] hover:bg-destructive/90 hover:shadow-[0_0_26px_rgba(239,68,68,0.85)] active:bg-destructive/95",
        ghost:
          "hover:bg-muted hover:text-foreground",
        link:
          "text-primary underline-offset-4 hover:underline hover:translate-y-0 active:scale-100",
      },
      size: {
        default:
          "h-9 gap-2 px-3.5 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs:
          "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm:
          "h-8 gap-1.5 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.825rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg:
          "h-11 gap-2.5 rounded-xl px-5 text-base has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-9",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
