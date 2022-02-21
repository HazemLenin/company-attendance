import React from 'react';
import {
	Navbar as BsNavbar,
	Container,
	Nav,
	NavDropdown,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faUserPlus, faRightFromBracket, faRightToBracket, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
	const authTokens = useSelector(state => state.authTokens);
	const user = useSelector(state => state.user);
  return (
	<>
		<BsNavbar bg="light" expand="lg">
			<Container>
				<BsNavbar.Brand as={Link} to="/">company-attendance</BsNavbar.Brand>
				<BsNavbar.Toggle aria-controls="basic-navbar-nav" />
				<BsNavbar.Collapse id="basic-navbar-nav">
					{ authTokens && (
						<Nav className="me-auto">
							{user.role == 1 && <Nav.Link as={Link} to="/dashboard">
								<FontAwesomeIcon icon={faChartLine} className="me-2" />
								Dashboard
							</Nav.Link>}
							{(user.role == 1 || user.role == 2) && (
								<NavDropdown title={<><FontAwesomeIcon icon={faUsers} className="me-2" />Employees</>} id="basic-nav-dropdown">
									<NavDropdown.Item as={Link} to="/employees">
										<FontAwesomeIcon icon={faUsers} className="me-2" />
										Employees
									</NavDropdown.Item>
									<NavDropdown.Item as={Link} to="/employees/new">
										<FontAwesomeIcon icon={faUserPlus} className="me-2" />
										New Employee
									</NavDropdown.Item>
								</NavDropdown>
							)}
						</Nav>
					)}
					<Nav>
						{ authTokens ?
							<>
								<Nav.Link as={Link} to="/profile">
									<FontAwesomeIcon icon={faUser} className="me-2" />
									Profile
								</Nav.Link>
								<Nav.Link as={Link} to="/logout">
									<FontAwesomeIcon icon={faRightFromBracket} className="me-2" />
									Logout
								</Nav.Link>
							</>
						:
							<Nav.Link as={Link} to="/login">
								<FontAwesomeIcon icon={faRightToBracket} className="me-2" />
								Login
							</Nav.Link>}
					</Nav>
				</BsNavbar.Collapse>
			</Container>
		</BsNavbar>
	</>
  )
}

export default Navbar;