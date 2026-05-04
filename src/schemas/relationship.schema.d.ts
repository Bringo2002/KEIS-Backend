import { z } from 'zod';
export declare const CreateRelationshipSchema: z.ZodObject<{
    sourceId: z.ZodString;
    targetId: z.ZodString;
    type: z.ZodEnum<["OWNERSHIP", "DEBT", "REGULATORY", "PARTNERSHIP", "SUPPLY_CHAIN", "BOARD_INTERLOCK", "COMPETITOR", "SUBSIDIARY_OF"]>;
    label: z.ZodString;
    weight: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    direction: z.ZodDefault<z.ZodOptional<z.ZodEnum<["UNIDIRECTIONAL", "BIDIRECTIONAL"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "OWNERSHIP" | "DEBT" | "REGULATORY" | "PARTNERSHIP" | "SUPPLY_CHAIN" | "BOARD_INTERLOCK" | "COMPETITOR" | "SUBSIDIARY_OF";
    direction: "UNIDIRECTIONAL" | "BIDIRECTIONAL";
    sourceId: string;
    targetId: string;
    label: string;
    weight: number;
}, {
    type: "OWNERSHIP" | "DEBT" | "REGULATORY" | "PARTNERSHIP" | "SUPPLY_CHAIN" | "BOARD_INTERLOCK" | "COMPETITOR" | "SUBSIDIARY_OF";
    sourceId: string;
    targetId: string;
    label: string;
    direction?: "UNIDIRECTIONAL" | "BIDIRECTIONAL" | undefined;
    weight?: number | undefined;
}>;
export declare const UpdateRelationshipSchema: z.ZodObject<{
    label: z.ZodOptional<z.ZodString>;
    weight: z.ZodOptional<z.ZodNumber>;
    direction: z.ZodOptional<z.ZodEnum<["UNIDIRECTIONAL", "BIDIRECTIONAL"]>>;
}, "strip", z.ZodTypeAny, {
    direction?: "UNIDIRECTIONAL" | "BIDIRECTIONAL" | undefined;
    label?: string | undefined;
    weight?: number | undefined;
}, {
    direction?: "UNIDIRECTIONAL" | "BIDIRECTIONAL" | undefined;
    label?: string | undefined;
    weight?: number | undefined;
}>;
export declare const GetRelationshipsSchema: z.ZodObject<{
    playerId: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["OWNERSHIP", "DEBT", "REGULATORY", "PARTNERSHIP", "SUPPLY_CHAIN", "BOARD_INTERLOCK", "COMPETITOR", "SUBSIDIARY_OF"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    type?: "OWNERSHIP" | "DEBT" | "REGULATORY" | "PARTNERSHIP" | "SUPPLY_CHAIN" | "BOARD_INTERLOCK" | "COMPETITOR" | "SUBSIDIARY_OF" | undefined;
    playerId?: string | undefined;
}, {
    type?: "OWNERSHIP" | "DEBT" | "REGULATORY" | "PARTNERSHIP" | "SUPPLY_CHAIN" | "BOARD_INTERLOCK" | "COMPETITOR" | "SUBSIDIARY_OF" | undefined;
    playerId?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type CreateRelationshipInput = z.infer<typeof CreateRelationshipSchema>;
export type UpdateRelationshipInput = z.infer<typeof UpdateRelationshipSchema>;
export type GetRelationshipsInput = z.infer<typeof GetRelationshipsSchema>;
//# sourceMappingURL=relationship.schema.d.ts.map