import React, { Component } from "react";
import loader from "./images/loader.svg";
import Gif from "./Gif";
import { throws } from "assert";
import clearButton from "./images/close-icon.svg";

const API_KEY = "yY4iqYejPNETnuZSPD3bQWG8l9NH3PmY";

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const Header = ({ clearSearch, hasResults }) => (
  <div className="header grid">
    {hasResults ? (
      <button onClick={clearSearch}>
        <img src={clearButton} />
      </button>
    ) : (
      <h1 className="title">Jiffy</h1>
    )}
  </div>
);

const UserHint = ({ loading, hintText }) => (
  <div className="user-hint">
    {loading ? <img className="block mx-auto" src={loader} /> : hintText}
  </div>
);

const Button = ({ hasResults, searchTerm, searchGiphy }) => (
  <div className=" grid">
    {hasResults ? (
      <button onClick={() => searchGiphy(searchTerm)}>
        <h1 className="title button">Enter</h1>
        {/* <img src={randomButton} /> */}
      </button>
    ) : null}
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: "",
      hintText: "",
      gifs: []
    };
  }

  searchGiphy = async searchTerm => {
    this.setState({ loading: true });
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=50&offset=0&rating=PG-13&lang=en`
      );
      const { data } = await response.json();

      // Do something with data
      if (!data.length) {
        throw `Nothing found for ${searchTerm}`;
      }
      const randomGif = randomChoice(data);

      this.setState((prevState, ...props) => ({
        ...prevState,
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit enter to search for more ${searchTerm}`
      }));
    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        loading: false,
        hintText: error
      }));
    }
  };

  handleChange = event => {
    const { value } = event.target;
    this.setState((prevState, props) => ({
      // we take all our old props and spread them out here
      ...prevState,
      // and then we overwrite the ones we want after
      searchTerm: value,
      //update hint text at the bottom
      hintText: value.length > 2 ? `Hit enter to search for ${value}` : ""
    }));
  };

  handleKeyPress = event => {
    const { value } = event.target;
    if (value.length > 2 && event.key === "Enter") {
      this.searchGiphy(value);
    }
  };

  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: "",
      hintText: "",
      gifs: []
    }));
    this.textInput.focus();
  };

  render() {
    const { searchTerm, gifs } = this.state;
    const hasResults = gifs.length;
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />

        <div className="search grid">
          {/* here should the gif images be*/}
          {this.state.gifs.map(gif => (
            <Gif {...gif} />
          ))}

          <input
            className="input grid-item"
            placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={input => {
              this.textInput = input;
            }}
          />
        </div>
        <UserHint {...this.state} />
        <Button
          hasResults={hasResults}
          searchTerm={searchTerm}
          searchGiphy={this.searchGiphy}
        />
      </div>
    );
  }
}

export default App;
