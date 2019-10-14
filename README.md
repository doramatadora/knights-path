# Knight's Path

[![CircleCI](https://circleci.com/gh/doramatadora/knights-path.svg?style=svg&circle-token=c44ed59ad9ce0611ec7b0382e1852c2d11d66731)](https://circleci.com/gh/doramatadora/knights-path)

A command line program that finds the shortest path a knight can take between two positions on a chessboard.

---

- [Quickstart](#quickstart)
- [Algorithm](#algorithm)
- [Local development](#local-development)
- [Chessboard variants](#chessboard-variants)

---

## Quickstart

You need [node](https://nodejs.org/en/) v8 or higher and [npm](https://www.npmjs.com/package/npm) v5.2 or higher to run this program.

```sh
npx knights-path
```

## Algorithm

### Assumptions

Assuming are no blocking pieces on the board

## Decisions (WIP)

- ts so I do not lose my train of thought + speed + compiler targets
- reasoning from first principles (I would not rely on intuition for prod but this is not prod and I have an idea that does not involve tree search / common path optimisation algos)
- no BFS! there IS a better way! calculus way wip, gets complicated the nearer the target is from the initial position
- I have the concept of "playing surface" and "stride" (the board is a predictable diffusion pattern that scales, dp(playingSurf, scale(Stride, symmetry))...idea can be extended to other pieces with computation less complex than knight (but symmetry is important!)
- board size 5 - 25 to avoid thinking about edge cases for teeny boards (aka error handling) or what the algebraic notation is once you are past column Z

## unstructured thoughts

### edge cases

- target = origin (0 moves)
- target inside playing surface
  4 1 2 1 4
  1 2 3 2 1
  2 3 0 3 2
  1 2 3 2 1
  4 1 2 1 4
- nearest-diagonal moves from / to corners, e.g. A1 B2 or G7 H8
  3 2 3
  2 1 4
  3 4 1
  0 3 2
- target outside playing surface but on the same vertical or horizontal as origin (shift by 2 positions)

- js is convenient & familiar ✓
- ts - let's have some annotations! ✓
- microbundle X
- jest ✓
- node >=8 ✓
- run with npx
- zero dependencies ✓
- classes + modern code, but commonjs ✓
- bfs (generate all good next moves per level) + runmin path combo? X
- ok but what of first principle reasoning, can I do this without graphs? ✓✓✓✓
- extensible ?
- generic within reason (e.g. re: board size) ✓
- min test structure with examples in task (obs: there can be more than 1 shortest path of the same length) ✓
- write docs + sense-check with someone else (leo?)

## Local development

Clone this repository and run:

1. `npm i` to install dependencies
2. `npm t` to run the [Jest](https://jestjs.io/en/) test suite
3. `npm run build` to compile the [TypeScript](https://www.typescriptlang.org/docs/home.html) source code
4. `npm start` to compile and run the program

## Chessboard variants

This program is configured for a 8x8 chessboard out of the box, and supports chessboards from 5x5 to 26x26 (using [algebraic notation](<https://en.wikipedia.org/wiki/Algebraic_notation_(chess)#Naming_the_squares>) to name the squares, from A1 through to Z26).

To change the chessboard size, set the `--boardSize` flag followed by an integer value or explicitly set the environment variable `BOARD_SIZE`:

```sh
# execute the published package
npx knights-path --boardSize 25

# run from local source code
export BOARD_SIZE=26 && npm start
```
