import { Board, Errors } from "../constants";

export type Coordinates2D = [number, number];

export class Chessboard {
  constructor(public size: number) {
    if (this.size < Board.MIN_SIZE || this.size > Board.MAX_SIZE) {
      throw Errors.BOARD_SIZE_OUT_OF_BOUNDS;
    }
  }

  // checks a piece is in one of the 4 corners
  hasCorner([x, y]: Coordinates2D): boolean {
    return (x | y | 0 | this.size) === this.size;
  }

  // validates a numerical coordinate on the board
  hasCoordinate(coordinate: number): boolean {
    return coordinate >= 0 && coordinate <= this.size;
  }

  // validates a placement (in Cartesian coordinates) on the board
  hasPosition([x, y]: Coordinates2D): boolean {
    return this.hasCoordinate(x) && this.hasCoordinate(y);
  }

  // transforms an algebraic chess notation to Cartesian coordinates
  static notationToCoordinates(str: string): Coordinates2D {
    const [, letterX, numberY] = /([A-Z])(\d+)/.exec(str.toUpperCase()) || [];
    if (!letterX && !letterX) {
      throw Errors.INVALID_POSITION;
    }
    // [A-Z]: charCodes [65-90] => coordinates [1-25]
    return [letterX.charCodeAt(0) - 65, ~~numberY - 1];
  }

  // transforms Cartesian coordinates to an algebraic chess notation
  static coordinatesToNotation([x, y]: Coordinates2D): string {
    return `${String.fromCharCode(x + 65)}${y + 1}`;
  }
}
