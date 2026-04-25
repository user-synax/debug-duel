import * as React from "react"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00ff87] disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-[#00ff87] text-black hover:bg-[#00cc6a]",
    outline: "border border-[#2a2a2a] bg-transparent text-white hover:bg-[#1a1a1a]",
    ghost: "text-white hover:bg-[#1a1a1a]",
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
