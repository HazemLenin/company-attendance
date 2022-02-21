import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { login_user, set_tokens } from '../actions';
import useAxios from '../hooks/useAxios';

function Login() {
    const authTokens = useSelector(state => state.authTokens);
    const dispatch = useDispatch();

    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    const [ validated, setValidated ] = useState(false);

    const [ errors, setErrors ] = useState({ detail: '', username: '', password: '' });
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();
    const api = useAxios({includeTokens: false});

    function handleSubmit(e) {
        e.preventDefault();

        setErrors({ detail: '', username: '', password: '' });

        setLoading(true);

        api.post('/api/token/', {
            username: username,
            password: password
        })
        .then(response => {
            setLoading(false);
            dispatch(login_user()); // And the user will be loaded because of changing the isAuthenticated state
            dispatch(set_tokens(response.data));
            navigate('/');
        })
        .catch(err => {
            setErrors(err.response?.data);
            setLoading(false);
            setValidated(true);
        })
    }
    return (
        <Container>
            <h1>Login</h1>
            <p className="text-danger">{ errors?.detail }</p>
            { authTokens ? 
                <Container><h1>You already logged in</h1></Container>
            :
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-2">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name="username" placeholder="Username" onChange={ e => setUsername(e.target.value)} required/>
                        <Form.Control.Feedback type="invalid">{ errors?.username }</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" placeholder="Password" onChange={ e => setPassword(e.target.value)} required/>
                        <Form.Control.Feedback type="invalid">{ errors?.password }</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group>
                        <Button type="submit">
                            Login
                            {loading && <Spinner animation="border" size="sm" /> }
                        </Button>
                    </Form.Group>    
                </Form>
            }
        </Container>
    )
}

export default Login;