
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';


const {
  MULTIPLAY_ACCEPT,
  MULTIPLAY_CANCEL,
  MULTIPLAY_INVITE,
  SERVER_MULTIPLAY_ACCEPT,
  SERVER_MULTIPLAY_CANCEL,
  SERVER_MULTIPLAY_INVITE,
} = actions.types;



/**
 * Implements the logic for invitation other users to play
 *
 */
export const invitationLogic = createLogic({
  type: [MULTIPLAY_INVITE, SERVER_MULTIPLAY_INVITE, MULTIPLAY_ACCEPT, SERVER_MULTIPLAY_ACCEPT],
  latest: true,

  process({ getState, action, ws }, dispatch, done) {
    let state = getState();

    // invite user to play
    // ---------------------------------------------------------
    if (action.type === MULTIPLAY_INVITE) {

      ws.send({
        action: action.type,
        token: state.auth.token,
        room: action.room,
        payload: {
          level: action.level,
          strict: action.strict,
        },
      });

      done(); return;
    }

    // an invitation has arrived from server (could be mine)
    // ---------------------------------------------------------
    if (action.type === SERVER_MULTIPLAY_INVITE) {

      let initial = (state.auth.uid === action.payload.senderUid);
      let level = action.payload.level;

      level = (level < 1 || level > 9) ? 1 : level;

      dispatch(actions.multiplay.invitation({
        room: action.payload.room,
        otherUid: parseInt(initial ? action.payload.recipientUid : action.payload.senderUid),
        level: action.payload.level,
        strict: action.payload.strict,
        initial,
      }));

      done(); return;
    }


    // an invitation has been accepted
    // ---------------------------------------------------------
    if (action.type === MULTIPLAY_ACCEPT) {

      ws.send({
        action: action.type,
        token: state.auth.token,
        room: action.room,
      });
    }

    else if (action.type === SERVER_MULTIPLAY_ACCEPT) { // if-statement just for understanding

      dispatch(actions.multiplay.start({
        room: action.payload.room,
      }));
    }

    done();
  }
});


/**
 * Handles the game-play-logic between two users
 *
 */
export const gameLogic = createLogic({
  type: ['FOO'],
  latest: true,

  process({ getState, action }, dispatch, done) {


    // Cancel-logic
    // ---------------------------------------------------------
    if (action.type === MULTIPLAY_CANCEL) {

    }


    done();
  }
});


/**
 * Handles the game-cancellation when invitation is send or game already running
 *
 */
export const cancelLogic = createLogic({
  type: [MULTIPLAY_CANCEL, SERVER_MULTIPLAY_CANCEL],
  latest: true,

  process({ getState, action, ws }, dispatch, done) {
    let state = getState();


    if (action.type === MULTIPLAY_CANCEL) {
      ws.send({
        action: action.type,
        token: state.auth.token,
        room: action.room,
      });

      done(); return;
    }

    dispatch(actions.multiplay.canceled({
      room: action.payload.room,
    }));

    done();
  }
});
