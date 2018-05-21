
import actions from 'tetris-actions';
import library from 'tetris-library';


const {
  MULTIPLAY_CANCELED,
  MULTIPLAY_INVITATION,
  MULTIPLAY_FIELD_CHANGED,
  MULTIPLAY_START,
  WINDOW_RESTORE_SLAVE,
} = actions.types;



const initialState = {
  available: true, // when false, user playing multiplayer-game
  invitations: {}, // contains the invitation-data
  room: null,
  otherUid: 0,
  strict: true,
  initial: false,
  lines: null,
  level: 1,
  won: null,
  otherScore: {resolved:0, score:0},
  otherField: [],
};



/**
 * Contains the state of the current multi-game-session
 *
 */
export default (state = initialState, action) => {
  let room;

  switch (action.type) {


    case MULTIPLAY_INVITATION:
      if (!state.available) {
        return state; // when playing
      }

      if (state.invitations[action.room]) {
        return state; // already invited
      }

      room = action.room;

      return { ...state,
        invitations: { ...state.invitations,
          // add new data to invitations
          [room]: {
            room,
            otherUid: action.otherUid,
            level: action.level,
            strict: action.strict,
            initial: action.initial,
          }
        },
      };


    case MULTIPLAY_START:
      room = action.room;
      let invitation = state.invitations[room];

      return { ...initialState,
        invitations: { ...state.invitations
          [room] = undefined,
        },
        ...invitation,
        otherField: library.tetris.createField({
          rows: 18,
          cols: 10
        }),
      };


    case MULTIPLAY_CANCELED:
      room = action.room;

      return { ...initialState,
        invitations: { ...state.invitations
          [room] = undefined,
        },
      };


    case MULTIPLAY_FIELD_CHANGED:
      return { ...state,
        otherField: action.fieldState,
      };


    case WINDOW_RESTORE_SLAVE:
      if (action.masterState.multiplay) {
        return {
          ...state,
          ...action.masterState.multiplay,
        };
      }
      return state;


    default:
      return state;
  }
};
