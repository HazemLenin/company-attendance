import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Table, Button, Row, Col, Form } from 'react-bootstrap';
import useAxios from '../hooks/useAxios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faPlus, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

function Employees() {
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const user = useSelector(state => state.user);
    const api = useAxios();

    useEffect(() => {
        api.get('/api/users/')
        .then(response => {
            setData(response.data);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);

    function updateList(url) {
        setLoading(true);
        api.get(url.replace(/https?:\/\/[^\/]+/i, ""), {params: {depth: 1}})
        .then(response => {
            setData(response.data);
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
        });
    }

    function handleSearchChange(e) {
        setLoading(true);
        api.get('/api/users/', {params: {search: e.target.value}})
        .then(response => {
            setData(response.data);
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
        });
    }

    return (
        <Container>
            <h1>
                <FontAwesomeIcon icon={faUsers} className="me-2" />
                Employees
            </h1>
            { parseInt(user.role) === 1 && (
                <Button variant="outline-success" className="mb-2" as={Link} to="/employees/new">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Add New Employee
                </Button>
            )}
            <Form onSubmit={e => e.preventDefault()}>
                <Form.Label>Search</Form.Label>
                <Form.Control type="text" name="search" placeholder="Search by ID/Username/First Name/Last Name/Email" onChange={handleSearchChange} />
            </Form>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <Table bordered striped hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>First name</th>
                                <th>Last name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.results.map(employee => (
                                <tr key={ employee.id }>
                                    <td>{ employee.id }</td>
                                    <td><Link to={`/employees/${employee.id}`}>{ employee.username }</Link></td>
                                    <td>{ employee.email }</td>
                                    <td>{ employee.first_name }</td>
                                    <td>{ employee.last_name }</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Row>
                        <Col>
                            <Button className="float-start" onClick={e => updateList(data.previous)} disabled={!Boolean(data.previous)}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </Button>
                        </Col>
                        <Col>
                            <Button className="float-end" onClick={e => updateList(data.next)} disabled={!Boolean(data.next)}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    )
}

export default Employees;