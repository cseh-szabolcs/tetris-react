/**
 * Contains all algorithms to implement Tetris and make the code indepentent
 * from any framework and app-logic
 *
 */


export const stones = [
  {
    name: 'line',
    value: 1,
    amount: 4,
    left: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    top: [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],
    right: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], // == left
    bottom: [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],  // == top
  },{
    name: 'triangle',
    value: 2,
    amount: 4,
    left: [[0,0,0],[1,1,1],[0,1,0]],
    top: [[0,1,0],[1,1,0],[0,1,0]],
    right: [[0,1,0],[1,1,1],[0,0,0]],
    bottom: [[0,1,0],[0,1,1],[0,1,0]],
  },{
    name: 'square',
    value: 3,
    amount: 4,
    left: [[1,1],[1,1]],
    top: [[1,1],[1,1]], // == left
    right: [[1,1],[1,1]], // == left,
    bottom: [[1,1],[1,1]], // == left,
  },{
    name: 'lego',
    value: 4,
    amount: 4,
    left: [[0,0,0],[1,1,1],[1,0,0]],
    top: [[1,1,0],[0,1,0],[0,1,0]],
    right: [[0,0,1],[1,1,1],[0,0,0]],
    bottom: [[0,1,0],[0,1,0],[0,1,1]],
  },{
    name: 'legoInv',
    value: 5,
    amount: 4,
    left: [[0,0,0],[1,1,1],[0,0,1]],
    top: [[0,1,0],[0,1,0],[1,1,0]],
    right: [[1,0,0],[1,1,1],[0,0,0]],
    bottom: [[0,1,1],[0,1,0],[0,1,0]],
  },{
    name: 'snake',
    value: 6,
    amount: 4,
    left: [[0,0,0],[0,1,1],[1,1,0]],
    top: [[0,1,0],[0,1,1],[0,0,1]],
    right: [[0,0,0],[0,1,1],[1,1,0]], // == left
    bottom: [[0,1,0],[0,1,1],[0,0,1]], // == top
  },{
    name: 'snakeInv',
    value: 7,
    amount: 4,
    left: [[0,0,0],[1,1,0],[0,1,1]],
    top: [[0,0,1],[0,1,1],[0,1,0]],
    right: [[0,0,0],[1,1,0],[0,1,1]], // == left
    bottom: [[0,0,1],[0,1,1],[0,1,0]], // == top
  },
];

export const rotations = ['left', 'top', 'right', 'bottom'];


/**
 * Contains all settings, which are important for game-logic
 *
 */
export const settings = {
  lines2Resolve: 9,  // how many lines to resolve, to reach ne next level
  scores4Line: 92, // for each line, you get this score
  linesBonus: 18,

  calcPoints: function (resolvedLines = 1, level = 1) {
    return (this.scores4Line
      + (resolvedLines * this.linesBonus) // normal addition
      + (resolvedLines * resolvedLines * 2) // reward multiple lines
      + (resolvedLines * level + (level * 4))
    );
  },

  calcLevel: function(resolvedAll) {
    return Math.round(resolvedAll / this.lines2Resolve + 0.5);
  },

  calcIntervalSpeed: function(level) {
    let speed = (600 - level * 48);

    return (speed > 30)
      ? speed
      : 30;
  }
};


/**
 * Returns an stone by given name
 *
 */
export const getStoneByName = (name) => {
  for (let i in stones) {
    if (stones[i].name === name) {
      return stones[i];
    }
  }
  return undefined;
};


/**
 * Returns an stone by Math.random
 *
 */
export const getStoneByRandom = (current = null) => {
  let min = 0;
  let max = stones.length - 1;
  let random = Math.floor(Math.random() * (max - min + 1)) + min;

  let selected = stones[random];

  // avoid to select the same stone many times
  return (current && current.name === selected.name && Math.random() >= 0.5)
    ? getStoneByRandom()
    : selected;
};


/**
 * Selects the next rotation from rotations or the first when current-param is null
 *
 */
export const getNextRotation = (current = null) => {
  if (!current || rotations.indexOf(current) === -1) {
    return rotations[0];
  }
  let i = rotations.indexOf(current) + 1;

  return (rotations[i])
    ? rotations[i]
    : rotations[0];
};


/**
 * MAIN-CORE: Apply stone-position on the given field
 *
 */
export const mergeStoneInField = (actionType, stoneState, fieldState) => {

  if (!stoneState.current) {
    return fieldState;
  }

  let x = stoneState.xPos,
    y = stoneState.yPos,
    rotation = stoneState.rotation;

  let newField = clone(fieldState);

  if (actionType === 'STONE_MOVE_LEFT') {
    x--;
  } else if (actionType === 'STONE_MOVE_RIGHT') {
    x++;
  } else if (actionType === 'STONE_MOVE_DOWN') {
    y++;
  } else if (actionType === 'STONE_ROTATE') {
    rotation = getNextRotation(rotation);
  }

  let stone = stoneState.current[rotation];
  let row = 0, col = 0, diffX = 0, diffY = (y < 0) ? Math.abs(y) : 0, changes = 0;
  let insideOfStoneVert = false, insideOfStoneHoriz = false;

  for (row = 0; row < newField.length; row++) {
    insideOfStoneVert = (row >= y && row <= (y + stone.length-1));

      for (col = 0; col < newField[row].length; col++) {
        insideOfStoneHoriz = (col >= x && col <= (x + stone[0].length-1));

        // remove previous stone-mapping
        if (newField[row][col] < 0) {
          newField[row][col] = 0;
        }

        if (insideOfStoneVert && insideOfStoneHoriz) { // inside of stone (horizontal)
          if (x < 0 && diffX === 0) {
            diffX = Math.abs(x); // don't compare cells, when stone was moved out of field
          }

          // CORE
          if (stone[diffY][diffX]) {
            // FAIL 1: cell is already used (collision)
            if (newField[row][col] > 0) {
              return fieldState;
            }
            // SUCCESS: map stone-value to field-value
            newField[row][col] = -stoneState.current.value;
            changes++;
          }

          diffX = diffX + 1;
        }
      }
      if (insideOfStoneVert) {
        if (diffX > 0) {
          diffX = 0;
        }
        diffY++;
      }
  }

  return (stoneState.current.amount !== changes)
    ? fieldState // FAIL 2: to less changes (stone was out of range)
    : newField;
};


/**
 * CORE 1: applies the tmp-stone-values in the field
 *
 */
export const applyStoneInField = (fieldState) => {
  let newField = clone(fieldState);
  let row, col;

  for (row = 0; row < newField.length; row++) {
    for (col = 0; col < newField[row].length; col++) {
      if (newField[row][col] < 0) {
        newField[row][col] = Math.abs(newField[row][col]);
      }
    }
  }

  return newField;
};


/**
 * CORE 2: Removes lines from field-array, when an row was solved.
 *
 */
export const removeSolvedLines = (fieldState) => {
  let newField = clone(fieldState);
  let row, resolved = [], i, newRow;

  // collect all resolved rows
  for (row = 0; row < newField.length; row++) {
    if (newField[row].indexOf(0) === -1) {
      resolved.push(row);
    }
  }

  // core: remove resolved rows
  for (i = 0; i < resolved.length; i++) {
    // remove
    newField.splice(resolved[i], 1);
    // add an new row on the top
    newRow = createField({rows:1, cols:fieldState[0].length});
    newField.unshift(newRow[0]);
  }

  return {
    resolved,
    field: (resolved.length) ? newField : fieldState,
  }
};


/**
 * Moves the stone to the most possible bottom-position
 *
 */
export const stonePullDown = (stoneState, fieldState) => {
  let newField, newStone = clone(stoneState);

  while (true) {
    newField = mergeStoneInField('STONE_MOVE_DOWN', newStone, fieldState);
    if (newField !== fieldState) {
      newStone.yPos++;
      fieldState = newField;
    } else {
      break;
    }
  }

  return {
    field: newField,
    yPos: newStone.yPos,
  };
};


/**
 * Creates an 2-dim-array as game-field
 *
 */
export const createField = ({rows, cols}) => {
  let fields = [];

  for (let i = 0; i < rows; i++) {
    fields.push([]);

    for (let c = 0; c < cols; c++) {
      fields[i].push(0);
    }
  }

  return fields;
};


/**
 * helper to call the window.setTimeout which supports unique timeouts
 *
 */
export const timeout = (function(){
  let q = null;

  return ({callback, duration = 200, than = null, clear = false}) => {
    if (clear === true) {
      if (q !== null) {
        window.clearTimeout(q);
        q = null;
      }
      return;
    }

    return new Promise((resolve, reject) => {
      if (q !== null) {
        window.clearTimeout(q);
        q = null;
      }

      q = window.setTimeout(() => {
        if (!isCallable(callback)) {
          throw 'cannot execute timeout, no callback-function given.'
        }

        let result = callback();

        if (isCallable(than)) {
          than();
        }

        resolve(result);
      }, (isCallable(duration)) ? duration() : duration);
    });
  };
})();


/**
 * Returns true, when given parameter is a function
 */
export const isCallable = (callable) => (callable && callable.constructor === Function);


/**
 * Clones given object/array
 */
export const clone = (obj) => {
  return (obj && (obj.constructor == Array || obj.constructor == Object))
    ? JSON.parse(JSON.stringify(obj))
    : obj;
};



/**
 * A simple helper to use webSocket
 *
 */
export const webSocket = {

  ws: null,
  listeners: [],

  /**
   * create a webSocket object
   */
  create: function() {
    if (!'WebSocket' in window) {
      return false;
    }

    const host = location.hostname + (location.port ? ':'+location.port: '');
    this.ws = new WebSocket('ws://'+host);

    this.ws.onmessage = event => {
      let data = null;
      try {
        data = JSON.parse(event.data);
      } catch (e) {
        console.log('Tetris-WebSocket: Cannot parse data from server.');
        return;
      }

      for (let i = 0; i < this.listeners.length; i++) {
        this.listeners[i](data, event);
      }
    };

    return true;
  },

  /**
   * call create, when no webSocket created yet
   */
  init: function () {
    if (this.ws === null) {
      this.create();
    }
    return (this.ws !== false);
  },

  /**
   * sends data to server
   */
  send: function(payload)
  {
    if (this.init()) {
      try {
        this.ws.send(JSON.stringify(payload));
      } catch (e) {
        throw 'Tetris-WebSocket: Cannot send data with given payload.'
      }
    }
  },

  /**
   * registers listener functions
   */
  addListener: function(callable) {
    if (this.init()) {
      if (!callable || callable.constructor != Function) {
        throw 'Tetris-WebSocket: Given listener must be a function.'
      }
      this.listeners.push(callable);
    }
    return callable;
  }

};
