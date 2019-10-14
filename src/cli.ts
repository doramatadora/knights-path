import { createInterface as ioPrompt } from "readline";
import { Errors, Cli } from "./constants";

const board = {}; // new Chessboard(BOARD_SIZE)
const knight = {}; // new Knight();

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
    const [from, to] = positions.map(
      () => {} /* make coordinates out of notations */
    );
    if (!board.hasPosition(from) || !board.hasPosition(to)) {
      throw Errors.INVALID_POSITION;
    }
    console.log(
      knight
        .shortestPath(from, to)
        .map(() => {} /* make coordinates out of notations */)
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
  prompt: "🐴 "
})
  .on("line", processLine)
  .on("close", closeCli);
