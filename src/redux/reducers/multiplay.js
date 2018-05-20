
import actions from 'tetris-actions';

const {
  MULTIPLAY_INVITATION,
} = actions.types;


const initialState = {
  available: true, // when false, user playing multiplayer-game
  invitations: {}, // contains the invitation-data
  room: null,
  lines: null,
  level: 1,
  strict: true,
  uid: 0,
  won: null,
  otherScore: {resolved:0, score:0},
  otherField: [],
};



/**
 * Contains the state of the current multi-game-session
 *
 */
export default (state = initialState, action) => {
  switch (action.type) {

    case MULTIPLAY_INVITATION:
      if (!state.available) {
        return state; // when playing
      }

      if (state.invitations[action.room]) {
        return state; // already invited
      }

      return { ...state,
        invitations: { ...state.invitations,
          // add new data to inivitations
          [action.room]: {
            otherUid: action.otherUid,
            level: action.level,
            strict: action.strict,
            initial: action.initial,
          }
        },
      };

    default:
      return state;
  }
};
