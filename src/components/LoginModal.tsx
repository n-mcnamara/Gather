import { useState } from 'react';
import Modal from './Modal';
import { useNDK } from '../context/NostrProvider';
import { NDKNip46Signer } from '@nostr-dev-kit/ndk';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, loginWithNsec, setSigner } = useNDK();
  const [showNsec, setShowNsec] = useState(false);
  const [nsec, setNsec] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [bunkerUrl, setBunkerUrl] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleNsecLogin = () => {
    if (nsec.startsWith('nsec')) {
      try {
        loginWithNsec(nsec);
        onClose();
      } catch (e) {
        setError('Invalid nsec key. Please check and try again.');
      }
    } else {
      setError('Key must start with "nsec".');
    }
  };

  const handleNip46Login = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      // Use ndk instance from context to create the signer
      const { ndk } = useNDK();
      const nip46Signer = new NDKNip46Signer(ndk);
      setSigner(nip46Signer);
      
      nip46Signer.on('authUrl', (url) => {
        setBunkerUrl(url);
      });

      await nip46Signer.blockUntilReady();
      onClose();

    } catch (e) {
      console.error("NIP-46 connection error", e);
      setError('Failed to connect with the signer app. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleExtensionLogin = async () => {
    await login();
    onClose();
  };

  const hasExtension = !!window.nostr;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <div className="flex flex-col space-y-4">
          {hasExtension && (
            <button
              onClick={handleExtensionLogin}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
            >
              Login with Extension (Recommended)
            </button>
          )}

          {!hasExtension && (
            <div className="text-center">
              <p className="mb-2">Connect with a mobile signer:</p>
              {bunkerUrl ? (
                <>
                  <a href={`nostrconnect://${bunkerUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 break-all">{`nostrconnect://${bunkerUrl}`}</a>
                  <p className="text-sm text-gray-500 mt-2">Copy this code and paste it into your signer app.</p>
                </>
              ) : (
                <button
                  onClick={handleNip46Login}
                  disabled={isConnecting}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  {isConnecting ? 'Waiting for connection...' : 'Login with Signer App'}
                </button>
              )}
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => setShowNsec(!showNsec)}
              className="text-sm text-gray-500 hover:underline"
            >
              Or use a private key (nsec)
            </button>
          </div>

          {showNsec && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-bold mb-2">Security Warning</p>
              <p className="text-xs text-red-600 mb-4">
                Pasting your private key can be risky. It gives this app full control over your Nostr identity. Only proceed if you understand the risks.
              </p>
              <input
                type="password"
                value={nsec}
                onChange={(e) => setNsec(e.target.value)}
                placeholder="nsec..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={handleNsecLogin}
                className="mt-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700"
              >
                Login with nsec
              </button>
            </div>
          )}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </div>
    </Modal>
  );
}
