import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Col, Row, Spinner } from 'react-bootstrap';
import Datetime from 'react-datetime';
import { useDispatch } from 'react-redux';
import { add_toast } from '../actions';
import useAxios from '../hooks/useAxios';

function EditEmployee() {
    const [ employee, setEmployee ] = useState({});
    const [ errors, setErrors ] = useState({});
    const [ loading, setLoading ] = useState(false);
    const [ loadingUser, setLoadingUser ] = useState(false);
    const [ validated, setValidated ] = useState(false);
    const [ userEdited, setUserEdited ] = useState(null);
    const [ userFound, setUserFound ] = useState(true);
    const api = useAxios();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        api.get(`/api/users/${id}/`)
        .then(response => {
            setEmployee(response.data);
            setLoadingUser(false);
        })
        .catch(err => {
            setErrors(err.response?.data);
            if (err.response.status === 404) {
                setUserFound(false);
            }
            dispatch(add_toast({
                page: "Edit Employee",
                content: "Something went wrong.",
                bg: "danger",
            }));
        })
    }, [])

    function handleUserSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        api.put(`/api/users/${employee.id}/`, employee)
        .then(response => {
            setEmployee(response.data);
            setLoading(false);
            setUserEdited(true);
            console.log(userEdited)
        })
        .catch(err => {
            setLoading(false);
            setErrors(err.response?.data);
            setValidated(true);
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
        api.put(`/api/profiles/${employee.profile.id}/`, employee.profile)
        .then(response => {
            setLoading(false);
            dispatch(add_toast({
                page: "Edit Employee",
                content: `${employee.first_name} ${employee.last_name} has been Updated successfully.`,
                bg: "success",
            }));
            navigate(`/employees/${response.data.user}`);
        })
        .catch(err => {
            setLoading(false);
            setErrors(err.response?.data);
            setValidated(true);
            dispatch(add_toast({
                page: "Edit Employee",
                content: "Something went wrong.",
                bg: "danger",
            }));
        });
    }
    
    return (
        <Container>
            <h1>Edit Employee</h1>
            {loadingUser ? (
                <h1>Loading...</h1>
                ) : (
                    <>
                    {userFound ? (
                        <>
                            <p className="text-danger">{errors?.detail}</p>
                            {userEdited ? (
                                <Form onSubmit={handleProfileSubmit} noValidate validated={validated}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control name="address" type="text" placeholder="Address" defaultValue={employee?.profile?.address} isInvalid={Boolean(errors?.profile?.address)} onChange={e => setEmployee({...employee, profile: {...employee.profile, address: e.target.value}})} required />
                                        <Form.Control.Feedback type="invalid">{errors?.address}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Row className="mb-2">
                                        <Form.Group as={Col}>
                                            <Form.Label>Birth Date</Form.Label>
                                            <Datetime name="birth_date" dateFormat="YYYY-MM-DD" timeFormat="" initialValue={employee?.profile?.birth_date} onChange={e => setEmployee({...employee, profile: {...employee.profile, birth_date: e.format("YYYY-MM-DD")}})} required />
                                            {errors?.birth_date && <p className="text-danger">{errors?.birth_date}</p>}
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control type="text" name="phone" placeholder="Phone Number" defaultValue={employee?.profile?.phone} isInvalid={Boolean(errors?.phone)} onChange={e => setEmployee({...employee, profile: {...employee.profile, phone: e.target.value}})} required />
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
                                        <Form.Control type="text" name="username" placeholder="Username" defaultValue={employee?.username} isInvalid={Boolean(errors?.username)} onChange={e => setEmployee({...employee, username: e.target.value})} required />
                                        <Form.Control.Feedback type="invalid">{errors?.username}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Row className="mb-2">
                                        <Form.Group as={Col}>
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control type="text" name="first_name" placeholder="First Name" defaultValue={employee?.first_name} isInvalid={Boolean(errors?.first_name)} onChange={e => setEmployee({...employee, first_name: e.target.value})} required />
                                            <Form.Control.Feedback type="invalid">{errors?.first_name}</Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control type="text" name="last_name" placeholder="Last Name" defaultValue={employee?.last_name} isInvalid={Boolean(errors?.last_name)} onChange={e => setEmployee({...employee, last_name: e.target.value})} required />
                                            <Form.Control.Feedback type="invalid">{errors?.last_name}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" name="email" placeholder="Email" defaultValue={employee?.email} isInvalid={Boolean(errors?.email)} onChange={e => setEmployee({...employee, email: e.target.value})} required />
                                        <Form.Control.Feedback type="invalid">{errors?.email}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Role</Form.Label>
                                        <Form.Select name="role" isInvalid={Boolean(errors?.role)} value={employee?.role} onChange={e => setEmployee({...employee, role: e.target.value})} required>
                                            <option key={1} value={1}>Manager</option>
                                            <option key={2} value={2}>Receptionist</option>
                                            <option key={3} value={3}>employee</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">{errors?.role}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Button type="submit">
                                        Submit
                                        {loading && <Spinner animation="border" size="sm" />}
                                    </Button>
                                </Form>
                            )}
                        </>
                    ) : (
                        <h1>User Not Found</h1>
                    )}
                </>
            )}
        </Container>
    )
}

export default EditEmployee;