import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1 style={{ fontSize: '5rem', color: '#ff0000' }}>404</h1>
        <p style={{ fontSize: '1.5rem' ,color:'grey'}}>
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link to="/" style={{ fontSize: '1.2rem', textDecoration: 'none', color: '#007bff' }}>
          Go back to Home
        </Link>
      </div>
    );
  };

  export default NotFound