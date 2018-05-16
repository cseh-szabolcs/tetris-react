const expect = require('expect');
import Library from 'tetris-library';
import Reducers from 'tetris-reducers';


describe('Tetris library core-function collision-test', () => {
  it('should exist', () => {
    expect(Library.tetris.mergeStoneInField).toExist();
  });

  describe('when the stone hits the field-border including rotation-test', () => {
    it('should be a collision when reaching the borders', () => {
      let field = Library.tetris.createField({rows: 18, cols: 10});
      let stoneState = Reducers.stone(undefined, {type:'GAME_START'});

      expect(stoneState.xPos).toExist();
      stoneState.current = Library.tetris.getStoneByName('line');
      stoneState.xPos = 1;
      stoneState.yPos = -1;

      // move let (ok)
      let newField = Library.tetris.mergeStoneInField('STONE_MOVE_LEFT', stoneState, field);
      expect(newField).toNotBe(false);
      expect(field).toNotBe(newField);

      // move left (should fail)
      stoneState.xPos = 0;
      newField = Library.tetris.mergeStoneInField('STONE_MOVE_LEFT', stoneState, field);
      expect(newField).toBe(false);

      // rotate (should fail - collision with top)
      newField = Library.tetris.mergeStoneInField('STONE_ROTATE', stoneState, field);
      expect(newField).toBe(false);

      // rotate (ok)
      stoneState.yPos = 1;
      newField = Library.tetris.mergeStoneInField('STONE_ROTATE', stoneState, field);
      expect(newField).toNotBe(false);
    });

  });

});
