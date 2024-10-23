const { RateLimiterMongo } = require('rate-limiter-flexible');
const mongoose = require('mongoose');

const rateLimiter = new RateLimiterMongo({
  storeClient: mongoose.connection,
  points: 20, // 20 tasks per minute
  duration: 60, // reset every 60 seconds
  keyPrefix: 'rateLimiter',
  execEvenly: true, // Distribute points evenly
});

const rateLimiterMiddleware = async (req, res, next) =>
{
  const userId = req.body.user_id;

  if (!userId)
  {
    return res.status(400).send('User ID is required');
  }

  try
  {
    await rateLimiter.consume(userId, 1); // Consume 1 point per task
    next();
  } catch (error)
  {
    res.status(429).send('Rate limit exceeded. Task queued.');
  }
};

module.exports = rateLimiterMiddleware;
