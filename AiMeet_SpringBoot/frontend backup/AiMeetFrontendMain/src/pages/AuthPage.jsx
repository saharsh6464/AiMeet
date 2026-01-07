import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterUser, LoginUser } from '../service/UserApi';
import { Lock, Mail, UserRound, Eye, EyeOff, Loader2 } from 'lucide-react';

// Auth page styled to match the Dashboard palette
// Light: bg-gray-50, text-gray-800, cards white/gray-200 borders, primary blue-600
// Dark:  bg-gray-900, text-white, cards gray-800/gray-700 borders, primary blue-600

const AuthPage = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const payload = { username: loginEmail, password: loginPassword };
      const user = await LoginUser(payload);
      // Persist user and perform a full navigation so the top-level App
      // re-reads localStorage and renders the dashboard route.
      localStorage.setItem('user', JSON.stringify(user));
      window.location.replace('/dashboard');
    } catch (error) {
      setMessage(error?.message || 'Login failed. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (regPassword !== regConfirmPassword) {
      setMessage('Passwords do not match!');
      setLoading(false);
      return;
    }

    const userData = { username: regUsername, name: regName, password: regPassword };

    try {
      const response = await RegisterUser(userData);
      setMessage(response?.message || 'Registration successful! Please log in.');
      setRegName('');
      setRegUsername('');
      setRegPassword('');
      setRegConfirmPassword('');
      setIsLogin(true);
    } catch (error) {
      setMessage(error?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = [
    'w-full rounded-lg',
    'border border-gray-300 bg-white text-gray-900',
    'dark:border-gray-700 dark:bg-gray-900 dark:text-white',
    'placeholder:text-gray-400 dark:placeholder:text-gray-500',
    'px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
  ].join(' ');

  const labelCls = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2';
  const primaryBtnCls = [
    'w-full inline-flex items-center justify-center gap-2 rounded-lg',
    'bg-blue-600 text-white hover:bg-blue-700',
    'focus:outline-none focus:ring-2 focus:ring-blue-500',
    'disabled:opacity-70 px-4 py-3 text-sm font-semibold'
  ].join(' ');

  const tabBase = 'w-1/2 py-3 text-sm sm:text-base transition rounded-t-lg';
  const tabActive = 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400 font-semibold';
  const tabInactive = 'text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wider text-blue-600">
            AI<span className='font-light text-gray-800 dark:text-white'>MEET</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Secure sign in to manage meetings and summaries</p>
        </div>

        {/* Tabs */}
        <div className="flex px-8 border-b border-gray-200 dark:border-gray-700 text-center">
          <button
            className={`${tabBase} ${isLogin ? tabActive : tabInactive}`}
            onClick={() => { setIsLogin(true); setMessage(''); }}
          >
            Sign In
          </button>
          <button
            className={`${tabBase} ${!isLogin ? tabActive : tabInactive}`}
            onClick={() => { setIsLogin(false); setMessage(''); }}
          >
            Register
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          <h2 className="text-lg text-gray-700 dark:text-gray-300 mb-6 text-center">
            {isLogin ? 'Enter your credentials to continue' : 'Create your account'}
          </h2>

          {message && (
            <div
              className={`mb-6 rounded-lg border px-4 py-3 text-sm text-center ${
                message.toLowerCase().includes('successful') || message.toLowerCase().includes('success')
                  ? 'border-green-300 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/30 dark:text-green-300'
                  : 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-600 dark:bg-rose-900/30 dark:text-rose-300'
              }`}
            >
              {message}
            </div>
          )}

          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {/* Username/Email */}
              <div>
                <label htmlFor="login-email" className={labelCls}>Email or Username</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    id="login-email"
                    className={`${inputCls} pl-9`}
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="username or email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className={labelCls}>Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    id="login-password"
                    className={`${inputCls} pl-9 pr-10`}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className={primaryBtnCls}>
                {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Signing In...</>) : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              {/* Full name */}
              <div>
                <label htmlFor="reg-name" className={labelCls}>Full Name</label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    id="reg-name"
                    className={`${inputCls} pl-9`}
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="reg-username" className={labelCls}>Username</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    id="reg-username"
                    className={`${inputCls} pl-9`}
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="johndoe123"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="reg-password" className={labelCls}>Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    id="reg-password"
                    className={`${inputCls} pl-9 pr-10`}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="reg-confirm-password" className={labelCls}>Confirm Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <input
                    type={showRegConfirm ? 'text' : 'password'}
                    id="reg-confirm-password"
                    className={`${inputCls} pl-9 pr-10`}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirm((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                    aria-label={showRegConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showRegConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className={primaryBtnCls}>
                {loading ? (<><Loader2 className="h-4 w-4 animate-spin" /> Registering...</>) : 'Register Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;