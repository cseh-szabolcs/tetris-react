import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import jQuery from 'jquery';

import Pages from 'tetris-pages';
import Store from 'tetris-store';
import Logics from 'tetris-logics';

const { GamePage } = Pages;


/**
 * Set up css-foundation
 */
require('applicationStyles');


/**
 * APP main-hook
 */
ReactDOM.render(
  <Provider store={ Store.create(Logics) }>
    <div className="tetris-main">
      <GamePage />
    </div>
  </Provider>,
  window.document.getElementById('app')
);


(function($){
  $(document).foundation();
})(jQuery);
