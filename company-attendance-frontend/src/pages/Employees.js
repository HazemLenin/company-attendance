import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import axios from 'axios';

function Employees() {
    const [ data, setData ] = useState([{username: '-', email: '-', first_name: '-', last_name: '-'}]);

    useEffect(() => {
        axios.get('api/users/', {headers: {Authorization: `Bearer ${JSON.parse(localStorage.getItem('AuthToken')).access}`}})
        .then(response => {
            setData(response.data);
        })
        .catch(err => {
            console.log(err);
        })
    }, []);
    return (
        <Container>
            <h1>Employees</h1>
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
                    {data.map((employee, i) => {
                        return (
                            <tr>
                                <td>{ i + 1 }</td>
                                <td>{ employee.username }</td>
                                <td>{ employee.email }</td>
                                <td>{ employee.first_name }</td>
                                <td>{ employee.last_name }</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </Container>
    )
}

export default Employees;