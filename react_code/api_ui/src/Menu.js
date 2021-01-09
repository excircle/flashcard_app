import React from 'react';
import axios from 'axios';

//Mselect
class Mselect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      mselect : true,
      domains: [],
    }
    this.fetchDomains = this.fetchDomains.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //AXIOS GET REQUEST
  cancelToken = axios.CancelToken;
  source = this.cancelToken.source();
  headers = {'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest'};

  abortController = new AbortController();

  fetchDomains = async () => {
    try {
      let result = await axios.get(`http://172.18.0.3:8000/domains`, {
	crossDomain: true,
        cancelToken: this.source.token,
        headers: this.headers
      }, );
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
        throw new Error("Cancelled");
      }
    }
  };

  componentDidMount() {
    this.fetchDomains()
      .then(data =>
        this.setState({
          domains: data
        })
      )
      .catch(err => {
        console.log("Cancelled");
      });
  }

  componentWillUnmount() {
    this.source.cancel("Operation canceled by the user.");
  }

  //handleFunctions
  handleChange(event) {
    console.log("HANDLE CHANGE");
    console.log(event.target.value)
    this.props.domainFunction(event.target.value);
  }

  handleSubmit(event) {
    this.props.switchDisplay()
    event.preventDefault();
  }

  //Render
  render() {
    //let { domains } = this.state.domains;
    return (
        <div className="menu_select">
          <form onSubmit={this.handleSubmit}>
            <label>
              Please Choose A Domain
              <select value="domainList" onChange={this.handleChange}>
                {this.state.domains.map(domain => <option value={domain.id} key={domain.id} id={domain.id}>{domain.domain}</option>)}
              </select>
            </label>
            <p></p>
            <input type="submit" value="Select" />
          </form>
        <p></p>
        </div>
    )
  }
}

//Mdisplay
class Mdisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      responseData: [],
      indexNumber: 0,
      sequenceNumber: 1,
      blur: true,
      desc: true,
    }
  }
  //AXIOS GET REQUEST
  cancelToken = axios.CancelToken;
  source = this.cancelToken.source();
  headers = {'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest'};

  abortController = new AbortController();

  fetchDomains = async () => {
    try {
      let result = await axios.get(`http://172.18.0.3:8000/questions/${this.props.domain_option}`, {
        cancelToken: this.source.token,
        headers: this.headers
      }, );
      return result.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
        throw new Error("Cancelled");
      }
    }
  };

  componentDidMount() {
    this.fetchDomains()
      .then(data =>
        this.setState({
          responseData: data
        })
      )
      .catch(err => {
        console.log("Cancelled");
      });
  }

  componentWillUnmount() {
    this.source.cancel("Operation canceled by the user.");
  }

  //Button FUnctions
  show() {
    console.log("show has been called.")
    this.setState(currState => ({ blur: !currState.blur }));
  };

  desc() {
    console.log("show has been called.")
    this.setState(currState => ({ desc: !currState.desc }));
  };

  next() {
    if ( (this.state.sequenceNumber + 1) > this.state.responseData.length ) {
        console.log("FAIL! " + "SEQ " + this.state.sequenceNumber + " LEN: " + this.state.responseData.length)
        this.setState(currState => ({ indexNumber: 0, sequenceNumber: 1, blur: true, desc: true }));
    } else { 
        console.log("PASS! " + "SEQ " + this.state.sequenceNumber + " LEN: " + this.state.responseData.length)
        this.setState(currState => ({ indexNumber: currState.indexNumber + 1, sequenceNumber: currState.sequenceNumber + 1, blur: true, desc: true }));
    };
    //console.log(this.state.responseData.length);
    console.log("Next Method Called");
    
  };
  //RENDER
  render() {
    //GENERATE QUESTIONS
    const { responseData } = this.state;
    let show = this.show.bind(this);
    let next = this.next.bind(this);
    let desc = this.desc.bind(this);
    const responseDataList = responseData.length ? (
          <React.Fragment>
            <div className="question">
              <p>
                <strong>Question:</strong> {responseData[this.state.indexNumber]['question']}
              </p>
              <div className={this.state.blur?'answer':'answered'}>
                <p>
                  <strong><a onClick={desc}>Answer:</a></strong> {responseData[this.state.indexNumber]['answer']}
                </p>
              </div>
              <div className={this.state.desc?'answer':'desc'}>
                <p>{responseData[this.state.indexNumber]['description']}</p>
              </div>
            </div>
            <div className="button">
              <button onClick={show}>Show</button>
              <button onClick={next}>Next</button>
            </div>
            <p></p>
          </React.Fragment>
    ) : (
      <div>No User Data Recieved Yet</div>
    );
    //RETURN
    return (
      <React.Fragment>
        {responseDataList}
      </React.Fragment>
    )
  }
}

//Menu
class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.setSelection = this.setSelection.bind(this);
    this.setMyOption = this.setMyOption.bind(this);
    this.state = { 
      mselect : true,
      moption : 0
    }
  }
  //setSelect function
  setSelection() {
    this.setState({ mselect: false })
  }

  //setMyOption
  setMyOption(value) {
    this.setState({ moption: value })
  }
  //render
  render() {
    let myobject;
    if (this.state.mselect) {
      myobject = <Mselect domainFunction={this.setMyOption} switchDisplay={this.setSelection} />;
    } else {
      myobject = <Mdisplay domain_option={this.state.moption}/>;
    }
    return (
      <div className="menu_stage">
        {myobject}
      </div>
    )
  }
}

export default Menu;
