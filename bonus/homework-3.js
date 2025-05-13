const makeTimeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const promise1 = makeTimeout(1000).then(() => {
    console.log('First promise resolved after 1 second');
});

const promise2 = makeTimeout(2000).then(() => {
    console.log('Second promise resolved after 2 second');
});

const promise3 = makeTimeout(3000).then(() => {
    console.log('Third promise resolved after 3 seconds');
});
