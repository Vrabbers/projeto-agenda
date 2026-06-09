import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context.js";
import { useMemo } from "react";

export function AuthProvider({ children }) {
    const [key, setKey] = useState(new Object());
    const incrKey = () => { setKey(() => new Object()) };
    
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        fetch("/api/whoami")
            .then(res => res.ok ? res.json() : "noauth")
            .then(setUser);
    }, [key]);

    const val = useMemo(() => [user, incrKey], [user]);

    return (
        <AuthContext value={val}>
            {children}
        </AuthContext>
    );
}

