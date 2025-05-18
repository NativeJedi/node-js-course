const ERRORS = {
  NO_INPUT: "Please, provide an input in array string format. Ex 'node sum.js \"[1, 2, 3]\"'",
  INCORRECT_FORMAT: "Incorrect input format. Please, provide an input in array string format. Ex '\"[1, 2, 3]\", \"[4, [7, 8], 9]]\"'",
}

const parseInput = () => {
  const input = process.argv[2];

  if (!input) {
    throw new Error(ERRORS.NO_INPUT);
  }

  try {
    return JSON.parse(input);
  } catch {
    throw new Error(ERRORS.INCORRECT_FORMAT);
  }
};

module.exports = {
  parseInput,
}