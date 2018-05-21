
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';
import {MULTIPLAY_START} from "../actions/types";


const {
  MULTIPLAY_ACCEPT,
  MULTIPLAY_CANCEL,
  MULTIPLAY_INVITE,
  ONLINE_LEAVE,
  MULTIPLAY_FIELD_CHANGED,
  SERVER_MULTIPLAY_ACCEPT,
  SERVER_MULTIPLAY_CANCEL,
  SERVER_MULTIPLAY_INVITE,
  SERVER_MULTIPLAY_FIELD_CHANGED,
  FIELD_CHANGED,
  FIELD_NOT_CHANGED,
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
  type: [
    MULTIPLAY_START,
    FIELD_CHANGED,
    FIELD_NOT_CHANGED,
    SERVER_MULTIPLAY_FIELD_CHANGED
  ],
  latest: true,

  process({ getState, action, ws }, dispatch, done) {
    let state = getState();

    // init multi-player-game
    // ---------------------------------------------------------

    if (action.type === MULTIPLAY_START) {
      dispatch(actions.chat.windowFocus({ room: null }));

      dispatch(actions.game.init({
        multiplay: true,
        level: state.multiplay.level,
      }));

      done(); return;
    }

    // I have resolved lines (or maybe not) -> let other user know
    // ---------------------------------------------------------

    if (action.type === FIELD_CHANGED || action.type === FIELD_NOT_CHANGED) {
      ws.send({
        action: MULTIPLAY_FIELD_CHANGED,
        token: state.auth.token,
        room: state.multiplay.room,
        payload: {
          fieldState: state.field,
          resolvedLines: (action.type === FIELD_CHANGED)
            ? action.lines.length
            : 0,
        }
      });

      done(); return;
    }

    // User has resolved lines (or maybe not) -> let me know
    // ---------------------------------------------------------

    let resolvedLines = action.payload.resolvedLines;

    dispatch(actions.multiplay.fieldChanged({
      fieldState: action.payload.fieldState,
      resolvedLines,
    }));

    done();
  }
});



/**
 * Handles the game-cancellation when invitation is send or game already running
 *
 */
export const cancelLogic = createLogic({
  type: [MULTIPLAY_CANCEL, SERVER_MULTIPLAY_CANCEL, ONLINE_LEAVE],
  latest: true,

  process({ getState, action, ws }, dispatch, done) {
    let state = getState();


    // Current user want to cancel the multi-game (or invitation) -> notify other user
    // ---------------------------------------------------------

    if (action.type === MULTIPLAY_CANCEL) {
      ws.send({
        action: action.type,
        token: state.auth.token,
        room: action.room,
      });

      done(); return;
    }

    // other user has closing the browser (or re-fresh) ....
    // ---------------------------------------------------------

    if (action.type === ONLINE_LEAVE) {
      const otherUid = action.uid;

      // ...when relation, cancel multi-player-game or invitation
      if (state.online.users[otherUid].relation) {
        dispatch(actions.multiplay.canceled({
          room: state.online.users[otherUid].room,
        }));
      }

      done(); return;
    }

    // running multi-game was canceled
    // ---------------------------------------------------------

    dispatch(actions.multiplay.canceled({
      room: action.payload.room,
    }));

    done();
  }
});
