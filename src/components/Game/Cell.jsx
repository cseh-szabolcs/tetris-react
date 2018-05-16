import React from 'react';

/**
 * Displaying an single cell
 */
export default ({value, fadeOut = false}) => {
  let classFadeOut = (fadeOut) ? 'fade-out' : '';

  return (
    <div className={ `tetris-cell _c${value} ${classFadeOut}` } style={ {width:32, height:32} }>
      { (value > 0) && (<span />) }
    </div>
  );
};
