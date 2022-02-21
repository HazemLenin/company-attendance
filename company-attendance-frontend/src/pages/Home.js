import React from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
function Home() {
  const authTokens = useSelector(state => state.authTokens);
  const user = useSelector(state => state.user);
  return (
    <Container>
      <h1>
        <FontAwesomeIcon icon={faHome} className="me-2" />
        Home
      </h1>
      { authTokens && <>welcome, {user.first_name} {user.last_name}({user.username})</>}
    </Container>
  )
}

export default Home;