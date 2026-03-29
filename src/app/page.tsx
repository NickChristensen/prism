export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="mx-auto flex max-w-md flex-col gap-3 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Prism</h1>
        <p className="text-sm text-muted-foreground">
          Prism renders rich views for OpenClaw. Open a Prism link with an ID to
          see a generated page.
        </p>
      </div>
    </main>
  );
}
