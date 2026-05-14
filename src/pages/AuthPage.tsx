import { Activity, ArrowRight, Eye, LockKeyhole, Mail, UserRound } from 'lucide-react';
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
    <div className="min-h-screen bg-zinc-950 text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(220,38,38,0.24),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.16),_transparent_32%),linear-gradient(135deg,_rgba(24,24,27,0.96),_rgba(9,9,11,1)_68%)]" />
        <div className="relative mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
          <div>
            <div className="inline-flex items-center gap-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-100">
              <Activity className="size-4" aria-hidden="true" />
              NBA analytics portfolio
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-bold tracking-normal text-white sm:text-6xl">
              NBA Insight
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              Explore NBA analytics, standings, playoffs, games and player insights.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-4">
                <p className="font-semibold text-white">Demo Mode</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Open the full portfolio experience immediately, with account storage prepared for a later phase.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-4">
                <p className="font-semibold text-white">Account Mode</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Sign in through the NBA Insight backend and keep the session available across refreshes.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="rounded-lg border border-white/10 bg-zinc-900/85 p-5 shadow-2xl shadow-black/30">
              <span className="flex size-11 items-center justify-center rounded-lg bg-red-500/15 text-red-200">
                <Eye className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-xl font-semibold text-white">Demo Mode</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Explore the full portfolio demo without creating an account. Favorites will be stored locally in your
                browser.
              </p>
              <button
                type="button"
                onClick={handleDemoMode}
                className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"
              >
                View Demo Mode
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </article>

            <article className="rounded-lg border border-white/10 bg-zinc-900/85 p-5 shadow-2xl shadow-black/30">
              <div className="grid grid-cols-2 gap-2 rounded-lg bg-white/[0.04] p-1">
                {(['login', 'register'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab);
                      setError(null);
                    }}
                    className={`h-10 rounded-lg text-sm font-semibold transition ${
                      activeTab === tab ? 'bg-white text-zinc-950' : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {tab === 'login' ? 'Login' : 'Register'}
                  </button>
                ))}
              </div>

              <form className="mt-5 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
                {isRegister ? (
                  <label className="block">
                    <span className="text-sm font-medium text-zinc-200">Name</span>
                    <span className="mt-2 flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-zinc-950/70 px-3 focus-within:border-red-300">
                      <UserRound className="size-4 text-zinc-500" aria-hidden="true" />
                      <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                        minLength={2}
                        autoComplete="name"
                        className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                        placeholder="Your name"
                      />
                    </span>
                  </label>
                ) : null}

                <label className="block">
                  <span className="text-sm font-medium text-zinc-200">Email</span>
                  <span className="mt-2 flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-zinc-950/70 px-3 focus-within:border-red-300">
                    <Mail className="size-4 text-zinc-500" aria-hidden="true" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      autoComplete="email"
                      className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                      placeholder="you@example.com"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-zinc-200">Password</span>
                  <span className="mt-2 flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-zinc-950/70 px-3 focus-within:border-red-300">
                    <LockKeyhole className="size-4 text-zinc-500" aria-hidden="true" />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      minLength={6}
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                      className="h-full min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
                      placeholder="Password"
                    />
                  </span>
                </label>

                {error ? (
                  <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Working...' : isRegister ? 'Create Account' : 'Log In'}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </form>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
