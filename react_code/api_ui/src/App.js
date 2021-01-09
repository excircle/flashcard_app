import React from 'react';
import ReactDOM from 'react-dom';
//import axios from 'axios';
import Banner from './Banner'
import Menu from './Menu'
import Submit from './Submit'
import './App.css';

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Banner />
        <Menu />
        <Submit />
      </React.Fragment>
    );
  } 
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);

export default App;