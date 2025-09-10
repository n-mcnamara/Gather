import { useNDK } from '../context/NostrProvider';

export function LoginButton() {
    const { login, user } = useNDK();

    if (user) {
        return <div>Logged in as {user.npub}</div>;
    }

    return <button onClick={login}>Login with Nostr Extension</button>;
}
