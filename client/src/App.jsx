import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import RegistrarPage from './pages/RegistrarPage.jsx';
import TopBarLayout from './TopBarLayout.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import HomePage from './pages/HomePage.jsx';
import AuthProvider from './AuthProvider.jsx';
import CriarEventoPage from './pages/CriarEventoPage.jsx';
import EventoPage from './pages/EventoPage.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        ErrorBoundary: ErrorPage,
        children: [
            {
                element: <TopBarLayout />,
                children: [
                    { path: "", index: true, element: <HomePage /> },
                    { path: "criar-evento", element: <CriarEventoPage /> },
                    { path: "evento/:id", children: [
                        { index: true, element: <EventoPage /> },
                        { path: "registrar", element: <p>hi</p> }
                    ] }

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