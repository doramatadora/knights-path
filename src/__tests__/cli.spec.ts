import { Errors, Cli } from "../constants";
import { cli } from "../cli";

describe("Knights path solver CLI", () => {
  const spies = {
    // error
    showErrorMessage: jest.spyOn(console, "error").mockImplementation(),
    // output solution
    log: jest.spyOn(console, "log").mockImplementation(),
    // close CLI
    exit: jest.spyOn(process, "exit").mockImplementation()
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => {
    cli.close();
    jest.restoreAllMocks();
  });

  describe("handling input", () => {
    const expectError = (e: Error): void => {
      expect(spies.log).not.toBeCalled();
      expect(spies.showErrorMessage).toBeCalledTimes(1);
      expect(spies.showErrorMessage).toBeCalledWith(Cli.COLOR_RED, e.message);
      expect(spies.exit).not.toBeCalled();
    };

    it("throws error on bad input", () => {
      cli.emit("line", "some bad input");
      expectError(Errors.BAD_INPUT);
    });

    it("throws error for invalid position(s)", () => {
      cli.emit("line", "A1 X2");

      expectError(Errors.INVALID_POSITION);
    });
  });

  describe("pathfinding", () => {
    // TODO: add some edge cases
    // candidate for Jest snapshot testing, post TDD
    [
      { input: "D4 G7", output: ["D4 F5 G7", "D4 E6 G7"] },
      {
        input: "D4 D5",
        output: ["D4 E2 F4 D5", "D4 C2 B4 D5", "D4 E6 F4 D5", "D4 C6 B4 D5"]
      }
    ].map(({ input, output }) => {
      const moves = output[0].split(" ").length;
      const problem = input.split(" ").join(" to ");
      const solutions = output.join("|");
      const solution = new RegExp(`^${solutions}`);

      it(`takes ${moves} moves from ${problem} (${solutions})`, () => {
        cli.emit("line", input);
        expect(spies.showErrorMessage).not.toBeCalled();
        expect(spies.log).toHaveBeenLastCalledWith(
          expect.stringMatching(solution)
        );
        expect(spies.exit).not.toBeCalled();
      });
    });
  });
});
