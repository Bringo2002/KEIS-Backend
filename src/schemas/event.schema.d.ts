import { z } from 'zod';
export declare const CreateEventSchema: z.ZodObject<{
    date: z.ZodDate;
    title: z.ZodString;
    description: z.ZodString;
    impact: z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>;
    impactType: z.ZodEnum<["POSITIVE", "NEGATIVE", "NEUTRAL"]>;
    sectors: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<["BANKING", "TELECOMMUNICATIONS", "ENERGY", "MANUFACTURING", "AGRICULTURE", "REAL_ESTATE", "GOVERNMENT", "REGULATION", "DIVERSIFIED", "INSURANCE", "FINTECH", "RETAIL", "MEDIA", "TRANSPORT"]>, "many">>>;
    tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    source: z.ZodOptional<z.ZodString>;
    sourceUrl: z.ZodOptional<z.ZodString>;
    playerId: z.ZodOptional<z.ZodString>;
    playerIds: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    isAiExtracted: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    rawContent: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date: Date;
    description: string;
    tags: string[];
    title: string;
    impact: "LOW" | "MEDIUM" | "HIGH";
    impactType: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
    sectors: ("BANKING" | "TELECOMMUNICATIONS" | "ENERGY" | "MANUFACTURING" | "AGRICULTURE" | "REAL_ESTATE" | "GOVERNMENT" | "REGULATION" | "DIVERSIFIED" | "INSURANCE" | "FINTECH" | "RETAIL" | "MEDIA" | "TRANSPORT")[];
    isAiExtracted: boolean;
    playerIds: string[];
    source?: string | undefined;
    sourceUrl?: string | undefined;
    rawContent?: string | undefined;
    playerId?: string | undefined;
}, {
    date: Date;
    description: string;
    title: string;
    impact: "LOW" | "MEDIUM" | "HIGH";
    impactType: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
    tags?: string[] | undefined;
    sectors?: ("BANKING" | "TELECOMMUNICATIONS" | "ENERGY" | "MANUFACTURING" | "AGRICULTURE" | "REAL_ESTATE" | "GOVERNMENT" | "REGULATION" | "DIVERSIFIED" | "INSURANCE" | "FINTECH" | "RETAIL" | "MEDIA" | "TRANSPORT")[] | undefined;
    source?: string | undefined;
    sourceUrl?: string | undefined;
    isAiExtracted?: boolean | undefined;
    rawContent?: string | undefined;
    playerId?: string | undefined;
    playerIds?: string[] | undefined;
}>;
export declare const UpdateEventSchema: z.ZodObject<{
    date: z.ZodOptional<z.ZodDate>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    impact: z.ZodOptional<z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>>;
    impactType: z.ZodOptional<z.ZodEnum<["POSITIVE", "NEGATIVE", "NEUTRAL"]>>;
    sectors: z.ZodOptional<z.ZodArray<z.ZodEnum<["BANKING", "TELECOMMUNICATIONS", "ENERGY", "MANUFACTURING", "AGRICULTURE", "REAL_ESTATE", "GOVERNMENT", "REGULATION", "DIVERSIFIED", "INSURANCE", "FINTECH", "RETAIL", "MEDIA", "TRANSPORT"]>, "many">>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    source: z.ZodOptional<z.ZodString>;
    sourceUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date?: Date | undefined;
    description?: string | undefined;
    tags?: string[] | undefined;
    title?: string | undefined;
    impact?: "LOW" | "MEDIUM" | "HIGH" | undefined;
    impactType?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | undefined;
    sectors?: ("BANKING" | "TELECOMMUNICATIONS" | "ENERGY" | "MANUFACTURING" | "AGRICULTURE" | "REAL_ESTATE" | "GOVERNMENT" | "REGULATION" | "DIVERSIFIED" | "INSURANCE" | "FINTECH" | "RETAIL" | "MEDIA" | "TRANSPORT")[] | undefined;
    source?: string | undefined;
    sourceUrl?: string | undefined;
}, {
    date?: Date | undefined;
    description?: string | undefined;
    tags?: string[] | undefined;
    title?: string | undefined;
    impact?: "LOW" | "MEDIUM" | "HIGH" | undefined;
    impactType?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | undefined;
    sectors?: ("BANKING" | "TELECOMMUNICATIONS" | "ENERGY" | "MANUFACTURING" | "AGRICULTURE" | "REAL_ESTATE" | "GOVERNMENT" | "REGULATION" | "DIVERSIFIED" | "INSURANCE" | "FINTECH" | "RETAIL" | "MEDIA" | "TRANSPORT")[] | undefined;
    source?: string | undefined;
    sourceUrl?: string | undefined;
}>;
export declare const GetEventsSchema: z.ZodObject<{
    sector: z.ZodOptional<z.ZodEnum<["BANKING", "TELECOMMUNICATIONS", "ENERGY", "MANUFACTURING", "AGRICULTURE", "REAL_ESTATE", "GOVERNMENT", "REGULATION", "DIVERSIFIED", "INSURANCE", "FINTECH", "RETAIL", "MEDIA", "TRANSPORT"]>>;
    impactType: z.ZodOptional<z.ZodEnum<["POSITIVE", "NEGATIVE", "NEUTRAL"]>>;
    impactLevel: z.ZodOptional<z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>>;
    playerId: z.ZodOptional<z.ZodString>;
    from: z.ZodOptional<z.ZodDate>;
    to: z.ZodOptional<z.ZodDate>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    sector?: "BANKING" | "TELECOMMUNICATIONS" | "ENERGY" | "MANUFACTURING" | "AGRICULTURE" | "REAL_ESTATE" | "GOVERNMENT" | "REGULATION" | "DIVERSIFIED" | "INSURANCE" | "FINTECH" | "RETAIL" | "MEDIA" | "TRANSPORT" | undefined;
    impactType?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | undefined;
    playerId?: string | undefined;
    from?: Date | undefined;
    impactLevel?: "LOW" | "MEDIUM" | "HIGH" | undefined;
    to?: Date | undefined;
}, {
    sector?: "BANKING" | "TELECOMMUNICATIONS" | "ENERGY" | "MANUFACTURING" | "AGRICULTURE" | "REAL_ESTATE" | "GOVERNMENT" | "REGULATION" | "DIVERSIFIED" | "INSURANCE" | "FINTECH" | "RETAIL" | "MEDIA" | "TRANSPORT" | undefined;
    impactType?: "POSITIVE" | "NEGATIVE" | "NEUTRAL" | undefined;
    playerId?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    from?: Date | undefined;
    impactLevel?: "LOW" | "MEDIUM" | "HIGH" | undefined;
    to?: Date | undefined;
}>;
export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
export type GetEventsInput = z.infer<typeof GetEventsSchema>;
//# sourceMappingURL=event.schema.d.ts.map