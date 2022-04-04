import React, { useState } from 'react';
import { Container, Form, Button, Col, Row, Spinner, Modal, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import Datetime from 'react-datetime';
import { useDispatch, useSelector } from 'react-redux';
import { add_toast } from '../actions';
import moment from 'moment';

function NewAttendance() {
    const [ attendance, setAttendance ] = useState(null);
    const [ errors, setErrors ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ validated, setValidated ] = useState(false);
    const [ code, setCode ] = useState('');
    const [ showEmployeeModal, setShowEmployeeModal ] = useState(false);
    const [ lastAttendance, setLastAttendance ] = useState(null);
    const [ employee, setEmployee ] = useState({});
    const api = useAxios();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user);

    function handleManagerSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        api.post('/api/v1/attendances/', attendance)
        .then(response => {
            setLoading(false);
            setValidated(true);
            dispatch(add_toast({
                page: "New Attendance",
                content: "Attendance has been added successfully.",
                bg: "success",
            }));
            navigate(`/attendances/${response.data.id}`);
        })
        .catch(err => {
            setLoading(false);
            setErrors(err.response?.data);
            setValidated(true);
            dispatch(add_toast({
                page: "New Attendance",
                content: "Something went wrong.",
                bg: "danger",
            }));
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        api.post('/api/v1/user_with_code/', {code: code})
        .then(response => {
            setLoading(false);
            setValidated(true);
            setEmployee(response.data.employee);
            if (response.data.attendance) setLastAttendance(response.data.attendance);
            setShowEmployeeModal(true);
        })
        .catch(err => {
            setLoading(false);
            setErrors(err.response?.data);
            setValidated(true);
            dispatch(add_toast({
                page: "New Attendance",
                content: "Something went wrong.",
                bg: "danger",
            }));
        });
    }

    function handleEmployeeLeave(e) {
        api.patch(`/api/v1/attendances/${lastAttendance?.id}/`, {time_out: new Date()})
        .then(response => {
            setLoading(false);
            setValidated(true);
            setShowEmployeeModal(false);
            dispatch(add_toast({
                page: "New Attendance",
                content: `${lastAttendance.user.first_name} ${lastAttendance.user.last_name} leaved company successfully.`,
                bg: "success",
            }));
            navigate(`/attendances/${response.data.id}`);
        })
        .catch(err => {
            setLoading(false);
            setErrors(err.response?.data);
            setValidated(true);
            dispatch(add_toast({
                page: "New Attendance",
                content: "Something went wrong.",
                bg: "danger",
            }));
        });
    }

    function handleEmployeeEnter(e) {
        api.post("/api/attendances/", {user: employee.id})
        .then(response => {
            setLoading(false);
            setValidated(true);
            setShowEmployeeModal(true);
            dispatch(add_toast({
                page: "New Attendance",
                content: "Employee Entered company successfully.",
                bg: "success",
            }));
            navigate(`/attendances/${response.data.id}`);
        })
        .catch(err => {
            setLoading(false);
            setErrors(err.response?.data);
            setValidated(true);
            dispatch(add_toast({
                page: "New Attendance",
                content: "Something went wrong.",
                bg: "danger",
            }));
        });
    }
    if (user.role === "managers") {
        return (
            <Container>
                <h1>New Attendance</h1>
                <p className="text-danger">{errors?.detail}</p>
                <Form onSubmit={handleManagerSubmit} noValidate validated={validated}>
                    <Form.Group className="mb-2">
                        <Form.Label>User ID</Form.Label>
                        <Form.Control type="number" name="user" placeholder="User ID" isInvalid={Boolean(errors?.user)} onChange={e => setAttendance({...attendance, user: e.target.value})} required />
                        <Form.Control.Feedback type="invalid">{errors?.user}</Form.Control.Feedback>
                    </Form.Group>
                    <Row className="mb-2">
                        <Form.Group as={Col}>
                            <Form.Label>Time In</Form.Label>
                            <Datetime name="time_in" dateFormat="YYYY-MM-DD" timeFormat="HH:mmZ" onChange={e => setAttendance({...attendance, time_in: e})} required />
                            {errors?.time_in && <p className="text-danger">{errors?.time_in}</p>}
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Time Out</Form.Label>
                            <Datetime name="time_out" dateFormat="YYYY-MM-DD" timeFormat="HH:mmZ" isValidDate={(currentDate, selectedDate) => currentDate >= moment(attendance?.time_in)} onChange={e => setAttendance({...attendance, time_out: e})} required />
                            {errors?.time_out && <p className="text-danger">{errors?.time_out}</p>}
                        </Form.Group>
                    </Row>
                    <Button type="submit">
                        Submit
                        {loading && <Spinner animation="border" size="sm" />}
                    </Button>
                </Form>
            </Container>
        )
    }
    
    return (
        <Container>
            <h1>New Attendance</h1>
            <p className="text-danger">{errors?.detail}</p>
            <Form onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Group className="mb-2">
                    <Form.Label>Employee Code</Form.Label>
                    <Form.Control type="number" name="code" placeholder="Employee Code" isInvalid={Boolean(errors?.code)} onChange={e => setCode(e.target.value)} required />
                    <Form.Control.Feedback type="invalid">{errors?.code}</Form.Control.Feedback>
                </Form.Group>
                <Button type="submit">
                    Submit
                    {loading && <Spinner animation="border" size="sm" />}
                </Button>
            </Form>
            <Modal show={showEmployeeModal} onHide={e => setShowEmployeeModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Employee Found
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <tbody>
                            <tr>
                                <td>Username</td>
                                <td>{employee?.username}</td>
                            </tr>
                            <tr>
                                <td>First Name</td>
                                <td>{employee?.first_name}</td>
                            </tr>
                            <tr>
                                <td>Last Name</td>
                                <td>{employee?.last_name}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>{employee?.email}</td>
                            </tr>
                            <tr>
                                <td>Address</td>
                                <td>{employee?.profile?.address}</td>
                            </tr>
                            <tr>
                                <td>Birth Date</td>
                                <td>{employee?.profile?.birth_date}</td>
                            </tr>
                            <tr>
                                <td>Phone Number</td>
                                <td>{employee?.profile?.phone}</td>
                            </tr>
                        </tbody>
                    </Table>
                    {lastAttendance && (
                        <>
                            <h1>Last Attendance</h1>
                            <Table striped bordered hover>
                                <tbody>
                                    <tr>
                                        <td>Employee</td>
                                        <td>{lastAttendance?.user.first_name} {lastAttendance?.user.last_name}</td>
                                    </tr>
                                    <tr>
                                        <td>Time In</td>
                                        <td>{moment(lastAttendance?.time_in).local().format("YYYY-MM-DD HH:mmZ")}</td>
                                    </tr>
                                    <tr>
                                        <td>Time Out</td>
                                        <td>{lastAttendance?.time_out && moment(lastAttendance?.time_out).local().format("YYYY-MM-DD HH:mmZ")}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={e => setShowEmployeeModal(false)}>
                        Close
                    </Button>
                    { employee?.profile?.in_company ? (
                        <Button variant="danger" onClick={handleEmployeeLeave}>Leave</Button>
                    ) : (
                        <Button variant="success" onClick={handleEmployeeEnter}>Enter</Button>
                    )}
                </Modal.Footer>
            </Modal>
        </Container>
    )
    
}

export default NewAttendance