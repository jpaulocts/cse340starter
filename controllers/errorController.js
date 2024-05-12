exports.triggerError = (req, res, next) => {
    try {
      // Simulate an intentional error (division by zero)
      const result = 1 / 0;
      res.send(result);
    } catch (err) {
      next(err); // Pass the error to the error handling middleware
    }
  };