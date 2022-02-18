import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { login_user } from '../actions';
import { setup_user_and_profile } from '../services';

function Login() {
    const isAuthenticated = useSelector(state => state.isAuthenticated);
    const dispatch = useDispatch();
    const username = useRef();
    const password = useRef();
    const [ Err, setErr ] = useState('');
    const [ usernameErr, setUsernameErr ] = useState('');
    const [ passwordErr, setPasswordErr ] = useState('');
    const [ loading, setLoading ] = useState(false);
    const navigate = useNavigate()

    function SubmitData(e) {
        e.preventDefault();
        setErr('');
        setUsernameErr('');
        setPasswordErr('');
        setLoading(true);
        axios.post('api/token/', {
            username: username.current.value,
            password: password.current.value
        })
        .then(response => {
            setLoading(false);
            const data = response.data;
            dispatch(login_user(data));
            navigate('/');
        })
        .catch(err => {
            try{
                if (err.response.data.username) setUsernameErr(err.response.data.username);
                else if (err.response.data.password) setPasswordErr(err.response.data.password);
                else setErr(err.response.data.detail);
            } catch {
                setErr('Error happend!');
            }
            setLoading(false);
        })
    }
    return (
        <Container>
            <h1>Login</h1>
            { Err && <p className="text-danger">{ Err }</p> }
            { isAuthenticated ? 
                <Container><h1>You already logged in</h1></Container>
            :
                <Form onSubmit={SubmitData}>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control ref={username} name="username" required/>
                        { usernameErr && <p className="text-danger">{ usernameErr }</p> }
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control ref={password} name="password" type="password" required/>
                        { passwordErr && <p className="text-danger">{ passwordErr }</p> }
                    </Form.Group>
                    <Form.Group>
                        <Button type="submit" className="mt-3">
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