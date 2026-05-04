import { Queue, Worker } from 'bullmq'
import redis from '../redis'
import { logger } from '../utils/logger'
import { EventExtractor } from '../ai/eventExtractor'
import { ProfileUpdater } from '../ai/profileUpdater'
import { RiskAnalyzer } from '../ai/riskAnalyzer'
import { EventService } from '../services/event.service'

export const aiQueue = new Queue('ai', { connection: redis })

export const aiWorker = new Worker(
  'ai',
  async (job) => {
    const { type, payload } = job.data

    logger.info(`Processing AI job: ${type}`)

    try {
      if (type === 'extract-event') {
        return await handleExtractEvent(payload as any)
      } else if (type === 'update-profile') {
        return await handleUpdateProfile(payload as any)
      } else if (type === 'analyze-risk') {
        return await handleAnalyzeRisk(payload as any)
      } else {
        throw new Error(`Unknown AI job type: ${type}`)
      }
    } catch (err: any) {
      logger.error(`AI job ${type} failed:`, err)
      throw err
    }
  },
  { connection: redis, concurrency: 5, limiter: { max: 50, duration: 60_000 } }
)

async function handleExtractEvent(payload: any) {
  const { text, url, date } = payload

  const extracted = await EventExtractor.extract(text, url)

  if (!extracted) {
    logger.info('Event not significant, skipping')
    return null
  }

  const event = await EventService.create({
    title: extracted.title,
    description: extracted.description,
    date: new Date(date),
    impact: extracted.impact as any,
    impactType: extracted.impactType as any,
    sectors: extracted.sectors as any,
    source: url,
    sourceUrl: url,
    isAiExtracted: true,
    playerIds: extracted.playerIds,
    tags: [],
  })

  logger.info(`Created event: ${event?.id}`)

  return event
}

async function handleUpdateProfile(payload: any) {
  const { playerId } = payload

  const result = await ProfileUpdater.updateProfile(playerId)

  logger.info(`Updated profile for player: ${playerId}`)

  return result
}

async function handleAnalyzeRisk(payload: any) {
  const { playerId } = payload

  const result = await RiskAnalyzer.analyzeRisk(playerId)

  logger.info(`Analyzed risk for player: ${playerId}, new risk: ${result.riskLevel}`)

  return result
}

aiWorker.on('failed', (job, err) => {
  logger.error(`AI job ${job?.id} failed:`, err)
})

export async function enqueueExtractEvent(text: string, url: string, date: Date) {
  return aiQueue.add('extract-event', { text, url, date }, { attempts: 2 })
}

export async function enqueueUpdateProfile(playerId: string) {
  return aiQueue.add('update-profile', { playerId }, { attempts: 2 })
}

export async function enqueueAnalyzeRisk(playerId: string) {
  return aiQueue.add('analyze-risk', { playerId }, { attempts: 2 })
}

export async function closeAIQueue() {
  await aiQueue.close()
  await aiWorker.close()
}
