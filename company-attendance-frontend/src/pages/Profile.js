import React from 'react';
import { Container, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function Profile() {
    const user = useSelector(state => state.user);
    const profile = useSelector(state => state.profile);
  return (
      <Container>
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
                    <td>First name:</td>
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
                    <td>Birth date:</td>
                    <td>{profile.birth_date}</td>
                </tr>
                <tr>
                    <td>Address:</td>
                    <td>{profile.address}</td>
                </tr>
                <tr>
                    <td>Phone numbaer:</td>
                    <td>{profile.phone}</td>
                </tr>
            </tbody>
          </Table>
      </Container>
  )
}

export default Profile;