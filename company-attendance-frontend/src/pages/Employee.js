import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import useAxios from '../hooks/useAxios';
import { useSelector, useDispatch } from 'react-redux';
import { add_toast } from '../actions';

function Employee() {

    const [ employee, setEmployee ] = useState({});
    const [ loading, setLoading ] = useState(true);
    const [ userFound, setUserFound ] = useState(true);
    const [ showActivationModal, setShowActivationModal ] = useState(false);
    const [ showDeletionModal, setShowDeletionModal ] = useState(false);
    const api = useAxios();
    const { id } = useParams();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    useEffect(() => {
        api.get(`/api/v1/users/${id}/`)
        .then(response => {
            setEmployee(response.data);
            setLoading(false);
        })
        .catch(err => {
            if (err.response.status === 404) {
                setUserFound(false);
                setLoading(false);
            }
        })
    }, [])

    function handleActivationToggle(e) {
        api.patch(`/api/v1/users/${employee.id}/`, {is_active: !employee?.is_active})
        .then(response => {
            setEmployee(response.data)
            setShowActivationModal(false);
            dispatch(add_toast({
                page: `Employee ${employee?.first_name} ${employee?.last_name} Employee page.`,
                content: "Employee updated Successfully.",
                bg: "success"
            }));
        })
        .catch(err => {
            dispatch(add_toast({
                page: `Employee ${employee?.first_name} ${employee?.last_name} Employee page.`,
                content: "Something went wrong.",
                bg: "danger"
            }));
        })
    }

    function handleDelete(e) {
        api.delete(`/api/v1/users/${employee.id}/`)
        .then(response => {
            setShowDeletionModal(false);
            dispatch(add_toast({
                page: `Employee ${employee?.first_name} ${employee?.last_name} Employee page.`,
                content: "Employee deleted successfully.",
                bg: "success"
            }));
        })
        .catch(err => {
            dispatch(add_toast({
                page: `Employee ${employee?.first_name} ${employee?.last_name} Employee page.`,
                content: "Something went wrong.",
                bg: "danger"
            }));
        })
    }

    return (
        <Container>
            <h1>
                <FontAwesomeIcon icon={faUser} />
                Employee
            </h1>
            {loading ? (
                <h1>Loading...</h1>
            ) : (
                <>
                    {userFound ? (
                        <>
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
                                        <td>Active</td>
                                        <td>{employee?.is_active ? 'Yes' : 'No'}</td>
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
                                    <tr>
                                        <td>In Company</td>
                                        <td>{employee?.profile?.in_company ? 'Yes' : 'No'}</td>
                                    </tr>
                                    { user.role === "managers" && (
                                        <tr>
                                            <td>Attending Code</td>
                                            <td>{employee?.profile?.attending_code}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                            { user.role === "managers" && (
                                <>
                                    <Button variant="primary" className="me-2" as={Link} to={`/employees/${employee.id}/edit`}>Edit</Button>
                                    {employee.is_active ? (
                                        <Button variant="danger" className="me-2" onClick={e => setShowActivationModal(true)}>Deactivate</Button>
                                    ):(
                                        <Button variant="success" className="me-2" onClick={e => setShowActivationModal(true)}>Activate</Button>
                                    )}
                                    <Button variant="danger" onClick={e => setShowDeletionModal(true)}>Delete</Button>
                                    <Modal show={showActivationModal} onHide={e => setShowActivationModal(false)}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>
                                                {employee?.is_active ? 'Deactivate Employee' : 'Activate Employee'}
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>Do you want to {employee.is_active ? 'deactivate' : 'activate' } this employee?</Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={e => setShowActivationModal(false)}>
                                                Close
                                            </Button>
                                            {employee.is_active ? (
                                                <Button variant="danger" onClick={handleActivationToggle}>Deactivate</Button>
                                            ):(
                                                <Button variant="success" onClick={handleActivationToggle}>Activate</Button>
                                            )}
                                        </Modal.Footer>
                                    </Modal>
                                    <Modal show={showDeletionModal} onHide={e => setShowDeletionModal(false)}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>
                                                Delete Employee
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>Do you want to delete this employee?</Modal.Body>
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
                        <h1>404 Employee not found!</h1>
                    )}
                </>
            )}
        </ Container>
    )
}

export default Employee;