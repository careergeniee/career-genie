import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      // max-sm: (not sm:) is deliberate: some consumers (Signup, ForgotPassword) pass their
      // own h-12 override className. sm:h-10 would win that cascade at desktop, shrinking
      // those inputs back down to 40px; max-sm:h-11 can't, since it's false at sm+ regardless
      // of class order/specificity.
      <input
        type={type}
        className={cn(
          "flex h-10 max-sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
