'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'techcart-premium';

export default function PremiumPage() {
  const [formData, setFormData] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    email: '',
  });
  const [error, setError] = useState('');
  const [paid, setPaid] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hasPremium = window.localStorage.getItem(STORAGE_KEY) === 'true';

    // Read the browser flag after mount so the first render stays stable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPaid(hasPremium);
    setIsReady(true);
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Please enter the cardholder name.';
    }

    const digits = formData.cardNumber.replace(/\D/g, '');

    if (digits.length < 12) {
      return 'Please enter a valid card number.';
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
      return 'Please use an MM/YY expiry date.';
    }

    if (formData.cvc.trim().length < 3) {
      return 'Please enter a valid CVC.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      return 'Please enter a valid email address.';
    }

    return '';
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'true');
      window.dispatchEvent(new CustomEvent('premium-status-updated'));
    }

    setPaid(true);
    setError('');
  };

  if (!isReady) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-6 py-16 text-zinc-600 dark:text-zinc-300">
        Checking your premium status...
      </main>
    );
  }

  if (paid) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-16">
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm dark:border-emerald-900/70 dark:bg-emerald-950/40">
          <p className="text-sm uppercase tracking-[0.35em] text-emerald-700 dark:text-emerald-200">
            Premium account
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-emerald-900 dark:text-emerald-50 sm:text-4xl">
            ✅ Payment complete, ads removed!
          </h1>
          <p className="mt-4 max-w-xl text-zinc-700 dark:text-zinc-200">
            Your premium flag is saved in the browser, so the ads will stay gone on refresh and on future visits.
          </p>
          <p className="mt-6 rounded-2xl bg-white/80 px-4 py-3 text-sm text-zinc-700 shadow-sm dark:bg-zinc-900/80 dark:text-zinc-200">
            The next time you open TechCart, the ad banners will stay hidden until you clear the premium flag.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-12">
      <section className="mb-8">
        <p className="text-sm uppercase tracking-[0.35em] text-indigo-700 dark:text-indigo-200">
          Go Premium
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Unlock an ad-free shopping experience
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-300">
          This is a mock checkout. No real money is charged, but the premium status is stored in your browser so it survives refreshes.
        </p>
      </section>

      <section className="grid gap-8 rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="space-y-4 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white shadow-lg">
          <p className="text-sm uppercase tracking-[0.35em] text-indigo-100">Why premium?</p>
          <h2 className="text-2xl font-semibold">A calmer shopping trip</h2>
          <ul className="space-y-3 text-sm text-indigo-50">
            <li>• No top banner or blinking corner ad.</li>
            <li>• Faster, cleaner browsing on every page.</li>
            <li>• Your upgrade is remembered in local storage.</li>
          </ul>
        </article>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-black/10 bg-zinc-50 p-6 dark:border-white/10 dark:bg-black/40">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Cardholder name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-950"
              placeholder="Alex Morgan"
            />
          </label>

          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Card number
            <input
              type="text"
              name="cardNumber"
              inputMode="numeric"
              value={formData.cardNumber}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-950"
              placeholder="4242 4242 4242 4242"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Expiry date
              <input
                type="text"
                name="expiry"
                value={formData.expiry}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-950"
                placeholder="MM/YY"
              />
            </label>

            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
              CVC
              <input
                type="text"
                name="cvc"
                inputMode="numeric"
                value={formData.cvc}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-950"
                placeholder="123"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/10 dark:bg-zinc-950"
              placeholder="shopper@example.com"
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/70 dark:bg-rose-950/40 dark:text-rose-100">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Complete payment
          </button>
        </form>
      </section>
    </main>
  );
}
