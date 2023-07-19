# Knight's Path

A command line program that finds the shortest path a knight can take between two positions on a chessboard.

---

- [Quickstart](#quickstart)
- [Running locally](#running-locally)
- [Algorithm](#algorithm)
- [Alternative chessboard sizes](#alternative-chessboard-sizes)

---

## Quickstart

You need [node](https://nodejs.org/en/) v8 or higher and [npm](https://www.npmjs.com/package/npm) v5.2 or higher to run this program.

```sh
npx knightp
```

The program accepts instructions in [algebraic chess notation](<https://en.wikipedia.org/wiki/Algebraic_notation_(chess)#Naming_the_squares>), comprising of two space-separated positions. For each instruction, it will print the shortest path a knight can take, e.g.:

```
🐴 D4 G7
🐴 D4 F5 G7
```

## Running locally

Clone this repository and run:

1. `npm i` to install dependencies
2. `npm t` to run the [Jest](https://jestjs.io/en/) test suite
3. `npm run build` to compile the [TypeScript](https://www.typescriptlang.org/docs/home.html) source code
4. `npm start` to compile and run the program

## Algorithm

In chess, knights [move in an L-shape](<https://en.wikipedia.org/wiki/Knight_(chess)#Placement_and_movement>): 2 squares along one dimension, 1 square along the other.

There are several ways to approach the problem of finding a knight's shortest path between two positions. For example:

### 🌳 Trees 😐

We could generate all extant moves, one step at a time, disregarding already-visited squares, until we reach the destination.

It takes at least 2 steps to move from **D4** to **G7**, via **D4 E6 G7** or **D4 F5 G7**. The complexity of this approach is illustrated below, by the sequence ♞⟶⚫⟶🔴:

![Illustration of knight moves on chessboard](https://user-images.githubusercontent.com/12828487/67173994-5a897280-f3b8-11e9-9822-6be0ea08494c.png)

### 📐 Calculus 😊

Knights move [in predictable ways](https://hookdump.github.io/chessy/). On a two-dimensional chessboard, its moves are symmetric along all axes. A knight [can reach any square\*](#assumptions) on a chessboard. We can find a [formula](src/lib/Knight.ts#L39) for the number of moves it takes to reach a square `(x,y)`.

![Knight movement patterns on an infinite chessboard](https://user-images.githubusercontent.com/12828487/67182762-c0392700-f3d7-11e9-941a-8e04b5cf99f7.png)

1. Calculate the "distance" (`Δ`) between current position **(s)** and target **(t)**
2. Consider `Δ(s,t)`
   - If `Δ=0`, the target is reached
   - If `Δ=1`, move straight to target
   - If `Δ>1`, generate a maximum of 8 possible moves **(m)** from the starting position, until one satisfies the constraint `Δ(m,t) = Δ(s,t)-1`
3. Move to **(m)**. Repeat all steps until we have reached **(t)**.

The program implements a calculus-based approach, which allows it to be extremely performant for extensions such as infinite chessboards.

### Assumptions

1. The knight moves on an 8x8 chessboard
2. There are no blocking pieces on the board
3. The optimal path between two positions is determined by the fewest moves; equivalent routes are acceptable (e.g., to get from `D4` to `G7`, `D4 F5 G7` and `D4 E6 G7` are equivalent solutions)

## Alternative chessboard sizes

This program considers a 8x8 chessboard by default, and supports chessboards from 5x5 to 26x26 (using [algebraic notation](<https://en.wikipedia.org/wiki/Algebraic_notation_(chess)#Naming_the_squares>) to name the squares, from A1 through to Z26).

To change the chessboard size, set the `--boardSize` flag followed by an integer value or explicitly set the environment variable `BOARD_SIZE`:

```sh
# execute the published package
npx knightp --boardSize 25

# run from local source code
export BOARD_SIZE=16 && npm start
```
