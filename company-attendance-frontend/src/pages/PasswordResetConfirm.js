import React, { useState } from 'react';
import { Container, Button, Form, Spinner } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import { useDispatch } from 'react-redux';
import { add_toast } from '../actions';

function PasswordResetConfirm() {
    const [ errors, setErrors ] = useState({});
    const [ validated, setValidated ] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    const [ searchParams ] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const api = useAxios({includeTokens: false});

    function handleSubmit(e) {
        e.preventDefault();
        setErrors({});
        setLoading(true);
        setValidated(true);

        if (password !== confirmPassword) {
            setErrors({confirmPassword: "Passwords do not match."});
            dispatch(add_toast({
                page: "Password Reset Confirm",
                content: "Something went wrong.",
                bg: "danger"
            }));
            return;
        }

        api.post('/api/v1/password_reset/confirm/', {token: searchParams.get('token'), password: password})
        .then(response => {
            setLoading(false);
            setValidated(true);
            dispatch(add_toast({
                page: "Password Reset Confirm",
                content: "Password has been updated successfully.",
                bg: "success"
            }));
            navigate('/login');
        })
        .catch(err => {
            setLoading(false);
            setErrors(err.response?.data);
            setValidated(true);
            dispatch(add_toast({
                page: "Password Reset Confirm",
                content: "Something went wrong.",
                bg: "danger"
            }));
        })
    }
    return (
        <Container>
            <h1>Password Reset Confirm</h1>
            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group className="mb-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
                    <Form.Control.Feedback type="invalid">{errors?.password}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} required />
                    <Form.Control.Feedback type="invalid">{errors?.confirmPassword}</Form.Control.Feedback>
                </Form.Group>
                <Button type="submit">
                    Submit
                    {loading && <Spinner animation="border" size="sm" />}
                </Button>
            </Form>
        </Container>
    )
}

export default PasswordResetConfirm