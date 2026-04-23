export default function Button({
  children,
  variant = "primary",
  type,
  ...props
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const variants = {
    primary: "bg-sky-500 text-white hover:bg-sky-500/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    danger: "bg-destructive text-white hover:bg-destructive/90",
    ghost: "bg-transparent text-foreground hover:bg-secondary",
  };

  return (
    <button
      type={type}
      {...props}
      className={`px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} cursor-pointer`}
    >
      {children}
    </button>
  );
}
