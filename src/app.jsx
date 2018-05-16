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
 * init store
 */
const store = Store.create(Logics);


/**
 * APP main-hook
 */
ReactDOM.render(
  <Provider store={ store }>
    <div className="tetris-main">
      <GamePage />
    </div>
  </Provider>,
  window.document.getElementById('app')
);


/**
 * avoid focus on tags
 */
(function($){
  $(document).foundation();
  $(function() {
    $(document).on('focus', 'a, button, .switch-input, label, .blur', function(){
      $(this).blur();
    });
  });
})(jQuery);
