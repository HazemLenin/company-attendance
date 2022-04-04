import React, { useState } from 'react';
import { Container, Form, Button, Col, Row, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import Datetime from 'react-datetime';
import { useDispatch } from 'react-redux';
import { add_toast } from '../actions';

function NewEmployee() {
    const [ userId, setUserId ] = useState(null);
    const [ userCreated, setUserCreated ] = useState(null);
    const [ errors, setErrors ] = useState(null);
    const [ employee, setEmployee ] = useState({role: "employees"}); // role is the only field that has initial value
    const [ loading, setLoading ] = useState(false);
    const [ validated, setValidated ] = useState(false);
    const api = useAxios();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleUserSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        api.post('/api/v1/users/', employee)
        .then(response => {
            setUserId(response.data.id);
            setUserCreated(true);
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
            setErrors(err.response?.data);
            dispatch(add_toast({
                page: "New Employee",
                content: "Something went wrong.",
                bg: "danger",
            }));
        });
    }

    function handleProfileSubmit(e) {
        e.preventDefault();
        setLoading(true);
        api.post('/api/v1/profiles/', {...employee?.profile, user: userId})
        .then(response => {
            setLoading(false);
            setValidated(true);
            dispatch(add_toast({
                page: "New Employee",
                content: `${employee.first_name} ${employee.last_name} has been added successfully.`,
                bg: "success",
            }));
            navigate(`/employees/${response.data.user}`);
        })
        .catch(err => {
            setLoading(false);
            setErrors(err.response?.data);
            dispatch(add_toast({
                page: "New Employee",
                content: "Something went wrong.",
                bg: "danger",
            }));
        });
    }

    return (
        <Container>
            <h1>New Employee</h1>
            <p className="text-danger">{errors?.detail}</p>
            {userCreated ? (
                <Form onSubmit={handleProfileSubmit} noValidate validated={validated}>
                    <Form.Group className="mb-2">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" name="address" placeholder="Address" isInvalid={Boolean(errors?.address)} onChange={e => setEmployee({...employee, profile: {...employee.profile, address: e.target.value}})} required />
                        <Form.Control.Feedback type="invalid">{errors?.address}</Form.Control.Feedback>
                    </Form.Group>
                    <Row className="mb-2">
                        <Form.Group as={Col}>
                            <Form.Label>Birth Date</Form.Label>
                            <Datetime name="birth_date" dateFormat="YYYY-MM-DD" timeFormat="" onChange={e => setEmployee({...employee, profile: {...employee.profile, birth_date: e.format("YYYY-MM-DD")}})} required />
                            {errors?.birth_date && <p className="text-danger">{errors?.birth_date}</p>}
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="text" name="phone" placeholder="Phone Number" isInvalid={Boolean(errors?.phone)} onChange={e => setEmployee({...employee, profile: {...employee.profile, phone: e.target.value}})} required />
                            <Form.Control.Feedback type="invalid">{errors?.phone}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Button type="submit">
                        Submit
                        {loading && <Spinner animation="border" size="sm" />}
                    </Button>
                </Form>
                
            ) : (
                <Form onSubmit={handleUserSubmit} noValidate validated={validated}>
                    <Form.Group className="mb-2">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name="username" placeholder="Username" isInvalid={Boolean(errors?.username)} onChange={e => setEmployee({...employee, username: e.target.value})} required />
                        <Form.Control.Feedback type="invalid">{errors?.username}</Form.Control.Feedback>
                    </Form.Group>
                    <Row className="mb-2">
                        <Form.Group as={Col}>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" name="first_name" placeholder="First Name" isInvalid={Boolean(errors?.first_name)} onChange={e => setEmployee({...employee, first_name: e.target.value})} required />
                            <Form.Control.Feedback type="invalid">{errors?.first_name}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name="last_name" placeholder="Last Name" isInvalid={Boolean(errors?.last_name)} onChange={e => setEmployee({...employee, last_name: e.target.value})} required />
                            <Form.Control.Feedback type="invalid">{errors?.last_name}</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Form.Group className="mb-2">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" placeholder="Email" isInvalid={Boolean(errors?.email)} onChange={e => setEmployee({...employee, email: e.target.value})} required />
                        <Form.Control.Feedback type="invalid">{errors?.email}</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Role</Form.Label>
                        <Form.Select name="role" isInvalid={Boolean(errors?.role)} value="employees" onChange={e => setEmployee({...employee, role: e.target.value})} required>
                            <option key={1} value="managers">Manager</option>
                            <option key={2} value="receptionists">Receptionist</option>
                            <option key={3} value="employees">Employee</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors?.role}</Form.Control.Feedback>
                    </Form.Group>
                    <Button type="submit">
                        Submit
                        {loading && <Spinner animation="border" size="sm" />}
                    </Button>
                </Form>
            )}
        </Container>
    )
}

export default NewEmployee;