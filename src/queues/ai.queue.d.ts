import { Queue, Worker } from 'bullmq';
export declare const aiQueue: Queue<any, any, string, any, any, string>;
export declare const aiWorker: Worker<any, any, string>;
export declare function enqueueExtractEvent(text: string, url: string, date: Date): Promise<import("bullmq").Job<any, any, string>>;
export declare function enqueueUpdateProfile(playerId: string): Promise<import("bullmq").Job<any, any, string>>;
export declare function enqueueAnalyzeRisk(playerId: string): Promise<import("bullmq").Job<any, any, string>>;
export declare function closeAIQueue(): Promise<void>;
//# sourceMappingURL=ai.queue.d.ts.map