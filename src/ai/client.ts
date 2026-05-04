import Anthropic from '@anthropic-ai/sdk'
import { config } from '../config'

const client = config.ANTHROPIC_API_KEY
  ? new Anthropic({
      apiKey: config.ANTHROPIC_API_KEY,
    })
  : {
      messages: {
        async create() {
          throw new Error('ANTHROPIC_API_KEY is not configured')
        },
      },
    } as unknown as Anthropic

export { client }
