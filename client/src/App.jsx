import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegistrarPage from './pages/RegistrarPage.jsx';
import TopBarLayout from './TopBarLayout.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AuthProvider from './AuthProvider.jsx';
import CriarEvento from './pages/CriarEvento.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        ErrorBoundary: ErrorPage,
        children: [
            {
                element: <TopBarLayout />,
                children: [
                    { index: true, element: <HomePage /> },
                    { path: "criar-evento", element: <CriarEvento /> }

                ]
            },
            { path: "login", element: <LoginPage /> },
            { path: "registrar", element: <RegistrarPage /> },
        ]
    }
]);

export default function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}