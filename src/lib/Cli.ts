import { createInterface as ioPrompt, Interface } from 'readline';
import { Board, Errors, Cli } from '../constants';
import { Chessboard, Coordinates2D } from './Chessboard';
import { Knight } from './Knight';

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
			.on('line', this.processLine.bind(this))
			.on('close', this.closeCli);
		this.emptyLines = 0;
	}

	*arrayToPair(inputs: Array<any>): Generator<Array<any>> {
		while (inputs.length) {
			const [from, to] = inputs;
			inputs.shift();
			if (to) {
				yield [from, to];
			}
		}
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
			if (positions.length < 2) {
				throw Errors.BAD_INPUT;
			}
			// transform input to Cartesian coordinates and validate
			const steps = positions.map(position => {
				const coordinates = Chessboard.notationToCoordinates(position);
				if (!this.board.hasPosition(coordinates)) {
					throw Errors.POSITION_OUT_OF_BOUNDS;
				}
				return coordinates;
			});
			// output shortest path between each two steps
			const coordinateArray = [...steps];
			for (let [from, to] of this.arrayToPair(coordinateArray)) {
				console.log(
					Array.from(this.knight.shortestPath(from, to))
						.map(Chessboard.coordinatesToNotation)
						.join(' ')
				);
			}
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
