import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Table, Button, Row, Col, Form } from 'react-bootstrap';
import useAxios from '../hooks/useAxios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPlus, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

function Attendances() {
    const [ data, setData ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const user = useSelector(state => state.user);
    const api = useAxios();

    useEffect(() => {
        api.get('/api/attendances/', {params: {depth: 1}})
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
        api.get('/api/attendances/', {params: {search: e.target.value, depth: 1}})
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
                <FontAwesomeIcon icon={faList} className="me-2" />
                Attendances
            </h1>
            { parseInt(user.role) === 1 && (
                <Button variant="outline-success" className="mb-2" as={Link} to="/attendances/new">
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Add New Attendances
                </Button>
            )}
            <Form onSubmit={e => e.preventDefault()}>
                <Form.Label>Search</Form.Label>
                <Form.Control type="text" name="search" placeholder="Search by ID or attendance employee's Username/First Name/Last Name/Email" onChange={handleSearchChange} />
            </Form>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <Table bordered striped hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Employee</th>
                                <th>Time In</th>
                                <th>Time Out</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.results.map(attendance => (
                                <tr key={ attendance.id }>
                                    <td>{ attendance.id }</td>
                                    <td>{ attendance.user.first_name } { attendance.user.last_name}</td>
                                    <td>{ moment(attendance.time_in).local().format("YYYY-MM-DD HH:mmZ") }</td>
                                    <td>{ attendance.time_out && moment(attendance.time_out).local().format("YYYY-MM-DD HH:mmZ") }</td>
                                    <td><Button as={Link} to={`/attendances/${attendance.id}`}>View</Button></td>
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

export default Attendances;