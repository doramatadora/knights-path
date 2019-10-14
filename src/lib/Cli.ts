import { createInterface as ioPrompt, Interface } from "readline";
import { Board, Errors, Cli } from "../constants";
import { Chessboard } from "./Chessboard";
import { Knight } from "./Knight";

export class PathSolver {
  private board: Chessboard;
  private knight: Knight;
  private emptyLines: number;
  public cli: Interface;

  constructor() {
    this.board = new Chessboard(Board.SIZE);
    this.knight = new Knight(this.board);
    this.cli = ioPrompt({
      input: process.stdin,
      output: process.stdout,
      prompt: Cli.PROMPT
    })
      .on("line", this.processLine.bind(this))
      .on("close", this.closeCli);
    this.emptyLines = 0;
  }

  processLine(line: string): void {
    const input = line.trim();

    // close after two consecutive empty lines
    if (!input.length) {
      return this.emptyLines++ ? this.cli.close() : this.cli.prompt();
    }

    try {
      // sanitize input
      const positions = input.split(/\s/);
      if (positions.length !== 2) {
        throw Errors.BAD_INPUT;
      }
      // transform input to Cartesian coordinates and validate
      const [from, to] = positions.map(Chessboard.notationToCoordinates);
      if (!this.board.hasPosition(from) || !this.board.hasPosition(to)) {
        throw Errors.POSITION_OUT_OF_BOUNDS;
      }
      // output shortest path
      console.log(
        Array.from(this.knight.shortestPath(from, to))
          .map(Chessboard.coordinatesToNotation)
          .join(" ")
      );
    } catch (e) {
      console.error(Cli.COLOR_RED, e.message);
    }

    this.cli.prompt();
  }

  closeCli(): void {
    this.emptyLines = 0;
    console.log(Cli.COLOR_BLUE, Cli.QUOTE);
    process.exit();
  }
}
