import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context.js";
import { useMemo } from "react";

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const reauth = () => {
        return fetch("/api/whoami")
            .then(res => res.ok ? res.json() : "noauth")
            .then(setUser);
    };
    
    useEffect(() => { reauth(); }, []);

    const val = useMemo(() => [user, () => { setUser(null); return reauth(); }], [user]);

    return (
        <AuthContext value={val}>
            {children}
        </AuthContext>
    );
}

