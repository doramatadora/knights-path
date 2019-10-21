#!/usr/bin/env node

import { PathSolver } from "./lib/Cli";

if (process.argv[2] === "--boardSize" && ~~process.argv[3]) {
  process.env.BOARD_SIZE = process.argv[3];
}

console.log(
  "Type 2 squares in algebraic notation, e.g. D4 G7. Hit return twice to exit (or ctrl+c)."
);

new PathSolver().cli.prompt();
