'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Check your email for the magic link.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Email"
        className="border p-2"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white">
        Send Magic Link
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
