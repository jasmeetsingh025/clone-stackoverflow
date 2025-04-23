'use client';
import { useAuthStore } from '@/store/Auth';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

function LoginPage() {
  const { login } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Collect data
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    //Validations
    if (!email || !password) {
      setError(() => 'All fields are required');
      return;
    }
    setLoading(true);
    setError(() => null);

    try {
      const response = await login(email, password);
      if (response.error) {
        setError(() => response.error!.message);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(() => 'Failed to login');
    } finally {
      setLoading(() => false);
    }
  };
  return (
    <div>
      {error && <div className="alert alert-error shadow-lg">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
export default LoginPage;
