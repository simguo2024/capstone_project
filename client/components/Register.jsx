import *  as React from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
    const [matchingPasswords, setMatchingPasswords] = React.useState(false)
    const usernameInput = React.useRef(null)
    const passwordInput = React.useRef(null)
    const retypePasswordInput = React.useRef(null)
    const { username } = useOutletContext()
    const navigate = useNavigate()

    function handlePasswordOnChange() {
        setMatchingPasswords(passwordInput.current.value == retypePasswordInput.current.value)
    }

    const register = (username, password) => {
        axios.post('/api/register', { username, password })
            .then(() => {
                window.alert('User registered successfully, proceed to Log In.')
                navigate('/Login')
            })
            .catch(error => {
                window.alert('Registration failed. Please contact System Admin.')
            })
    }
    
    function handleRegister(event) {
        event.preventDefault()
        const username = usernameInput.current.value
        const password = passwordInput.current.value
        const retypePassword = retypePasswordInput.current.value
        if (password == retypePassword) {
            register(username, password)
            return
        }
        window.alert('Passwords do not match, please re-enter passwords.')
    }

    return (username ?
        <Navigate to='/List' />
        :
        <>
            <form
                onSubmit={handleRegister}
                style={{
                    textAlign: 'right',
                    marginTop: '50px',
                    width: 'max-content',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    paddingTop:'20px'
                }}
            >
                <div>
                    <TextField label='Username' inputRef={usernameInput} />
                </div>
                <div>
                    <TextField label='Password' onChange={handlePasswordOnChange} inputRef={passwordInput} />
                </div>
                <div>
                    <TextField label='Retype Password' onChange={handlePasswordOnChange} inputRef={retypePasswordInput} />
                </div>
                {!matchingPasswords ? <div style={{ color: 'red' }}>Passwords do not match</div> : <></>}
                <Button type='submit' variant='contained'>Register</Button>
            </form >
        </>
    )
}