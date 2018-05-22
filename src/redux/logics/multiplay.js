
import { createLogic } from 'redux-logic';
import actions from 'tetris-actions';
import {MULTIPLAY_START} from "../actions/types";


const {
  GAME_OVER,
  GAME_TO_SINGLE_MODE,
  MULTIPLAY_ACCEPT,
  MULTIPLAY_CANCEL,
  MULTIPLAY_INVITE,
  ONLINE_LEAVE,
  MULTIPLAY_FIELD_CHANGED,
  SERVER_GAME_OVER,
  SERVER_MULTIPLAY_ACCEPT,
  SERVER_MULTIPLAY_CANCEL,
  SERVER_MULTIPLAY_INVITE,
  SERVER_MULTIPLAY_FIELD_CHANGED,
  FIELD_CHANGED,
  FIELD_NOT_CHANGED,
  FIELD_APPLY_NEW,
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
    GAME_OVER,
    GAME_TO_SINGLE_MODE,
    MULTIPLAY_START,
    FIELD_CHANGED,
    FIELD_NOT_CHANGED,
    FIELD_APPLY_NEW,
    SERVER_GAME_OVER,
    SERVER_MULTIPLAY_FIELD_CHANGED,
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

    if (action.type === GAME_TO_SINGLE_MODE) {
      dispatch(actions.game.paused(true));
      dispatch(actions.game.paused(false));
    }


    // I have resolved lines (or maybe not) -> let other user know
    // ---------------------------------------------------------

    if ([FIELD_CHANGED, FIELD_NOT_CHANGED, FIELD_APPLY_NEW].indexOf(action.type) > -1) {
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


    // Handle game-over
    // ---------------------------------------------------------

    // i have lost
    if (action.type === GAME_OVER) {
      if (!action.won) {
        ws.send({
          action: GAME_OVER,
          token: state.auth.token,
          room: state.multiplay.room,
        });
      }
      done(); return;
    }

    // other user has lost
    if (action.type === SERVER_GAME_OVER) {
      dispatch(actions.game.over(true));
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
        let room = state.online.users[otherUid].room;

        if (state.multiplay.room === room) {
          dispatch(actions.game.over(true));
        }
        dispatch(actions.multiplay.canceled({ room }));
      }

      done(); return;
    }

    // and running multi-game was canceled by one of the users
    // ---------------------------------------------------------

    let room = action.payload.room;
    let senderUid = action.payload.senderUid;

    dispatch(actions.game.over(senderUid !== state.auth.uid));
    dispatch(actions.multiplay.canceled({ room }));

    done();
  }
});
