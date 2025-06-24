const parseArgs = async (args) => {
  try {
    const argsBuffer = [];

    args.forEach((arg) => {
      if (arg.startsWith('--')) {
        argsBuffer.push([arg.slice(2), []]);
      } else {
        const [, argValues] = argsBuffer[argsBuffer.length - 1];

        argValues.push(arg);
      }
    });

    return argsBuffer.reduce((acc, [argKey, value]) => {
      return {
        ...acc,
        [argKey]: value.join(' '),
      };
    }, {});
  } catch {
    console.error('Unsupported argument format. Use --name value');
    process.exit(1);
  }
};

export { parseArgs };
