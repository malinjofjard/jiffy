import React, { Component } from "react";

class Gif extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentDidUpdate() {
    if (this.props.playing) return this.play();
    else return this.pause();
  }

  play() {
    this.video.play();
  }

  pause() {
    this.video.pause();
  }

  render() {
    const { images } = this.props;
    const { loaded } = this.state;
    return (
      <video
        className={`grid-item video ${loaded && "loaded"}`}
        autoPlay
        muted
        loop
        playsInline
        src={images.original.mp4}
        onLoadedData={() => this.setState({ loaded: true })}
        ref={video => (this.video = video)}
      />
    );
  }
}

export default Gif;
