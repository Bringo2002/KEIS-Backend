import { CreateIndicatorInput, UpdateIndicatorInput } from '../schemas/indicator.schema';
export declare class IndicatorService {
    static getAll(limit?: number, offset?: number): Promise<{
        data: {
            value: number;
            trend: "UP" | "DOWN" | "STABLE";
            id: string;
            name: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            source: string;
            unit: string;
            changePercent: number | null;
            asOf: Date;
            timeSeries: {
                value: number;
                date: Date;
                id: string;
                indicatorId: string;
            }[];
        }[];
        total: number;
    }>;
    static getBySlug(slug: string): Promise<{
        value: number;
        trend: "UP" | "DOWN" | "STABLE";
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        source: string;
        unit: string;
        changePercent: number | null;
        asOf: Date;
        timeSeries: {
            value: number;
            date: Date;
            id: string;
            indicatorId: string;
        }[];
    } | undefined>;
    static create(input: CreateIndicatorInput): Promise<{
        value: number;
        trend: "UP" | "DOWN" | "STABLE";
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        source: string;
        unit: string;
        changePercent: number | null;
        asOf: Date;
        timeSeries: {
            value: number;
            date: Date;
            id: string;
            indicatorId: string;
        }[];
    } | undefined>;
    static update(slug: string, input: UpdateIndicatorInput): Promise<{
        value: number;
        trend: "UP" | "DOWN" | "STABLE";
        id: string;
        name: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        source: string;
        unit: string;
        changePercent: number | null;
        asOf: Date;
        timeSeries: {
            value: number;
            date: Date;
            id: string;
            indicatorId: string;
        }[];
    } | undefined>;
    static upsertDataPoint(slug: string, date: Date, value: number): Promise<void>;
    static addPlayer(slug: string, playerId: string): Promise<void>;
    static removePlayer(slug: string, playerId: string): Promise<void>;
}
//# sourceMappingURL=indicator.service.d.ts.map