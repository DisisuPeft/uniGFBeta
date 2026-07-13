interface Props {
  children: React.ReactNode;
}

export default function TemaLayout({ children }: Props) {
  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50">
      {children}
    </div>
  );
}
