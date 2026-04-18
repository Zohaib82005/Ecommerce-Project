import React, { useState } from 'react';
import { router, usePage, Link } from '@inertiajs/react';
import FlashMessage from '../components/FlashMessage';

const AdminLogin = () => {
  const { adminLoginSlug } = usePage().props;
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    router.post('/submitlog/admin', { ...form, admin_login_slug: adminLoginSlug }, {
      onError: (err) => setErrors(err),
      onFinish: () => setIsLoading(false),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <FlashMessage errors={errors} />
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
        <p className="text-sm text-slate-500 mt-1">Use your admin credentials to continue.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
              placeholder="admin@example.com"
              required
            />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700"
              placeholder="Enter password"
              required
            />
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-slate-800 transition-colors disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Login as Admin'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900">
            Go to user login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
