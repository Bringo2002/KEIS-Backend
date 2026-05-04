import Redis from 'ioredis'
import { config } from './config'

export const redis = config.REDIS_URL
  ? new Redis(config.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    })
  : null

export default redis
