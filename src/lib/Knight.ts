import { Coordinates2D, Chessboard } from "./Chessboard";

export class Knight {
  // the knight moves 3 squares, in an L shape, in any direction:
  // 2 squares horizontally + 1 square vertically,
  // or 2 squares vertically + 1 square horizontally
  private static stride: number = 3;

  constructor(public board: Chessboard) {}

  // translates a coordinate symmetrically, within axis limits
  *translate(coordinate: number, by: number): IterableIterator<number> {
    for (let squares of [by, -by]) {
      const translatedCoordinate = coordinate + squares;
      if (this.board.hasCoordinate(translatedCoordinate)) {
        yield translatedCoordinate;
      }
    }
  }

  // moves the knight symmetrically, within chessboard limits
  *move([x, y]: Coordinates2D): IterableIterator<Coordinates2D> {
    // the 8 moves an ideally placed knight K(x,y) can make are symmetrical:
    // 0 1 0 1 0
    // 1 0 0 0 1
    // 0 0 K 0 0
    // 1 0 0 0 1
    // 0 1 0 1 0
    for (let squares of [1, 2]) {
      for (let toX of this.translate(x, squares)) {
        for (let toY of this.translate(y, Knight.stride - squares)) {
          yield [toX, toY];
        }
      }
    }
  }

  // computes the length of the shortest path between two positions
  computeLeastMoves(from: Coordinates2D, to: Coordinates2D): number {
    // compute horizontal, vertical & total distance (squares) to destination
    const [Δx, Δy] = from.map((value, index) => Math.abs(value - to[index]));
    const distance = Δx + Δy;
    // the following applies to chessboards larger than 5x5,
    // which is the playing surface of an ideally placed knight:
    // 4 1 2 1 4
    // 1 2 3 2 1
    // 2 3 0 3 2
    // 1 2 3 2 1
    // 4 1 2 1 4

    // destination is inside the playing surface
    if (Δx < Knight.stride && Δy < Knight.stride) {
      return [
        0,
        3,
        // edge case: nearest diagonal move from / to corner
        Δx & 1 && (this.board.hasCorner(from) || this.board.hasCorner(to))
          ? 4
          : 2,
        1,
        4
      ][distance];
    }
    // destination is outside the playing surface
    const remainder = distance % Knight.stride;
    let moves = ~~(distance / Knight.stride);
    const offset = moves - remainder - Math.min(Δx, Δy);
    if (offset > 0) {
      moves += 2 * Math.ceil(offset / 4);
    }
    return moves + remainder;
  }

  // finds the first placement that satisfies a moves-to-destination constraint
  bestMove(
    from: Coordinates2D,
    to: Coordinates2D,
    moves: number
  ): Coordinates2D {
    if (moves) {
      for (let moveTo of this.move(from)) {
        if (this.computeLeastMoves(moveTo, to) === moves - 1) {
          return moveTo;
        }
      }
    }
    return to;
  }

  // generates the shortest path between 2 positions
  *shortestPath(
    from: Coordinates2D,
    to: Coordinates2D
  ): IterableIterator<Coordinates2D> {
    let moves = this.computeLeastMoves(from, to);
    do {
      yield from;
      from = this.bestMove(from, to, moves);
    } while (moves--);
  }
}
