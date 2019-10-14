import { createInterface as ioPrompt } from "readline";
import { Board, Errors, Cli } from "./constants";
import { Chessboard } from "./lib/Chessboard";
import { Knight } from "./lib/Knight";

const board = new Chessboard(Board.SIZE);
const knight = new Knight(board);

let emptyLines = 0;

const processLine = (line: string): void => {
  const input = line.trim();

  // close after two consecutive empty lines
  if (!input.length) {
    return emptyLines++ ? cli.close() : cli.prompt();
  }

  try {
    const positions = input.split(/\s/);
    if (positions.length !== 2) {
      throw Errors.BAD_INPUT;
    }
    const [from, to] = positions.map(Chessboard.notationToCoordinates);
    if (!board.hasPosition(from) || !board.hasPosition(to)) {
      throw Errors.POSITION_OUT_OF_BOUNDS;
    }
    console.log(
      Array.from(knight.shortestPath(from, to))
        .map(Chessboard.coordinatesToNotation)
        .join(" ")
    );
  } catch (e) {
    console.error(Cli.COLOR_RED, e.message);
  }

  cli.prompt();
};

const closeCli = (): void => {
  emptyLines = 0;
  console.log(Cli.COLOR_BLUE, Cli.QUOTE);
  process.exit();
};

export const cli = ioPrompt({
  input: process.stdin,
  output: process.stdout,
  prompt: Cli.PROMPT
})
  .on("line", processLine)
  .on("close", closeCli);
