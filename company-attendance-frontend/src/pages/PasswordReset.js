import React, { useState } from 'react';
import { Container, Form, Button, Spinner } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import useAxios from '../hooks/useAxios';
import { add_toast } from '../actions';

function PasswordReset() {
    const [ email, setEmail ] = useState('');
    const dispatch = useDispatch();
    const [ loading, setLoading ] = useState(false);
    const [ errors, setErrors ] = useState({});
    const [ validated, setValidated ] = useState(false);
    const api = useAxios({includeTokens: false});

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        api.post('/api/password_reset/', {email: email})
        .then(response => {
            setLoading(false);
            setValidated(true);
            dispatch(add_toast({
                page: "Password Reset",
                content: "An email has been sent to the address provided.",
                bg: "success"
            }));
        })
        .catch(err => {
            setErrors(err.response?.data);
            setLoading(false);
            setValidated(true);
            dispatch(add_toast({
                page: "Password Reset",
                content: "Something went wrong.",
                bg: "danger"
            }));
        })

    }

    return (
        <Container>
            <h1>Password Reset</h1>
            <p className="text-danger">{errors?.detail}</p>
            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
                    <Form.Control.Feedback type="invalid">{errors?.email}</Form.Control.Feedback>
                    <Form.Control.Feedback>Email with link has been sent to your email.</Form.Control.Feedback>
                </Form.Group>
                <Button type="submit">
                    Submit
                    {loading && <Spinner animation="border" size="sm" />}
                </Button>
            </Form>
        </Container>
    )
}

export default PasswordReset