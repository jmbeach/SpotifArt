import React from 'react';
import PropTypes from 'prop-types';
import classes from './TimeBar.module.css';

const TimeBar = props => {
  const { current, total } = props;
  const pct = `${(current / total) * 100}%`;
  return (
    <div className={classes.TimeBarContainer}>
      <div className={classes.TimeBar}>
        <div className={classes.Progress} style={{ width: pct }} />
      </div>
    </div>
  );
};

TimeBar.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default TimeBar;
