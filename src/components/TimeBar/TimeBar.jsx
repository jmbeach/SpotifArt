import React from 'react';
import PropTypes from 'prop-types';
import classes from './TimeBar.module.css';

const TimeBar = props => {
  const { current, total, progressColor } = props;
  const pct = `${(current / total) * 100}%`;
  const progressStyle = { width: pct };
  if (progressColor) {
    progressStyle.backgroundColor = progressColor;
  }
  return (
    <div className={classes.TimeBarContainer}>
      <div className={classes.TimeBar}>
        <div className={classes.Progress} style={progressStyle} />
      </div>
    </div>
  );
};

TimeBar.defaultProps = {
  progressColor: null,
};

TimeBar.propTypes = {
  current: PropTypes.number.isRequired,
  progressColor: PropTypes.string,
  total: PropTypes.number.isRequired,
};

export default TimeBar;
