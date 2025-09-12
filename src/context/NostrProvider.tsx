import React, { createContext, useContext, useState, useEffect } from 'react';
import NDK, { NDKNip07Signer, NDKUser, NDKPrivateKeySigner, NDKNip46Signer } from '@nostr-dev-kit/ndk';

// A generic signer interface that covers the methods we need
interface GenericSigner {
    user(): Promise<NDKUser>;
}

interface NostrContextType {
    ndk: NDK;
    login: () => Promise<void>;
    loginWithNsec: (nsec: string) => void;
    logout: () => void;
    user: NDKUser | null;
    tempSigner: NDKPrivateKeySigner;
    setSigner: (signer: GenericSigner) => void;
}

const NDKContext = createContext<NostrContextType | null>(null);

export const NostrProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<NDKUser | null>(null);
    const [ndk] = useState(() => new NDK({
        explicitRelayUrls: ['wss://relay.damus.io', 'wss://relay.primal.net', 'wss://nos.lol'],
    }));
    
    const [tempSigner] = useState(() => {
        const tempPrivateKey = NDKPrivateKeySigner.generate();
        return tempPrivateKey;
    });

    useEffect(() => {
        ndk.connect();
    }, [ndk]);

    const setSigner = async (signer: GenericSigner) => {
        ndk.signer = signer as any; // Cast to any to assign to ndk.signer
        const user = await signer.user();
        setUser(user);
    };

    const login = async () => {
        if (window.nostr) {
            try {
                const nip07Signer = new NDKNip07Signer();
                await setSigner(nip07Signer);
            } catch (e) {
                console.error("Failed to get NIP-07 signer", e);
            }
        } else {
            console.log("Nostr extension not found, modal should open.");
        }
    };

    const loginWithNsec = (nsec: string) => {
        const privateKeySigner = new NDKPrivateKeySigner(nsec);
        setSigner(privateKeySigner);
    };

    const logout = () => {
        ndk.signer = undefined;
        setUser(null);
    };

    return (
        <NDKContext.Provider value={{ ndk, login, loginWithNsec, logout, user, tempSigner, setSigner }}>
            {children}
        </NDKContext.Provider>
    );
};

export const useNDK = () => {
    const context = useContext(NDKContext);
    if (!context) throw new Error('useNDK must be used within a NostrProvider');
    return context;
};