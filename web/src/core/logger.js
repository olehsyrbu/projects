import pino from 'pino';

export let logger = pino({
  level: process.env.MIR_LOGGER_LEVEL || 'info',
  enable: process.env.MIR_LOGGER_ENABLE === 'true' || true,
});
