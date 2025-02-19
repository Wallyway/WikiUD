import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, provider } from './Firebase'

const Login = () => {
    const handleLogin = async() => {
        const loginResponse = await signInWithPopup(auth, provider)
        const user = loginResponse.user
        const userData = {
            name: user.displayName,
            email: user.email,
            avatar: user.photoURL,
        }
        console.log(loginResponse)
    }
  return (
    
    <div>
        <h1>Microsoft Login</h1>
        <button onClick={handleLogin}>Login</button>
    </div>
  )
}

export default Login