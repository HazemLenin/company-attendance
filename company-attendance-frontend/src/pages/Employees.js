import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faPlus } from '@fortawesome/free-solid-svg-icons';

function Employees() {
    const [ data, setData ] = useState([{
        id: '',
        username: 'Loading',
        email: 'Loading',
        first_name: 'Loading',
        last_name: 'Loading'
    }]);

    useEffect(() => {
        axios.get('/api/users/', {headers: {Authorization: `Bearer ${JSON.parse(localStorage.getItem('authTokens')).access}`}})
        .then(response => {
            setData(response.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);
    return (
        <Container>
            <h1>
                <FontAwesomeIcon icon={faUsers} className="me-2" />
                Employees
            </h1>
            <Button variant="outline-success" className="mb-2" as={Link} to="/employees/new">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Add Employee
            </Button>
            <Table bordered striped hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>First name</th>
                        <th>Last name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((employee, i) => (
                        <tr key={ employee.id }>
                            <td>{ i + 1 }</td>
                            <td><Link to={`/employees/${employee.id}`}>{ employee.username }</Link></td>
                            <td>{ employee.email }</td>
                            <td>{ employee.first_name }</td>
                            <td>{ employee.last_name }</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}

export default Employees;