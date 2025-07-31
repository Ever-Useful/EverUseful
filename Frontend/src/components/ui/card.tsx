import * as React from "react";
import { cn } from "@/lib/utils";

// Main Card
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Card: rounded, shadow, light border, smooth transition
      "bg-white dark:bg-slate-950 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-slate-800 shadow-md hover:shadow-lg transition-shadow duration-150 " +
      "overflow-hidden w-full",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

// Header section for card (flex for icons etc.)
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Mobile: tighter, space-y, flex-row-on-desktop if you want
      "flex flex-col gap-1.5 sm:gap-2 px-4 sm:px-6 pt-4 sm:pt-6 pb-2 sm:pb-3",
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

// Title: responsive, clean
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      // Mobile: 1.125rem, Desktop 1.25rem+, bold, clamp
      "font-bold text-lg sm:text-xl md:text-2xl leading-tight tracking-tight text-slate-900 dark:text-slate-100 line-clamp-1",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// Description: subdued, flexible lines
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      // Slightly darker muted color, spacing, responsive sizing
      "text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2",
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// Main content area (for text, lists, etc.)
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Responsive padding, mobile: tighter X, always bottom
      "px-4 sm:px-6 pb-4 sm:pb-6",
      className
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

// Footer area (for actions, buttons, etc.)
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Paddings and spacing; col on mobile, row on desktop
      "flex flex-col sm:flex-row sm:items-center gap-2 px-4 sm:px-6 pb-4 sm:pb-6 pt-0",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
