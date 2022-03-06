/**
 * Returns the async function as promise to attach next and catch errors.
 * @param {function} fn - function passed.
 * @return - async function
 */
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
