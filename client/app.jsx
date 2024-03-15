import *  as React from 'react'
import { createRoot } from 'react-dom/client'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Navigate, Outlet, RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom'
import Login from './components/Login'
import List from './components/List'
import Register from './components/Register'
import Button from '@mui/material/Button'
import Favorites from './components/Favorites'
import MyCollections from './components/MyCollections'
import { Link as RouterLink } from 'react-router-dom';

function App() {
    const [username, setUsername] = React.useState(localStorage.getItem('username'));
    const navigate = useNavigate();
    
    const logout = () => {
        setUsername(null);
        localStorage.removeItem('username');
        navigate('/Login');
    };

    return (
        <div>
             <AppBar position='fix'color="primary" sx={{ borderRadius: 2, margin: 'auto', maxWidth: 1000, marginTop: 2 }}>
                <Toolbar>
                    <div style={{ flexGrow: 1 }}>
                        <Button color='inherit' component={RouterLink} to='/'><Typography variant="h6">Moive Zone</Typography></Button>
                    </div>
                    {username ? (
                        <>
                            <Button color='inherit' component={RouterLink} to='/List' style={{ fontSize: '1.1rem' }}>List</Button>
                            <Button color='inherit' component={RouterLink} to='/Favorites' style={{ fontSize: '1.1rem' }}>Favorites Ranking</Button>
                            <Button color='inherit' component={RouterLink} to='/MyCollections' style={{ fontSize: '1.1rem' }}>My Collections</Button>
                            <Button color='inherit' onClick={logout} style={{ fontSize: '1.1rem' }}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button color='inherit' component={RouterLink} to='/Login'  style={{ fontSize: '1.1rem' }}>Login</Button>
                            <Button color='inherit' component={RouterLink} to='/Register' style={{ fontSize: '1.1rem' }}>Register</Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Outlet context={{ username, setUsername }} />
            </div>
        </div>
    );
}

export default App;

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/List',
                element: <List />,
            },
            {
                path: '/Register',
                element: <Register />,
            },
            {
                path: '/Login',
                element: <Login />,
            },
            {
                path: '/MyCollections',
                element: <MyCollections />,
            },
            {
                path: '/Favorites',
                element: <Favorites />,
            },
            {
                index: true,
                element: <Navigate to='/List' />,
            },
            {
                path: '*',
                element: <Navigate to='/List' />,
            }
        ]
    }
])

createRoot(document.querySelector('#root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);