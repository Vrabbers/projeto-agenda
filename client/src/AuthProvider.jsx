import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context.js";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("/api/whoami")
            .then(res => res.ok ? res.json() : "noauth")
            .then(setUser);
    }, []);

    return (
        <AuthContext value={user}>
            {children}
        </AuthContext>
    );
}

