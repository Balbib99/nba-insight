export function Footer() {
  return (
    <footer className="border-t border-rule bg-ink-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p className="font-medium text-text-primary">NBA Insight</p>
          <p className="mt-0.5">Full-stack: React, Node/Express, PostgreSQL, FastAPI.</p>
        </div>
        <div className="flex flex-wrap gap-5">
          <a
            className="font-medium text-text-secondary underline decoration-rule underline-offset-4 transition-colors hover:text-text-primary hover:decoration-score-orange"
            href="https://github.com/Balbib99"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="font-medium text-text-secondary underline decoration-rule underline-offset-4 transition-colors hover:text-text-primary hover:decoration-score-orange"
            href="https://www.linkedin.com/in/balbino-martinez-rodriguez-2912bb332"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
