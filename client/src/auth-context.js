import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function isAuth(auth) {
    return auth && auth !== "noauth";
}

export function isNotAuth(auth) {
    return auth && auth === "noauth";
}

export function isLoading(auth) {
    return auth === null;
}
