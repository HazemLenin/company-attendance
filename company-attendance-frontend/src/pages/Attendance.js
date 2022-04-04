import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import { useSelector, useDispatch } from 'react-redux';
import { add_toast } from '../actions';
import moment from 'moment';

function Attendance() {

    const [ attendance, setAttendance ] = useState({});
    const [ loading, setLoading ] = useState(true);
    const [ attendanceFound, setAttendanceFound ] = useState(true);
    const [ showDeletionModal, setShowDeletionModal ] = useState(false);
    const api = useAxios();
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/api/v1/attendances/${id}/`, {params: {depth: 1}})
        .then(response => {
            setAttendance(response.data);
            setLoading(false);
        })
        .catch(err => {
            if (err.response.status === 404) {
                setAttendanceFound(false);
                setLoading(false);
            }
        })
    }, [])

    function handleDelete(e) {
        api.delete(`/api/v1/attendances/${attendance?.id}/`)
        .then(response => {
            dispatch(add_toast({
                page: `Employee ${attendance?.user?.first_name} ${attendance?.user?.last_name}'s attendance page.`,
                content: "Attendance deleted successfully.",
                bg: "success"
            }));
            navigate('/attendances');
        })
        .catch(err => {
            dispatch(add_toast({
                page: `Employee ${attendance?.user?.first_name} ${attendance?.user?.last_name}'s attendance page.`,
                content: "Something went wrong.",
                bg: "danger"
            }));
        })
    }

    return (
        <Container>
            <h1>
                Attendance
            </h1>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <>
                    {attendanceFound ? (
                        <>
                            <Table striped bordered hover>
                                <tbody>
                                    <tr>
                                        <td>Employee</td>
                                        <td><Link to={`/employees/${attendance?.user?.id}`}>{attendance?.user?.first_name} {attendance?.user?.last_name}</Link></td>
                                    </tr>
                                    <tr>
                                        <td>Time In</td>
                                        <td>{moment(attendance?.time_in).local().format("YYYY-MM-DD HH:mmZ")}</td>
                                    </tr>
                                    <tr>
                                        <td>Time Out</td>
                                        <td>{attendance.time_out && moment(attendance?.time_out).local().format("YYYY-MM-DD HH:mmZ")}</td>
                                    </tr>
                                </tbody>
                            </Table>
                            {user.role === "managers" && (
                                <>
                                    <Button variant="primary" className="me-2" as={Link} to={`/attendances/${attendance.id}/edit`}>Edit</Button>

                                    <Button variant="danger" onClick={e => setShowDeletionModal(true)}>Delete</Button>
                                    
                                    <Modal show={showDeletionModal} onHide={e => setShowDeletionModal(false)}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>
                                                Delete Attendance
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>Do you want to delete this attendance?</Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={e => setShowDeletionModal(false)}>
                                                Close
                                            </Button>
                                            <Button variant="danger" onClick={handleDelete}>Delete</Button>
                                        </Modal.Footer>
                                    </Modal>
                                </>
                            )}
                        </>
                    ) : (
                        <h1>Attendance not found!</h1>
                    )}
                </>
            )}
        </ Container>
    )
}

export default Attendance;