const expect = require('expect');
import Library from 'library';


describe('Tetris library test', () => {
  it('should exist', () => {
    expect(Library.tetris).toExist();
  });

  describe('Test create-field-function', () => {
    it('should be a field as 2-dim-array with 18 rows and 10 cols', () => {
      let field = Library.tetris.createField({rows: 18, cols: 10});

      expect(field.length).toBe(18);
      expect(field[0].length).toBe(10);
      expect(field[field.length - 1].length).toBe(10);
    });

  });

  describe('Test the number of the stones', () => {
    it('should be seven stones with four rotate positions', () => {
      expect(Library.tetris.stones.length).toBe(7);
    });

    it('pick a random stone', () => {
      let stone = Library.tetris.getStoneByRandom();
      expect(stone).toExist();
    });

  });

  describe('Test the dimensions (left, top, right, bottom) of all stones', () => {

    it('compare line', () => {
      let stone = Library.tetris.getStoneByName('line');
      let left = [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]];
      let top = [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]];
      expect(stone).toExist();
      expect(stone.left).toEqual(left);
      expect(stone.top).toEqual(top);
      expect(stone.right).toEqual(left);
      expect(stone.bottom).toEqual(top);
      expect(stone.amount).toBe(getAmount(stone.left));
    });

    it('compare triangle', () => {
      let stone = Library.tetris.getStoneByName('triangle');
      let left = [[0,0,0],[1,1,1],[0,1,0]];
      let top = [[0,1,0],[1,1,0],[0,1,0]];
      let right = [[0,1,0],[1,1,1],[0,0,0]];
      let bottom = [[0,1,0],[0,1,1],[0,1,0]];
      expect(stone).toExist();
      expect(stone.left).toEqual(left);
      expect(stone.top).toEqual(top);
      expect(stone.right).toEqual(right);
      expect(stone.bottom).toEqual(bottom);
      expect(stone.amount).toBe(getAmount(stone.left));
    });

    it('compare square', () => {
      let stone = Library.tetris.getStoneByName('square');
      let left = [[1,1],[1,1]];
      expect(stone).toExist();
      expect(stone.left).toEqual(left);
      expect(stone.top).toEqual(left);
      expect(stone.right).toEqual(left);
      expect(stone.bottom).toEqual(left);
      expect(stone.amount).toBe(getAmount(stone.left));
    });

    it('compare lego', () => {
      let stone = Library.tetris.getStoneByName('lego');
      let left = [[0,0,0],[1,1,1],[1,0,0]];
      let top = [[1,1,0],[0,1,0],[0,1,0]];
      let right = [[0,0,1],[1,1,1],[0,0,0]];
      let bottom = [[0,1,0],[0,1,0],[0,1,1]];
      expect(stone).toExist();
      expect(stone.left).toEqual(left);
      expect(stone.top).toEqual(top);
      expect(stone.right).toEqual(right);
      expect(stone.bottom).toEqual(bottom);
      expect(stone.amount).toBe(getAmount(stone.left));
    });

    it('compare legoInv', () => {
      let stone = Library.tetris.getStoneByName('legoInv');
      let left = [[0,0,0],[1,1,1],[0,0,1]];
      let top = [[0,1,0],[0,1,0],[1,1,0]];
      let right = [[1,0,0],[1,1,1],[0,0,0]];
      let bottom = [[0,1,1],[0,1,0],[0,1,0]];
      expect(stone).toExist();
      expect(stone.left).toEqual(left);
      expect(stone.top).toEqual(top);
      expect(stone.right).toEqual(right);
      expect(stone.bottom).toEqual(bottom);
      expect(stone.amount).toBe(getAmount(stone.left));
    });

    it('compare snake', () => {
      let stone = Library.tetris.getStoneByName('snake');
      let left = [[0,0,0],[0,1,1],[1,1,0]];
      let top = [[0,1,0],[0,1,1],[0,0,1]];
      expect(stone).toExist();
      expect(stone.left).toEqual(left);
      expect(stone.top).toEqual(top);
      expect(stone.right).toEqual(left);
      expect(stone.bottom).toEqual(top);
      expect(stone.amount).toBe(getAmount(stone.left));
    });

    it('compare snakeInv', () => {
      let stone = Library.tetris.getStoneByName('snakeInv');
      let left = [[0,0,0],[1,1,0],[0,1,1]];
      let top = [[0,0,1],[0,1,1],[0,1,0]];
      expect(stone).toExist();
      expect(stone.left).toEqual(left);
      expect(stone.top).toEqual(top);
      expect(stone.right).toEqual(left);
      expect(stone.bottom).toEqual(top);
      expect(stone.amount).toBe(getAmount(stone.left));
    });

    function getAmount(stone) {
      let amount = 0;
      for (let r in stone) {
        for (let c in stone[r]) {
          if (stone[r][c]) {
            amount++;
          }
        }
      }
      return amount;
    }
  });

  describe('Test the rotation', () => {

    it('should be four rotations', () => {
      expect(Library.tetris.rotations).toEqual(['left','top','right','bottom']);
    });

    it('should always select the next rotation', () => {
      let rotation = Library.tetris.getNextRotation();
      expect(rotation).toBe('left');
      rotation = Library.tetris.getNextRotation(rotation);
      expect(rotation).toBe('top');
      rotation = Library.tetris.getNextRotation(rotation);
      expect(rotation).toBe('right');
      rotation = Library.tetris.getNextRotation(rotation);
      expect(rotation).toBe('bottom');
      rotation = Library.tetris.getNextRotation(rotation);
      expect(rotation).toBe('left');
      rotation = Library.tetris.getNextRotation(rotation);
      expect(rotation).toBe('top');
    });

  });

});
