export namespace Board {
  export const SIZE = ~~(process.env.BOARD_SIZE || 8);
  // 5x5 is the playing surface of an ideally placed knight
  // setting the lower bound for board size to 5
  // works for any other pieces and avoids some edge cases for knights
  export const MIN_SIZE = 5;
  // [A-Z]: charCodes [65-90] => coordinates [1-25]
  export const MAX_SIZE = 25;
}

export namespace Errors {
  export const BAD_INPUT = new TypeError(
    "Instruction unknown. Type 2 positions in algebraic notation, e.g. D4 G7"
  );
  export const POSITION_OUT_OF_BOUNDS = new RangeError(
    `Positions out of bounds. Chessboard is ${Board.SIZE}x${Board.SIZE}`
  );
  export const BOARD_SIZE_OUT_OF_BOUNDS = new RangeError(
    `Chessboard size must be between ${Board.MIN_SIZE} and ${Board.MAX_SIZE}`
  );
  export const INVALID_POSITION = new TypeError(
    `Position must be in algebraic notation (e.g. A1)`
  );
}

export namespace Cli {
  const quotes = [
    "When you see a good move, look for a better one - Emanuel Lasker",
    "Chess is life in miniature. Chess is a struggle, chess battles. – Garry Kasparov",
    "There is no remorse like the remorse of chess.” – H. G. Wells"
  ];
  const randomQuote = quotes[~~(quotes.length * Math.random())];
  export const QUOTE = `\r\n\r\n${randomQuote}\r\n\r\n`;

  const colorize = (color: number) => `\x1b${color}m%s\x1b[0m`;
  export const COLOR_RED = colorize(31);
  export const COLOR_BLUE = colorize(36);

  export const PROMPT = "🐴 ";
}
