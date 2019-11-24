import React from 'react';
import PropTypes from 'prop-types';
import TimeBar from '../TimeBar/TimeBar';
import classes from './AlbumMeta.module.css';

function AlbumMeta(props) {
  const {
    album,
    albumColor,
    artist,
    current,
    length,
    progressColor,
    title,
  } = props;
  const albumStyle = {};
  const titleStyle = {};
  if (albumColor) {
    albumStyle.color = albumColor;
  }

  return (
    <div className={classes.MetaOrder}>
      <div className={classes.MetaContainer}>
        <h2 className={[classes.AlbumMeta, classes.Artist].join(' ')}>
          {artist}
        </h2>
        <h3
          className={[classes.AlbumMeta, classes.Title].join(' ')}
          style={titleStyle}
        >
          {title}
        </h3>
        <div className={classes.Break} />
        <h3 className={[classes.AlbumMeta, classes.Album].join(' ')}>
          {album}
        </h3>
      </div>
      <TimeBar current={current} total={length} progressColor={progressColor} />
    </div>
  );
}

AlbumMeta.defaultProps = {
  albumColor: null,
  progressColor: null,
};

AlbumMeta.propTypes = {
  album: PropTypes.string.isRequired,
  albumColor: PropTypes.string,
  artist: PropTypes.string.isRequired,
  current: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  progressColor: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default AlbumMeta;
