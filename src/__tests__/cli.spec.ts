import { Errors, Cli } from '../constants';
import { PathSolver } from '../lib/Cli';

const { BOARD_SIZE = 8 } = process.env;

describe('Knights path solver CLI', () => {
	const spies: any = {};
	let pathSolver: PathSolver;

	beforeEach(() => {
		// error
		spies.showErrorMessage = jest.spyOn(console, 'error').mockImplementation();
		// output solution
		spies.log = jest.spyOn(console, 'log').mockImplementation();
		// close CLI
		spies.exit = jest.spyOn(process, 'exit').mockImplementation();
		pathSolver = new PathSolver();
	});

	afterEach(() => {
		pathSolver.cli.close();
		jest.resetAllMocks();
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	describe('handling input', () => {
		const expectError = (e: Error): void => {
			expect(spies.log).not.toBeCalled();
			expect(spies.showErrorMessage).toBeCalledTimes(1);
			expect(spies.showErrorMessage).toBeCalledWith(Cli.COLOR_RED, e.message);
			expect(spies.exit).not.toBeCalled();
		};

		it('throws error on bad input', () => {
			pathSolver.cli.emit('line', 'bad');
			expectError(Errors.BAD_INPUT);
		});

		it('throws error for invalid position(s)', () => {
			pathSolver.cli.emit('line', `A1 B${~~BOARD_SIZE + 2}`);
			expectError(Errors.POSITION_OUT_OF_BOUNDS);
		});

		it('exits on receiving two consecutive empty lines', () => {
			pathSolver.cli.emit('line', '');
			pathSolver.cli.emit('line', '');
			expect(spies.exit).toBeCalled();
		});
	});

	describe('steps mode', () => {
		[
			{
				inputArray: [[1, 1], [1, 2]],
				outputCollection: [[[1, 1], [1, 2]]]
			}
		].map(({ inputArray, outputCollection }) => {
			it('creates an iterator of two-element arrays from an input array', () => {
				expect([
					...pathSolver.arrayToPair(inputArray)
				]).toMatchObject(outputCollection);
			});
		});
	});

	describe('pathfinding', () => {
		// candidate for Jest snapshot testing
		[
			{ input: 'D4 G7', output: ['D4 F5 G7', 'D4 E6 G7'] },
			{
				input: 'D4 D5',
				output: ['D4 E2 F4 D5', 'D4 C2 B4 D5', 'D4 E6 F4 D5', 'D4 C6 B4 D5']
			},
			// edge case: no moves
			{ input: 'A1 A1', output: ['A1'] },
			// edge case: nearest diagonal square
			{ input: 'A1 B2', output: ['A1 C2 B5 D4 B2', 'A1 B3 C5 D3 B2'] },
			// edge case: nearest horizontal or vertical square
			{ input: 'A1 A2', output: ['A1 C2 B4 A2', 'A1 B3 C1 A2'] },
			// edge case: move diagonally by 2 squares
			{
				input: 'A1 C3',
				output: [
					'A1 C2 F3 E5 D3',
					'A1 C2 A3 B5 D3',
					'A1 B3 C5 E4 C3',
					'A1 B3 C5 A4 C3'
				]
			}
		].map(({ input, output }) => {
			const moves = output[0].split(' ').length - 1;
			const problem = input.split(' ').join(' to ');
			const solutions = output.join('|');
			const solution = new RegExp(`^${solutions}`);

			it(`takes ${moves} moves from ${problem} (${solutions})`, () => {
				pathSolver.cli.emit('line', input);
				expect(spies.showErrorMessage).not.toBeCalled();
				expect(spies.log).toHaveBeenLastCalledWith(
					expect.stringMatching(solution)
				);
				expect(spies.exit).not.toBeCalled();
			});
		});
	});
});
