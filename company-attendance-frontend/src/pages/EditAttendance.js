import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Col, Row, Spinner } from 'react-bootstrap';
import Datetime from 'react-datetime';
import { useDispatch } from 'react-redux';
import { add_toast } from '../actions';
import useAxios from '../hooks/useAxios';
import moment from 'moment';

function EditAttendance() {
    const [ attendance, setAttendance ] = useState({});
    const [ errors, setErrors ] = useState({});
    const [ loading, setLoading ] = useState(false);
    const [ loadingAttendance, setLoadingAttendance ] = useState(false);
    const [ validated, setValidated ] = useState(false);
    const [ attendanceFound, setAttendanceFound ] = useState(true);
    const api = useAxios();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        api.get(`/api/attendances/${id}/`, {params: {depth: 1}})
        .then(response => {
            setAttendance(response.data);
            setLoadingAttendance(true);
        })
        .catch(err => {
            setErrors(err.response?.data);
            if (err.response?.status === 404) {
                setAttendanceFound(false);
            }
            dispatch(add_toast({
                page: `Edit attendance for ${attendance?.user?.first_name} ${attendance?.user?.last_name}`,
                content: "Something went wrong.",
                bg: "danger",
            }));
        })
    }, [])

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        api.put(`/api/attendances/${attendance.id}/`, {...attendance, user: attendance?.user?.id})
        .then(response => {
            setLoading(false);
            setValidated(true);
            dispatch(add_toast({
                page: `Edit attendance for ${attendance?.user.first_name} ${attendance?.user?.last_name}`,
                content: `Attendance for ${attendance?.user.first_name} ${attendance?.user?.last_name} updated successfully.`,
                bg: "success",
            }));
            navigate('/attendances');
        })
        .catch(err => {
            setLoading(false);
            setErrors(err.response?.data);
            setValidated(true);
            dispatch(add_toast({
                page: `Edit attendance for ${attendance?.user?.first_name} ${attendance?.user?.last_name}`,
                content: "Something went wrong.",
                bg: "danger",
            }));
        });
    }
    
    return (
        <Container>
            <h1>Edit Attendance</h1>
            <p className="text-danger">{errors?.detail}</p>
            {loadingAttendance ? (
                <>
                    {attendanceFound ? (
                        <Form onSubmit={handleSubmit} noValidate validated={validated}>
                            <Form.Group className="mb-2">
                                <Form.Label>Employee</Form.Label>
                                <Form.Control type="text" name="user"  defaultValue={attendance?.user?.first_name + ' ' + attendance?.user?.last_name} readOnly plaintext />
                                <Form.Control.Feedback type="invalid">{errors?.user}</Form.Control.Feedback>
                            </Form.Group>
                            <Row className="mb-2">
                                <Form.Group as={Col}>
                                    <Form.Label>Time In</Form.Label>
                                    <Datetime name="time_in" dateFormat="YYYY-MM-DD" timeFormat="HH:mmZ" initialValue={moment(attendance?.time_in).local().format("YYY-MM-DD HH:mmZ")} onChange={e => setAttendance({...attendance, time_in: e})} required />
                                    {errors?.time_in && <p className="text-danger">{errors?.time_in}</p>}
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Time Out</Form.Label>
                                    <Datetime name="time_out" dateFormat="YYYY-MM-DD" timeFormat="HH:mmZ" isValidDate={(currentDate, selectedDate) => currentDate >= moment(attendance?.time_in)} initialValue={attendance?.time_out ? moment(attendance?.time_out).local().format("YYY-MM-DD HH:mmZ") : ''} onChange={e => setAttendance({...attendance, time_out: e})} />
                                    {errors?.time_out && <p className="text-danger">{errors?.time_out}</p>}
                                </Form.Group>
                            </Row>
                            <Button type="submit">
                                Submit
                                {loading && <Spinner animation="border" size="sm" />}
                            </Button>
                        </Form>
                    ) : (
                        <p>Attendance not found.</p>
                    )}
                </>
            ) : (
                <h1>Loading...</h1>
            )}
        </Container>
    )
}

export default EditAttendance;