import qs from 'querystring';

class Spotify {
  clientId = '0a34c220b4bd4822b7778e75e3c22422';

  clientIdSecretBase64 =
    'MGEzNGMyMjBiNGJkNDgyMmI3Nzc4ZTc1ZTNjMjI0MjI6YWNhODZlNmM2ZWU2NDk2ODgyODE0NDQxNWRkNmZjYzM=';

  scopes = ['user-read-currently-playing', 'user-read-playback-state'];

  redirectUri = 'http://localhost:3000/callback';
  redirectUri = 'http://localhost:3001/callback';

  refreshToken = null;

  token = null;

  expiry = null;

  constructor() {
    this.token = localStorage.getItem('token');
    this.expiry = localStorage.getItem('expiry');

    this.login = this.login.bind(this);
  }

  login() {
    window.location.href = this.getAuthUrl();
  }

  checkAuth() {
    const self = this;
    if (!self.token && !self.refreshToken) {
      window.location.href = self.getAuthUrl();
      return false;
    }
    if (self.expiry && self.expiry < Date.now()) {
      this.getNewToken().then(data => {
        console.log('[spotify]#checkAuth', data);
        self.token = data.access_token;
        if (data.refresh_token) {
          self.refreshToken = data.refresh_token;
        }

        self.expiry = data.expires_in;
      });
    }
    return true;
  }

  handleCallback() {
    // const params = Spotify.decodeHash(window.location.hash);
    const code = Spotify.getCodeFromUrl();
    console.log('[spotify]#handleCallback', code);
    return this.getNewToken(code);
  }

  getCurrentUser() {
    return this.getFromApi('/me', 'user');
  }

  getCurrentTrack() {
    return this.getFromApi('/me/player/currently-playing', 'track');
  }

  static getFromCache(key) {
    let cache = null;

    try {
      cache = JSON.parse(localStorage.getItem(key));
    } catch (error) {
      return null;
    }

    return cache;
  }

  getFromApi(endpoint, key) {
    console.log('[spotify]#getFromApi', endpoint, key);
    this.checkAuth();

    if (!this.token) {
      return new Promise((res, rej) => {
        res(null);
      });
    }

    const url = `https://api.spotify.com/v1${endpoint}`;

    const request = new Request(url, {
      headers: new Headers({
        Authorization: `Bearer ${this.token}`,
      }),
    });

    return fetch(request)
      .then(res => res.json())
      .then(data => (data.error ? null : data))
      .then(data => {
        localStorage.setItem(key, JSON.stringify(data));
        return data;
      })
      .catch(() => false);
  }

  getNewToken(code) {
    console.log('[spotify]#getNewToken');
    const { clientId, redirectUri, refreshToken } = this;
    let url = `https://accounts.spotify.com/api/token`;
    if (this.refreshToken) {
      url = `https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${refreshToken}`;
    }

    const request = new Request(url, {
      body: qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
      method: 'POST',
      headers: new Headers({
        Authorization: `Basic ${this.auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    });

    return fetch(request)
      .then(res => res.json())
      .catch(() => false);
  }

  getAuthUrl() {
    const { token, clientId: id, redirectUri: uri } = this;
    const scopes = this.scopes.join('%20');
    let loginUrl = 'https://accounts.spotify.com/authorize?';
    loginUrl += '&response_type=code';
    loginUrl += `&client_id=${id}`;
    loginUrl += scopes ? `&scope=${scopes}` : '';
    loginUrl += `&redirect_uri=${uri}`;
    loginUrl += token ? '&show_dialog=true' : '';
    return loginUrl;
  }

  static decodeHash(hash) {
    const hashParams = {};
    const regex = /([^&;=]+)=?([^&;]*)/g;
    const hashString = hash.substring(1);
    let matches;

    while ((matches = regex.exec(hashString))) {
      hashParams[matches[1]] = decodeURIComponent(matches[2]);
    }

    return hashParams;
  }

  static getCodeFromUrl() {
    return decodeURIComponent(window.location.href.split('code=')[1]);
  }
}

export default Spotify;
