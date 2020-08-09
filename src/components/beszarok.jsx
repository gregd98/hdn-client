import React from 'react';

const Beszarok = () => {
  return (
    <div>
      <nav id="navbar-example2" className="navbar navbar-light bg-light sticky-top">
        <a className="navbar-brand" href="#">Navbar</a>
        <ul className="nav nav-pills">
          <li className="nav-item">
            <button className="btn btn-link nav-link active">egy</button>
          </li>
          <li className="nav-item">
            <a className="nav-link">ketto</a>
          </li>
          <li className="nav-item">
            <a className="nav-link">harom</a>
          </li>
        </ul>
      </nav>
      <div data-spy="scroll" data-target="#navbar-example2" data-offset="0">
        <h4 id="fat">GameItem</h4>
        <h4 id="fat">GameItem</h4>
        <h4 id="fat">GameItem</h4>
      </div>
    </div>
  );
};

export default Beszarok;
