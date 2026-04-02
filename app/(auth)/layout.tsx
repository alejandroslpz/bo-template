export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col items-center justify-center px-6 py-12 md:px-10">
        <div className="w-full max-w-sm">
          {/* Brand */}
          <a
            href="/"
            className="mb-10 flex items-center gap-2 self-start font-semibold"
          >
            <div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md text-sm font-bold">
              A
            </div>
            <span className="text-foreground text-lg">Acme Inc</span>
          </a>
          {children}
        </div>
      </div>

      {/* Decorative branded panel */}
      <div className="bg-primary relative hidden overflow-hidden lg:block">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/40" />

        {/* Geometric shapes */}
        <div className="absolute -top-24 -right-24 size-96 rounded-full border border-primary-foreground/10" />
        <div className="absolute -top-12 -right-12 size-72 rounded-full border border-primary-foreground/10" />
        <div className="absolute top-1/2 left-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary-foreground/[0.07]" />
        <div className="absolute -bottom-32 -left-32 size-80 rounded-full border border-primary-foreground/10" />
        <div className="absolute bottom-12 right-12 size-48 rounded-full border border-primary-foreground/[0.05]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--primary-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--primary-foreground) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div className="relative flex h-full flex-col justify-end p-12">
          <blockquote className="space-y-3">
            <p className="text-primary-foreground/90 text-lg leading-relaxed font-medium">
              &ldquo;This platform has transformed how we manage our operations.
              The interface is intuitive and the insights are invaluable.&rdquo;
            </p>
            <footer className="text-primary-foreground/60 text-sm">
              &mdash; Alex Johnson, Operations Lead
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
