import React, { useState } from 'react';
import { createUser } from '../lib/api';

export default function AdminPanel() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' as 'admin' | 'teacher' | 'student',
    fullName: ''
  });

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setMessage({ type: 'success', text: 'User created successfully!' });
      setFormData({
        email: '',
        password: '',
        role: 'student',
        fullName: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error creating user. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create New User</h2>

        {message && (
          <div
            className={`p-4 mb-6 rounded-lg border text-center ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full rounded-xl border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full rounded-xl border border-gray-300 p-2 shadow-sm focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black shadow"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
}
