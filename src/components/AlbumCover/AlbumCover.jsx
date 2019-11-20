import React from 'react';
import PropTypes from 'prop-types';
import classes from './AlbumCover.module.css';

const AlbumCover = props => {
  const { albumId, albumImg } = props;
  return (
    <div className={classes.AlbumCoverContainer} data-id={albumId}>
      <img className={classes.AlbumCover} src={albumImg} alt="" />
    </div>
  );
};

AlbumCover.propTypes = {
  albumId: PropTypes.string,
  albumImg: PropTypes.string,
};

AlbumCover.defaultProps = {
  albumId: 0,
  albumImg: '/public/img/defaultalbum.jpg',
};

export default AlbumCover;
