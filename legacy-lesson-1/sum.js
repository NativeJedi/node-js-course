const { parseInput } = require("./parser");

const sum = (arr) => {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item)) {
      return acc + sum(item);
    }

    return acc + item;
  }, 0);
};

const arr = parseInput();

const result = sum(arr);

console.log(`Output is ${result}`);
