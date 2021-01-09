import React from 'react';
import axios from 'axios';

class Submit extends React.Component {
  state = {
    question: '',
    answer: '',
    description: '',
  };

  onSubmit(event) {
    event.preventDefault()

    const headers = {'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest'};
    const questObject = {
      question: this.state.question,
      answer: this.state.answer,
      description: this.state.description
    };

    axios.post('http://172.18.0.3:8000/submit', questObject)
      .then((res) => {
          console.log(res.data)
      }).catch((error) => {
          console.log(error)
    });
    event.target.reset();
  }
  render() {
    let onSubmit = this.onSubmit.bind(this);
    return (
      <React.Fragment>
      <div className="centi">
        <a onClick={() => this.setState(currState => ({ blur: !currState.blur}))}>CLICK TO SUBMIT</a>
      </div>
      <p></p>
        <div className={this.state.blur?'wrapper':'nwrapper'}>
            <form onSubmit={onSubmit}>
                <p></p>
                <div className={this.state.blur?'ansform':'nansform'}>
                    <label>Question:</label>
                    <input type="text" value={this.state.question} onChange={event => this.setState({ question: event.target.value })} className="form-control" />
                </div>
                <div className={this.state.blur?'ansform':'nansform'}>
                    <label>Answer:</label>
                    <input type="text" value={this.state.answer} onChange={event => this.setState({ answer: event.target.value })} className="form-control" />
                </div>
                <div className={this.state.blur?'ansform':'nansform'}>
                    <label>Description:</label>
                    <input type="text" value={this.state.description} onChange={event => this.setState({ description: event.target.value })} className="form-control" />
                </div>
                <div className={`${this.state.blur?'ansform':'nansform'} button`}>
                    <input type="submit" value="Submit" className="centi" />
                    <p></p>
                    <a onClick={event => this.setState({ question: '', answer: '', description: ''})}> CLEAR</a>
                </div>
            </form>
        </div>
      </React.Fragment>
    )
  }
}

export default Submit;
