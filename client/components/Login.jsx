import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Link, Navigate, useNavigate, useOutletContext } from 'react-router-dom';

export default function Login() {
    const { setUsername } = useOutletContext();
    const usernameInput = useRef(null);
    const passwordInput = useRef(null);
    const [loginError, setLoginError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
            setIsLoggedIn(true);
        }
    }, [setUsername]);

    const login = (username, password) => {
        axios.post('/api/login', { username, password })
            .then(() => {
                localStorage.setItem('username', username);
                setLoginError('');
                setUsername(username);
                setIsLoggedIn(true);
                navigate('/List');
            })
            .catch(error => {
                if (error.response && error.response.status === 401) setLoginError('Login Failed: Incorrect Credentials.');
                else setLoginError('Login Failed: Unknown Error.');
            });
    };

    function handleLoginSubmit(event) {
        event.preventDefault();
        login(usernameInput.current.value, passwordInput.current.value);
    }

    return (isLoggedIn ?
        <Navigate to='/List' />
        :
        <>
            <form
                onSubmit={handleLoginSubmit}
                style={{
                    textAlign: 'right',
                    marginTop: '50px',
                    width: 'max-content',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                }}
            >
                <div>
                    <TextField label='Username' inputRef={usernameInput} />
                </div>
                <div>
                    <TextField label='Password' type='password' inputRef={passwordInput} />
                </div>
                {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
                <Button type='submit' variant='contained'>Login</Button>
                <Link to='/Register'>
                    <Button style={{ width: '100%' }} variant='contained'>Register</Button>
                </Link>
            </form>
        </>
    );
}
