const config = require("../utils/config");
const { createClient } = require("redis");
const hash = require("object-hash");
let redisClient = undefined;

async function initializeRedisClient() {
  redisClient = createClient({
    password: config.REDIS_PASSWORD,
    socket: {
      host: config.REDIS_HOSTNAME,
      port: config.REDIS_PORT,
    },
  }).on("error", (e) => {
    console.error(`Failed to create the Redis client with error:`);
    console.error(e);
  });

  try {
    await redisClient.connect();
    console.log(`Connected to Redis successfully!`);
  } catch (e) {
    console.error(`Connection to Redis failed with error:`);
  }
}

async function deleteCached(req) {
  if (req.path === "/") {
    await redisClient.del("admin-courses");
  } else {
    await redisClient.del("contributor");
  }
}

function requestToKey(req) {
  const keyType = req.path.split("/")[1];
  if (req.path === "/") {
    return `admin-courses`;
  } else if (keyType === "contributor") {
    return `contributor`;
  } else {
    const reqDataToHash = {
      query: req.query,
      body: req.body,
    };

    return `${req.path}@${hash.sha1(reqDataToHash)}`;
  }
}

function isRedisWorking() {
  return !!redisClient?.isOpen;
}

async function writeData(key, data) {
  try {
    await redisClient.set(
      key,
      typeof data === "object" ? JSON.stringify(data) : data,
      {
        EX: 1800,
        NX: true,
      }
    );
  } catch (e) {
    console.error(e);
  }
}

async function readData(key) {
  let cachedValue = undefined;

  cachedValue = await redisClient.get(key);
  if (cachedValue) {
    return cachedValue;
  }
}

function redisCacheMiddleware() {
  return async (req, res, next) => {
    if (isRedisWorking()) {
      const key = requestToKey(req);
      const cachedValue = await readData(key);

      if (cachedValue) {
        try {
          return res.json(JSON.parse(cachedValue));
        } catch {
          return res.send(cachedValue);
        }
      } else {
        const oldSend = res.send;
        res.send = function (data) {
          res.send = oldSend;

          if (res.statusCode === 200) {
            writeData(key, data).then();
          }

          return res.send(data);
        };
        next();
      }
    } else {
      next();
    }
  };
}

module.exports = { initializeRedisClient, deleteCached, redisCacheMiddleware };
