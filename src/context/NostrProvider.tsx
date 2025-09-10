import React, { createContext, useContext, useState, useEffect } from 'react';
import NDK, { NDKNip07Signer, NDKUser, NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';

interface NostrContextType {
    ndk: NDK;
    login: () => Promise<void>;
    user: NDKUser | null;
    tempSigner: NDKPrivateKeySigner;
}

const NDKContext = createContext<NostrContextType | null>(null);

export const NostrProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<NDKUser | null>(null);
    const [ndk] = useState(() => new NDK({
        explicitRelayUrls: ['wss://relay.damus.io', 'wss://relay.primal.net'],
    }));
    
    // Create a temporary signer for anonymous actions like proximity pings
    const [tempSigner] = useState(() => {
        const tempPrivateKey = NDKPrivateKeySigner.generate();
        return tempPrivateKey;
    });

    useEffect(() => {
        ndk.connect();
    }, [ndk]);

    const login = async () => {
        if (window.nostr) {
            try {
                const nip07Signer = new NDKNip07Signer();
                ndk.signer = nip07Signer;
                const user = await nip07Signer.user();
                setUser(user);
            } catch (e) {
                console.error("Failed to get NIP-07 signer", e);
            }
        } else {
            alert("Nostr extension not found!");
        }
    };

    return (
        <NDKContext.Provider value={{ ndk, login, user, tempSigner }}>
            {children}
        </NDKContext.Provider>
    );
};

export const useNDK = () => {
    const context = useContext(NDKContext);
    if (!context) throw new Error('useNDK must be used within a NostrProvider');
    return context;
};
