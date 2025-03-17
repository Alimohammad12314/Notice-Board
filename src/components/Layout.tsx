import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo and Title */}
            <Link to="/" className="flex items-center min-w-0">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStAHK8K8f55Dhvs1KytLbJqGZhrQnNjwrSnA&s"
                alt="ZHCET Logo"
                className="h-8 sm:h-10 w-auto"
              />
              <span className="ml-2 text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate max-w-[150px] sm:max-w-none">
                ZHCET Notice Board
              </span>
            </Link>

            {/* User Info + Links */}
            <div className="flex items-center space-x-3 sm:space-x-4 text-sm sm:text-base">
              {user?.full_name && (
                <span className="text-gray-700 truncate max-w-[100px] sm:max-w-none">
                  {user.full_name} ({user.role})
                </span>
              )}

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-1 sm:py-2 rounded-md font-medium"
                >
                  Admin Panel
                </Link>
              )}

              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-700 hover:text-gray-900 px-2 sm:px-3 py-1 sm:py-2 rounded-md font-medium"
              >
                <LogOut className="h-4 w-4 mr-1 sm:mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
