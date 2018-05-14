

import {
  WINDOW_RESTORE_SLAVE,
} from './types';


export const restoreSlave = (masterState) => {
  return {
    type: WINDOW_RESTORE_SLAVE,
    masterState,
  };
};

