import { ArrowRight, Eye, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type AuthTab = 'login' | 'register';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export function AuthPage() {
  const navigate = useNavigate();
  const { enterDemoMode, login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = activeTab === 'register';

  function handleDemoMode() {
    enterDemoMode();
    navigate('/');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isRegister) {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }

      navigate('/');
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-ink-950 text-text-primary">
      <section className="relative overflow-hidden border-b border-rule">
        <div
          className="scorebug-reveal absolute inset-0 bg-[linear-gradient(105deg,transparent_58%,rgba(255,107,26,0.10)_58%,rgba(255,107,26,0.10)_64%,transparent_64%,transparent_82%,rgba(47,211,201,0.06)_82%,rgba(47,211,201,0.06)_86%,transparent_86%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-medium text-ledger-blue">NBA analytics portfolio</p>
            <h1 className="mt-4 max-w-3xl font-display text-6xl font-bold leading-[0.95] tracking-tight text-text-primary sm:text-7xl">
              NBA Insight
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
              Explore NBA analytics, standings, playoffs, games and player insights.
            </p>
            <div className="mt-8 grid divide-y divide-rule border-t border-rule sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <div className="py-4 sm:py-0 sm:pr-6">
                <p className="font-display text-lg font-semibold text-text-primary">Demo mode</p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Open the full portfolio experience immediately, with account storage prepared for a later phase.
                </p>
              </div>
              <div className="py-4 sm:py-0 sm:pl-6">
                <p className="font-display text-lg font-semibold text-text-primary">Account mode</p>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  Sign in through the NBA Insight backend and keep the session available across refreshes.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="border border-rule bg-ink-900 p-5">
              <Eye className="size-5 text-score-orange" aria-hidden="true" />
              <h2 className="mt-5 font-display text-xl font-semibold text-text-primary">Demo mode</h2>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                Explore the full portfolio demo without creating an account. Favorites will be stored locally in your
                browser.
              </p>
              <button
                type="button"
                onClick={handleDemoMode}
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 bg-score-orange px-4 text-sm font-semibold text-ink-950 transition-colors hover:bg-score-orange/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
              >
                View Demo Mode
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </article>

            <article className="border border-rule bg-ink-900 p-5">
              <div className="flex border-b border-rule">
                {(['login', 'register'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setError(null);
                    }}
                    className={`relative h-10 flex-1 font-body text-sm font-semibold transition-colors ${
                      activeTab === tab ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {tab === 'login' ? 'Login' : 'Register'}
                    {activeTab === tab ? (
                      <span className="absolute inset-x-0 -bottom-px h-[2px] bg-score-orange" aria-hidden="true" />
                    ) : null}
                  </button>
                ))}
              </div>

              <form className="mt-5 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
                {isRegister ? (
                  <label className="block">
                    <span className="text-sm font-medium text-text-secondary">Name</span>
                    <span className="mt-2 flex h-11 items-center gap-2 border border-rule bg-ink-950 px-3 focus-within:border-live-cyan/60">
                      <UserRound className="size-4 text-text-secondary" aria-hidden="true" />
                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                        minLength={2}
                        autoComplete="name"
                        className="h-full min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/60"
                        placeholder="Your name"
                      />
                    </span>
                  </label>
                ) : null}

                <label className="block">
                  <span className="text-sm font-medium text-text-secondary">Email</span>
                  <span className="mt-2 flex h-11 items-center gap-2 border border-rule bg-ink-950 px-3 focus-within:border-live-cyan/60">
                    <Mail className="size-4 text-text-secondary" aria-hidden="true" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      autoComplete="email"
                      className="h-full min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/60"
                      placeholder="you@example.com"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-text-secondary">Password</span>
                  <span className="mt-2 flex h-11 items-center gap-2 border border-rule bg-ink-950 px-3 focus-within:border-live-cyan/60">
                    <LockKeyhole className="size-4 text-text-secondary" aria-hidden="true" />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength={6}
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                      className="h-full min-w-0 flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/60"
                      placeholder="Password"
                    />
                  </span>
                </label>

                {error ? (
                  <p className="border border-down/30 bg-down/10 px-3 py-2 text-sm text-text-primary">{error}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 bg-score-orange px-4 text-sm font-semibold text-ink-950 transition-colors hover:bg-score-orange/90 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-live-cyan/60"
                >
                  {isSubmitting ? 'Working...' : isRegister ? 'Create Account' : 'Log In'}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </form>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
