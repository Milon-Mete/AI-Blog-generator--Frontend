import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Email and password are required');
      return;
    }

    const payload = { email: trimmedEmail, password: trimmedPassword };
    console.log('Sending login payload:', payload);

    try {
      const response = await axios.post('https://ai-blog-generator-backend-txka.onrender.com/login', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Login response:', response.data);

      if (response.status === 200) {
        const { token, credits } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('credits', credits);
        alert('Login successful');
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    }
  };

  return (
    <div
      className="h-screen text-white p-8 bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url('/assets/Copilot_20250726_105334.png')" }}
    >
      <div className="flex items-end md:mx-48 text-white">
        <img src="/assets/Copilot_20250726_105948.png" alt="Blog Generator Logo" className="w-20 h-20 mr-4" />
        <Link to="/" className="text-3xl font-bold mb-2 w-2">Blog Generator</Link>
      </div>

      <div className="my-6 md:mx-48 bg-[#5859b1] bg-opacity-10 backdrop-blur-md border border-[blue] rounded-lg shadow p-6 h-full text-white text-center flex flex-col justify-center items-center font-[Poppins]">
        <h2 className="text-4xl font-bold mb-1">Login To Your Account</h2>
        <p className="text-lg mb-6 text-[#ccc9c9]">Start Generating Content With AI</p>

        <form className="w-full max-w-sm" onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm mb-2 text-start" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-blue-500 bg-transparent rounded-lg focus:outline-none focus:border-blue-700"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2 text-start" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-blue-500 bg-transparent rounded-lg focus:outline-none focus:border-blue-700"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-300 bg-opacity-10 border border-blue-700 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
          >
            Login
          </button>

          <h1 className="mt-1 text-end text-sm text-[#c7c4c4] cursor-pointer hover:text-blue-400">
            Forgot Password
          </h1>
        </form>

        <div className="mt-4 text-sm">
          <h1>
            Don't Have An Account?{' '}
            <Link className="text-blue-500 text-lg" to="/signup">
              Sign Up
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
}