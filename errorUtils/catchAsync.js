module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};

// or alternative (traditional way)

// function catchAsync(fn) {
//     return function (req, res, next) {
//         fn(req, res, next).catch(next);
//     }
// }

// module.exports = catchAsync;
