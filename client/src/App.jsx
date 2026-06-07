import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LoginPage } from './LoginPage.jsx';
import { RegistrarPage } from './RegistrarPage.jsx';
import { TopBarLayout } from './TopBarLayout.jsx';
import { ErrorPage } from './ErrorPage.jsx';
import { HomePage } from './HomePage.jsx';


const router = createBrowserRouter([
    {
        path: "/",
        ErrorBoundary: ErrorPage,
        children: [
            {
                element: <TopBarLayout />,
                children: [
                    { index: true, element: <HomePage /> },
                ]
            },
            { path: "login", element: <LoginPage /> },
            { path: "registrar", element: <RegistrarPage /> }
        ]
    }
]);

export default function App() {
    return (<RouterProvider router={router} />);
}