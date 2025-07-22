import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:10000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-80" onSubmit={loginUser}>
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <input className="w-full border p-2 mb-3" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full border p-2 mb-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700">Login</button>
      </form>
      
    </div>
  );
}

export default Login;
