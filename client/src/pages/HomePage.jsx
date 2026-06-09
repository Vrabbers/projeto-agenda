import { } from "react-router-dom";
import { isAuth, useAuth } from "../auth-context";

export function HomePage() {
    const [auth] = useAuth();

    if (isAuth(auth)) {
        return JSON.stringify(auth);
    } 
}
