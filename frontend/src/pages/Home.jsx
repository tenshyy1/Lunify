import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>DEBUG: Home Page</h1>
      <p>
        <Link to="/login">Go to Login</Link>
      </p>
    </div>
  );
};

export default Home;