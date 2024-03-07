const checkAdmin = (req, res, next) => {
    if (req.decoded && req.decoded.result.role === 'admin') {
      next();
    } else {
      return res.status(403).json({
        success: 0,
        message: "Access Denied! Only admin can perform this operation"
      });
    }
  };
  

module.exports = { checkAdmin };