import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { login_user, set_tokens, add_toast } from '../actions';
import useAxios from '../hooks/useAxios';

function Login() {
    const isAuthenticated = useSelector(state => state.isAuthenticated);
    const dispatch = useDispatch();

    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');

    const [ validated, setValidated ] = useState(false);

    const [ errors, setErrors ] = useState({});
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate();
    const api = useAxios({includeTokens: false});

    function handleSubmit(e) {
        e.preventDefault();

        setErrors({});

        setLoading(true);

        api.post('/api/token/', {
            username: username,
            password: password
        })
        .then(response => {
            setLoading(false);
            dispatch(set_tokens(response.data));
            dispatch(login_user()); // And the user will be loaded because of changing the isAuthenticated state
            dispatch(add_toast({
                page: "Login",
                content: `Welcome ${username}!`,
                bg: "success",
                text: "text-white"
            }))
            navigate('/');
        })
        .catch(err => {
            setErrors(err.response?.data);
            setLoading(false);
            setValidated(true);
            dispatch(add_toast({
                page: "Login",
                content: `Something went wrong.`,
                bg: "danger",
                text: "text-white"
            }));
        })
    }
    return (
        <Container>
            <h1>Login</h1>
            <p className="text-danger">{ errors?.detail }</p>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username" placeholder="Username" isInvalid={Boolean(errors?.username)} onChange={ e => setUsername(e.target.value)} required/>
                    <Form.Control.Feedback type="invalid">{ errors?.username }</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Password" isInvalid={Boolean(errors?.password)} onChange={ e => setPassword(e.target.value)} required/>
                    <Form.Control.Feedback type="invalid">{ errors?.password }</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Button type="submit">
                        Login
                        {loading && <Spinner animation="border" size="sm" />}
                    </Button>
                </Form.Group>
            </Form>
            <Link to="/password_reset">Forgot password?</Link>
        </Container>
    )
}

export default Login;