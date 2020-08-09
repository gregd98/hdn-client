import React from 'react';

const ErrorPage = (input) => {
  const { status, message } = input;
  return (
    <div className="d-flex justify-content-center mt-4">
      <div>
      <h1 className="text-center text-danger display-4">ERROR{status && ` ${status}`}</h1>
      <h4 className="text-center text-danger">{message}</h4>
      </div>
    </div>
  );
};

export default ErrorPage;
