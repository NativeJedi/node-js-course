import rateLimit from 'express-rate-limit';

const defaultRateLimit = rateLimit({
  windowMs: 60_000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const postRateLimit = rateLimit({
  windowMs: 60_000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const rateLimitsByMethod = {
  POST: postRateLimit,
};

const dynamicRateLimit = (req, res, next) => {
  const limiter = rateLimitsByMethod[req.method];

  if (limiter) {
    return limiter(req, res, next);
  }

  return defaultRateLimit(req, res, next);
};

export { dynamicRateLimit };
