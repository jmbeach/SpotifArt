import React, { Component } from 'react';
import PropTypes from 'prop-types';

class User extends Component {
  constructor() {
    super();

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    const { login } = this.props;
    login.call(this);
  }

  render() {
    const { user } = this.props;
    return (
      <div className="User">
        {user ? null : (
          <div className="User__logged-out">
            <button onClick={this.handleLogin} type="button">
              Login
            </button>
          </div>
        )}
      </div>
    );
  }
}

User.propTypes = {
  user: PropTypes.shape({
    display_name: PropTypes.string.isRequired,
    images: PropTypes.array,
  }),
  login: PropTypes.func.isRequired,
};

User.defaultProps = {
  user: null,
};

export default User;
