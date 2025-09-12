import { useState } from 'react';
import { useNDK } from '../context/NostrProvider';
import { LogIn, LogOut } from 'lucide-react';
import LoginModal from './LoginModal';

export function LoginButton() {
  const { user, ndk, logout } = useNDK();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginClick = () => {
    if (user) {
      logout();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleLoginClick}
        className="p-2 bg-white rounded-md shadow-md hover:bg-gray-100 flex items-center space-x-2"
      >
        {user ? <LogOut size={18} /> : <LogIn size={18} />}
        <span className="text-sm">{user ? 'Logout' : 'Login'}</span>
      </button>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}