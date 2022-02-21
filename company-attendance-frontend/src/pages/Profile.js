import React from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

function Profile() {
    const user = useSelector(state => state.user);
  return (
      <Container>
            <h1>
                <FontAwesomeIcon icon={faUser} className="me-2" />
                Profile
            </h1>
          <Table striped bordered hover>
              <tbody>
                <tr>
                    <td>Username:</td>
                    <td>{user.username}</td>
                </tr>
                <tr>
                    <td>Email:</td>
                    <td>{user.email}</td>
                </tr>
                <tr>
                    <td>First Name:</td>
                    <td>{user.first_name}</td>
                </tr>
                <tr>
                    <td>Last Name:</td>
                    <td>{user.last_name}</td>
                </tr>
                <tr>
                    <td>Role:</td>
                    <td>{user.role}</td>
                </tr>
                <tr>
                    <td>Birth Date:</td>
                    <td>{user.profile.birth_date}</td>
                </tr>
                <tr>
                    <td>Address:</td>
                    <td>{user.profile.address}</td>
                </tr>
                <tr>
                    <td>Phone Numbaer:</td>
                    <td>{user.profile.phone}</td>
                </tr>
            </tbody>
          </Table>
      </Container>
  )
}

export default Profile;