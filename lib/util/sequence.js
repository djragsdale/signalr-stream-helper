/**
 * @async
 * @function sequence~fn
 * @param {asyncFunction} task -  The current async task to execute
 * @param {*} val - The resolved value from the previous task
 */

/*
 * All functions in tasks array MUST return a promise or be asynchronous!
 *
 * @async
 * @function sequence
 * @param {Array.<asyncFunction>} tasks - The array of asynchronous functions to sequence over
 * @param {sequence~fn} [fn=task => task()] - The function that executes each task
 */
const sequence = (tasks, fn = ((task, val) => task(val))) => tasks.reduce(
  // Have each promise wait on the previous promise, giving the option to use the resolved value
  (promise, task) => promise.then(val => fn(task, val)),
  Promise.resolve(), // Seed with a resolved promise
);

module.exports = sequence;
