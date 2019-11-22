import React from 'react';
import PropTypes from 'prop-types';
import TimeBar from '../TimeBar/TimeBar';
import classes from './AlbumMeta.module.css';

function AlbumMeta(props) {
  const { title, album, artist, current, length } = props;
  return (
    <div className={classes.MetaOrder}>
      <div className={classes.MetaContainer}>
        <h2 className={[classes.AlbumMeta, classes.Artist].join(' ')}>
          {artist}
        </h2>
        <h3 className={[classes.AlbumMeta, classes.Title].join(' ')}>
          {title}
        </h3>
        <div className={classes.Break} />
        <h3 className={[classes.AlbumMeta, classes.Album].join(' ')}>
          {album}
        </h3>
      </div>
      <TimeBar current={current} total={length} />
    </div>
  );
}

AlbumMeta.propTypes = {
  title: PropTypes.string.isRequired,
  album: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  current: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
};

export default AlbumMeta;
