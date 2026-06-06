import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Login } from './Login';

// 1. Define your page components
function Home() {
    const [backendData, setBackendData] = useState('');

    useEffect(() => {
        fetch('/api/whoami')
            .then(res => res.ok ? res.json() : 'not here')
            .then(data => setBackendData(JSON.stringify(data)));
    }, []);

    return (
        <div>
            <h2>Home Page</h2>
            <p>Data from Express: {backendData || "Loading..."}</p>
            <nav>
                <Link to="/about">Go to About Page</Link>
            </nav>
        </div>
    );
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />
    }
]);

export default function App() {
    return (<RouterProvider router={router} />);
}