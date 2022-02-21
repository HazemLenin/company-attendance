import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

function ManagerDashboard() {
    const [ data, setData ] = useState({attending: '-', absent: '-'});
    useEffect(() => {
        axios.get('/api/dashboard/', {headers: {Authorization: `Bearer ${JSON.parse(localStorage.getItem('authTokens')).access}`}})
        .then(response => {
            setData(response.data);
        })
        .catch(err => {
            console.log(err)
        })
    }, [])
  return (
    <Container>
        <h1>
            <FontAwesomeIcon icon={faChartLine} className="me-2" />
            Dashboard
        </h1>
        <Table striped bordered hover>
            <tbody>
                <tr>
                    <td>employees in company</td>
                    <td>{ data.attending }</td>
                </tr>
                <tr>
                    <td>absent employees</td>
                    <td>{ data.absent }</td>
                </tr>
            </tbody>
        </Table>
    </Container>
  )
}

export default ManagerDashboard;