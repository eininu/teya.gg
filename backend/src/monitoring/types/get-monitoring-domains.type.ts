import { Monitoring } from "../entities/monitoring.entity";

export enum MonitoringCategory {
    Early = "early",
    Middle = "middle",
    Later = "later"
}

export type GetMonitoringDomains = Record<MonitoringCategory, Monitoring[]>

export type GetMonitoringDomainsQuery = {
    tag?: string;
}