import { z } from 'zod';
export declare const CreateIndicatorSchema: z.ZodObject<{
    slug: z.ZodString;
    name: z.ZodString;
    value: z.ZodNumber;
    unit: z.ZodString;
    trend: z.ZodEnum<["UP", "DOWN", "STABLE"]>;
    source: z.ZodString;
    asOf: z.ZodDate;
    changePercent: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    value: number;
    trend: "UP" | "DOWN" | "STABLE";
    name: string;
    slug: string;
    source: string;
    unit: string;
    asOf: Date;
    changePercent?: number | undefined;
}, {
    value: number;
    trend: "UP" | "DOWN" | "STABLE";
    name: string;
    slug: string;
    source: string;
    unit: string;
    asOf: Date;
    changePercent?: number | undefined;
}>;
export declare const UpdateIndicatorSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodNumber>;
    unit: z.ZodOptional<z.ZodString>;
    trend: z.ZodOptional<z.ZodEnum<["UP", "DOWN", "STABLE"]>>;
    source: z.ZodOptional<z.ZodString>;
    asOf: z.ZodOptional<z.ZodDate>;
    changePercent: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    value?: number | undefined;
    trend?: "UP" | "DOWN" | "STABLE" | undefined;
    name?: string | undefined;
    source?: string | undefined;
    unit?: string | undefined;
    changePercent?: number | undefined;
    asOf?: Date | undefined;
}, {
    value?: number | undefined;
    trend?: "UP" | "DOWN" | "STABLE" | undefined;
    name?: string | undefined;
    source?: string | undefined;
    unit?: string | undefined;
    changePercent?: number | undefined;
    asOf?: Date | undefined;
}>;
export declare const DataPointSchema: z.ZodObject<{
    date: z.ZodDate;
    value: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    value: number;
    date: Date;
}, {
    value: number;
    date: Date;
}>;
export declare const GetIndicatorsSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
}, {
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type CreateIndicatorInput = z.infer<typeof CreateIndicatorSchema>;
export type UpdateIndicatorInput = z.infer<typeof UpdateIndicatorSchema>;
export type DataPointInput = z.infer<typeof DataPointSchema>;
export type GetIndicatorsInput = z.infer<typeof GetIndicatorsSchema>;
//# sourceMappingURL=indicator.schema.d.ts.map