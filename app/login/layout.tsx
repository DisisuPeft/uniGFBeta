export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#2F7FB1_0%,#0F4C75_60%,#0A3A5A_100%)]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `#2E3846`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 pt-20 pb-16 text-center">
        {children}
      </div>
    </section>
  );
}
