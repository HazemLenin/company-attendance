import React from 'react';
import {
	Navbar as BsNavbar,
	Container,
	Nav,
	NavDropdown
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Navbar() {
	const isAuthenticated = useSelector(state => state.isAuthenticated);
	const user = useSelector(state => state.user);
  return (
	<>
		<BsNavbar bg="light" expand="lg">
			<Container>
				<BsNavbar.Brand as={Link} to="/">company-attendance</BsNavbar.Brand>
				{/* <BsNavbar.Toggle aria-controls="basic-navbar-nav" /> */}
				{/* <BsNavbar.Collapse id="basic-navbar-nav"> */}
					{ isAuthenticated && (
						<Nav className="me-auto">
							{user.role === 'managers' && <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>}
							{(user.role === 'managers' || user.role === 'receptionists') && <Nav.Link as={Link} to="/employees">Employees</Nav.Link>}
						</Nav>
					)}
					<Nav>
						{ isAuthenticated ?
							<>
								<Nav.Link as={Link} to="/profile">Profile</Nav.Link>
								<Nav.Link as={Link} to="/logout">Logout</Nav.Link>
							</>
						:
							<Nav.Link as={Link} to="/login">Login</Nav.Link>}
					</Nav>
				{/* </BsNavbar.Collapse> */}
			</Container>
		</BsNavbar>
	</>
  )
}

export default Navbar;