import { useState } from 'react';
import LoginPage from '../LoginPage';
import RegisterPage from '../RegisterPage';

function Auth() {
    const {estados, setEstados} = useState(false);

    return (
        <>
            {
                estados ? <LoginPage setEstados={setEstados} /> : <RegisterPage setEstados={setEstados} />
            }
        </>
    );
}

export default Auth;