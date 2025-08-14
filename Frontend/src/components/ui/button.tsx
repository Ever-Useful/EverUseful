import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
// test
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none cursor-pointer " +
  "min-w-[44px] min-h-[44px] px-4 py-2 " +
  "transition-colors transition-shadow duration-150 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 active:scale-[.98] " +
  "shadow-sm " + 
  "disabled:pointer-events-none disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:h-5 [&_svg]:w-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 shadow-md shadow-primary/10 font-bold",
        outline: "border bg-background border-primary/30 text-primary hover:bg-primary/5 active:bg-primary/10 font-bold",
        ghost: "bg-transparent text-primary hover:bg-primary/5 active:bg-primary/10 font-bold",
      },
      size: {
        default: "text-base sm:text-base md:text-base lg:text-lg px-4 py-2", 
        xs: "text-xs px-2 py-1", 
        sm: "text-sm px-3 py-1.5", 
        lg: "text-lg px-6 py-3", 
        icon: "p-0 w-[44px] h-[44px] text-base", 
      },
      block: {
        true: "w-full justify-center",
        false: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      block: false,
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
  asChild?: boolean;
  block?: boolean; 
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, block = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, block, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
