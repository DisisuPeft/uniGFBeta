export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-border rounded-xl p-6 ${className}`}
    >
      {children}
    </div>
  );
}
