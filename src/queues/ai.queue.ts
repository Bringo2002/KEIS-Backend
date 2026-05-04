import { Queue, Worker } from 'bullmq'
import redis from '../redis'
import { logger } from '../utils/logger'
import { EventExtractor } from '../ai/eventExtractor'
import { ProfileUpdater } from '../ai/profileUpdater'
import { RiskAnalyzer } from '../ai/riskAnalyzer'
import { EventService } from '../services/event.service'

export const aiQueue = redis ? new Queue('ai', { connection: redis }) : null

export const aiWorker = redis
  ? new Worker(
      'ai',
      async (job) => {
        const { type, payload } = job.data as { type: string; payload: Record<string, unknown> }

        logger.info(`Processing AI job: ${type}`)

        try {
          if (type === 'extract-event') {
            return await handleExtractEvent(payload as ExtractEventPayload)
          }
          if (type === 'update-profile') {
            return await handleUpdateProfile(payload as { playerId: string })
          }
          if (type === 'analyze-risk') {
            return await handleAnalyzeRisk(payload as { playerId: string })
          }
          throw new Error(`Unknown AI job type: ${type}`)
        } catch (err: unknown) {
          logger.error(`AI job ${type} failed:`, err)
          throw err
        }
      },
      { connection: redis, concurrency: 5, limiter: { max: 50, duration: 60_000 } }
    )
  : null

type ExtractEventPayload = { text: string; url: string; date: string }

async function handleExtractEvent(payload: ExtractEventPayload) {
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

async function handleUpdateProfile(payload: { playerId: string }) {
  const { playerId } = payload

  const result = await ProfileUpdater.updateProfile(playerId)

  logger.info(`Updated profile for player: ${playerId}`)

  return result
}

async function handleAnalyzeRisk(payload: { playerId: string }) {
  const { playerId } = payload

  const result = await RiskAnalyzer.analyzeRisk(playerId)

  logger.info(`Analyzed risk for player: ${playerId}, new risk: ${result.riskLevel}`)

  return result
}

aiWorker?.on('failed', (job, err) => {
  logger.error(`AI job ${job?.id} failed:`, err)
})

export async function enqueueExtractEvent(text: string, url: string, date: Date) {
  return aiQueue?.add(
    'extract-event',
    { type: 'extract-event', payload: { text, url, date: date.toISOString() } },
    { attempts: 2 }
  )
}

export async function enqueueUpdateProfile(playerId: string) {
  return aiQueue?.add('update-profile', { type: 'update-profile', payload: { playerId } }, { attempts: 2 })
}

export async function enqueueAnalyzeRisk(playerId: string) {
  return aiQueue?.add('analyze-risk', { type: 'analyze-risk', payload: { playerId } }, { attempts: 2 })
}

export async function closeAIQueue() {
  await aiQueue?.close()
  await aiWorker?.close()
}
