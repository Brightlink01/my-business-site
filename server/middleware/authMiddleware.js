const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1]; // Extract the token after "Bearer "

      // Verify the token
      const decoded = jwt.verify(token, 'your-secret-key'); // Use the same secret key as in login

      // Attach the user ID from the token payload to the request object
      req.userId = decoded.userId;

      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Token is invalid or expired
      return res.status(401).json({ message: 'Not authorized, invalid token.' });
    }
  } else {
    // No token found in the Authorization header
    return res.status(401).json({ message: 'Not authorized, no token.' });
  }
};

module.exports = authMiddleware;