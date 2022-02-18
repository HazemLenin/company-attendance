import React from 'react';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function Home() {
  const isAuthenticated = useSelector(state => state.isAuthenticated);
  const user = useSelector(state => state.user);
  const profile = useSelector(state => state.profile);
  return (
    <Container>
      Home<br />
      { isAuthenticated && <>welcome, {user.first_name} {user.last_name}({user.username})</>}
    </Container>
  )
}

export default Home;