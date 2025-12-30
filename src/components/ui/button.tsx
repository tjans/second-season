import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { useNavigate } from "react-router-dom"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-default text-primary-foreground shadow hover:bg-default/90",
        warning:
          "bg-warning text-warning-fg shadow hover:bg-warning/100",
        info:
          "bg-info text-info-fg shadow hover:bg-info/100",
        success:
          "bg-success text-success-fg shadow hover:bg-success/100",
        error:
          "bg-error text-error-fg shadow-sm hover:bg-error/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-fg shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-default underline underline-offset-2 hover:underline",
      },
      size: {
        default: "px-6 py-3",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean,
  onClick?: () => void,
  to?: string,
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const navigate = useNavigate();
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        onClick={() => {
          if (props.to) navigate(props.to);
          else if (typeof props.onClick === "function") props.onClick();
        }}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
