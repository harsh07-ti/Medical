import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isForgotPassword) {
        if (!email) throw new Error("Please enter your email.");
        await sendPasswordResetEmail(auth, email);
        setMessage('Password reset email sent. Check your inbox.');
      } else if (isLogin) {
        if (!email || !password) throw new Error("Please fill all fields.");
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else {
        if (!name || !email || !password || !address) throw new Error("Please fill all fields.");
        if (password !== confirmPassword) throw new Error("Passwords do not match.");
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Save user to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          address,
        });
        
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {isForgotPassword ? 'Reset Password' : isLogin ? 'Sign in to your account' : 'Create an account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleAuth}>
          {!isLogin && !isForgotPassword && (
            <div>
              <label className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
              <div className="mt-2">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
            <div className="mt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                {isLogin && (
                  <div className="text-sm">
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="font-semibold text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          )}

          {!isLogin && !isForgotPassword && (
            <>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
                <div className="mt-2">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">Delivery Address</label>
                <div className="mt-2">
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          {message && <p className="text-sm text-green-600 font-medium">{message}</p>}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign in' : 'Sign up')}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          {isForgotPassword ? (
            <button onClick={() => setIsForgotPassword(false)} className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
              Back to login
            </button>
          ) : isLogin ? (
            <>
              Not a member?{' '}
              <button onClick={() => setIsLogin(false)} className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                Register now
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setIsLogin(true)} className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
