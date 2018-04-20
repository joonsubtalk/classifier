import React, { Component } from 'react';
import logo from './logo.svg';
import brain from 'brain.js';
import './App.css';

import { trainingData } from './script/training-data.js';

class App extends Component {

  state = {
    output : '',
    trainedNet : () => {}
  }

  componentDidMount() {

    setTimeout( () => {
        this.startNeuralNetwork();
      }, 0
    );

  }

  // converts argument into a number between 0 and 1
  encode = (arg) => {
    let longWords = arg.split(' ').filter(word => word.length > 5);

    return longWords.toString().split('').map(x => (x.charCodeAt(0) / 255));
  }

  processTrainingData = (trainingData) => {
    return trainingData.map(data => {
      console.log(this.encode(data.input.title))
        return {
          input : {
            url : this.encode(data.input.url),
            title : this.encode(data.input.title)
          }, output : data.output }
    })
  }

  train = (data) => {
    let net = new brain.NeuralNetwork();
    net.train(this.processTrainingData(data));

    const trainFn = net.toFunction();

    this.setState({trainedNet : trainFn});

    console.log('Finished training...');
  };

  execute = (input) => {

    input.url = this.encode(input.url);
    input.title = this.encode(input.title);

    let results = this.state.trainedNet(input);

    console.log('results',results);
    
    if (results.agency > results.nonagency) 
      return 'Agency'
    else
      return 'Nonagency';
  }

  startNeuralNetwork = () => {
    this.train(trainingData);
    console.log("Should be a NonAgency: - ", this.execute({
      url : 'https://www.fbi.gov/',
      title : 'Welcome to FBI.gov — FBI',
      description : 'FBI Homepage with links to news, services, stories and information of interest to the public.'
    }));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">{this.state.output}</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
