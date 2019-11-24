import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import * as Vibrant from 'node-vibrant';

import AlbumCover from './AlbumCover/AlbumCover';
import AlbumMeta from './AlbumMeta/AlbumMeta';
import Spotify from '../lib/spotify';
import User from './User';

const spotify = new Spotify();

const Callback = () => {
  spotify.handleCallback();
  return <Redirect to="/" />;
};

const Login = () => {
  window.location.href = spotify.getAuthUrl();
  return null;
};

class App extends Component {
  state = {
    albumColor: null,
    titleColor: null,
    progressColor: null,
    track: null,
    user: null,
  };

  constructor() {
    super();
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.loadSpotifyData();
    setInterval(this.loadSpotifyData, 500);
  }

  handleColorChanged = (err, palette) => {
    const vibrant = palette.Vibrant;
    const startingRgb = `rgba(${vibrant.r},${vibrant.g},${vibrant.b},0.4)`;
    const endingRgb = `rgba(${vibrant.r},${vibrant.g},${vibrant.b},1)`;
    const background = `linear-gradient(0deg, ${startingRgb} 0%, ${endingRgb} 100%)`;
    document.getElementsByTagName('body')[0].style.background = background;
    this.setState({
      albumColor: palette.Vibrant.hex,
      progressColor: palette.Vibrant.hex,
      titleColor: palette.LightMuted.hex,
    });
  };

  loadSpotifyData = () => {
    const cachedTrack = Spotify.getFromCache('track');
    this.setState({
      user: Spotify.getFromCache('user'),
      track: cachedTrack,
    });

    if (spotify.token) {
      spotify.getCurrentUser().then(user => {
        this.setState({ user });
      });

      spotify.getCurrentTrack().then(track => {
        this.setState({ track });
      });
    }
    if (!cachedTrack) {
      return;
    }
    Vibrant.from(cachedTrack.item.album.images[0].url).getPalette(
      this.handleColorChanged
    );
  };

  handleLogout() {
    spotify.logout();
    this.setState({
      track: null,
      user: null,
    });
  }

  render() {
    const { albumColor, user, track, titleColor, progressColor } = this.state;
    let artists;
    if (track) {
      artists = track.item.artists.map(artist => artist.name);
      artists = artists.join(', ');
    }
    return (
      <Router>
        <div className="App">
          {track && (
            <div className="album">
              <AlbumCover
                albumId={track.item.uri}
                albumImg={track.item.album.images[0].url}
              />
              <AlbumMeta
                album={track.item.album.name}
                albumColor={albumColor}
                artist={artists}
                current={track.progress_ms}
                length={track.item.duration_ms}
                progressColor={progressColor}
                title={track.item.name}
                titleColor={titleColor}
              />
            </div>
          )}
          <User user={user} login={spotify.login} logout={this.handleLogout} />
          <Route path="/callback" render={Callback} />
          <Route path="/login" render={Login} />
        </div>
      </Router>
    );
  }
}

export default App;
