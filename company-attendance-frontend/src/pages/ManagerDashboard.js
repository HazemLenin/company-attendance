import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, ListGroupItem, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import useAxios from '../hooks/useAxios';
import moment from 'moment';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
function ManagerDashboard() {
    const [ data, setData ] = useState({});
    const [ attendingChartLabels, setAttendingChartLabels ] = useState([]);
    const [ attendingChartData, setAttendingChartData ] = useState([]);
    const api = useAxios();

    useEffect(() => {
        api.get('/api/dashboard/')
        .then(response => {
            setData(response.data);
            setAttendingChartLabels(response.data.attending_chart_labels);
            setAttendingChartData(response.data.attending_chart_data);
        })
        .catch(err => {
            console.log(err);
        })
    }, [])

    const options = {
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: 'Attending Chart In The Last 30 Days (in UTC time)',
            }
        }
    }
    const fData = {
        labels: attendingChartLabels,
        datasets: [
            {
              label: 'Active Attendances',
              data: attendingChartData,
              borderColor: 'rgb(0, 123, 255)',
              backgroundColor: 'rgba(0, 123, 255, 0.5)',
            },
        ]
    }
  return (
    <Container>
        <h1>
            <FontAwesomeIcon icon={faChartLine} className="me-2" />
            Dashboard
        </h1>
        <Row>
            <Col sm={12} md={6} xl={6}>
                <Line data={fData} options={options} />
            </Col>
            <Col sm={12} md={6} xl={6}>
                <ListGroup>
                    {data?.top_3_users?.map((user, i) => (
                        <ListGroupItem key={user.id}>
                            <Row>
                                <h4>{i + 1}</h4>
                                <Col>
                                    <p>First Name: {user?.first_name}</p>
                                    <p>Lirst Name: {user?.last_name}</p>
                                </Col>
                                <Col>
                                    <p>Username: {user?.username}</p>
                                    <p>Total attended hours in lthe last 30 days: {(user?.seconds / 60) / 60}hrs ({user?.seconds}secs)</p>
                                </Col>
                            </Row>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </Col>
        </Row>
        <Row>
            <Col sm={12} md={6} xl={6} className="text-center h-100">
                <Row>
                    <Card as={Col} sm={12} md={6} xl={6} className="border-5 border-white p-2 bg-danger text-white">
                        <h4>Attending employees:</h4>
                        <h4>{data.attending_count}</h4>
                    </Card>
                    <Card as={Col} sm={12} md={6} xl={6} className="border-5 border-white p-2 bg-warning">
                        <h4>Absent employees(not in company):</h4>
                        <h4>{data.absent_count}</h4>
                    </Card>
                </Row>
                <Row>
                    <Card as={Col} sm={12} md={6} xl={6} className="border-5 border-white p-2 bg-primary text-white">
                        <h4>Average attendances per day:</h4>
                        <h4>{data.avg_attendance_per_day}a/d</h4>
                    </Card>
                    <Card as={Col} sm={12} md={6} xl={6} className="border-5 border-white p-2 bg-success text-white">
                        <h4>Average active hours:</h4>
                        <h4>{moment(moment.utc(data.avg_time_in_timestamp)).local().format('HH:mm(Z)')} - {moment(moment.utc(data.avg_time_out_timestamp)).local().format('HH:mm(Z)')}</h4>
                    </Card>
                </Row>
            </Col>
                
            <Col sm={12} md={6} xl={6}>
                {/* <Line data={fData} options={options} /> */}
            </Col>
        </Row>
    </Container>
  )
}

export default ManagerDashboard;