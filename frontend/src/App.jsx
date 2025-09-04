import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({ email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading,setLoading]=useState(false)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}`, formData);
      setMessage(response.data.message);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Try again.");
      }
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-black to-gray-700 h-screen flex items-center justify-center flex-col">
      <h1 className="mb-4 text-2xl font-bold text-white">Vitraga Assignment</h1>

      <form
        onSubmit={handleSubmit}
        className="border flex flex-col gap-4 p-5 w-80 rounded-xl bg-white shadow"
      >
        <label className="flex flex-col gap-1">
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className={`rounded px-4 py-2 text-white transition 
            ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading?"Submitting...":"Submit"}
        </button>
      </form>
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}

export default App;
