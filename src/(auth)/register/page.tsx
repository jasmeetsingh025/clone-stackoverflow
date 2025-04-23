'use client';
import { useAuthStore } from '@/store/Auth';
import React, { useState } from 'react';

function RegisterPage() {
  const { createAccount, login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Collect data
    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    //Validations
    if (!firstName || !lastName || !email || !password) {
      setError(() => 'All fields are required');
    }
    setLoading(true);
    setError(() => '');

    try {
      const response = await createAccount(
        email,
        password,
        `${firstName} ${lastName}`
      );
      if (response.error) {
        setError(() => response.error!.message);
      } else {
        const loginResponse = await login(email, password);
        if (loginResponse.error) {
          setError(() => loginResponse.error!.message);
        }
      }
    } catch (err) {
      setError(() => 'Failed to create account');
    } finally {
      setLoading(() => false);
    }
  };

  return (
    <div>
      {error && <div className="alert alert-error shadow-lg">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input name="firstName" type="text" placeholder="First Name" required />
        <input name="lastName" type="text" placeholder="Last Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
