import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Monitoring } from "./entities/monitoring.entity";
import {DeleteResult, Repository} from "typeorm";
import * as punycode from 'punycode';
import {getDifferenceDays, getExpiredDate} from "../common/helper";
import {addDays, differenceInDays, differenceInMonths, format} from "date-fns";
import { GetMonitoringDomains, GetMonitoringDomainsQuery, MonitoringCategory } from "./types/get-monitoring-domains.type";
import {Cron, CronExpression} from "@nestjs/schedule";
import {TelegramService} from "../telegram-bot/telegram-bot.service";
import {TelegramSettingsService} from "../telegram-settings/telegram-settings.service";

const MONITORING_DAYS = [30, 7, 2];

@Injectable()
export class MonitoringService {
    constructor(@InjectRepository(Monitoring) private readonly monitoringRepository: Repository<Monitoring>,
                private readonly telegramService: TelegramService,
                private readonly telegramSettingsService: TelegramSettingsService
                ) {
    }

    public getAll(): Promise<Monitoring[]> {
        return this.monitoringRepository.find()
    }

    public getById(id: string):  Promise<Monitoring | undefined> {
        return this.monitoringRepository.findOne({
            where: { id }
        })
    }

    public saveDomains(domains: Monitoring[]): Promise<Monitoring[]> {
        return this.monitoringRepository.save(domains)
    }

    public async getMonitoringDomains(query: GetMonitoringDomainsQuery): Promise<GetMonitoringDomains | undefined> {
        const { tag } = query
        const qb = this.monitoringRepository.createQueryBuilder('monitoring')
            .leftJoinAndSelect('monitoring.tags', 'tags')
            .orderBy('monitoring.expiredAt', 'ASC')

        if (tag) {
            tag !== 'none' &&  qb.andWhere('tags.id = :tag' , { tag })
        }

        let domains = await qb.getMany( )

        if(!domains) {
            return;
        }

        if (tag === 'none') {
            domains = domains.filter(({ tags }) => tags.length === 0 || tags === null)
        }

        const today = new Date();

        const grouped = domains.reduce((result, monitoring) => {
            const expiredDate = new Date(monitoring.expiredAt);
            const daysDifference = differenceInDays(expiredDate, today);
            const monthsDifference = differenceInMonths(expiredDate, today);
            const domain = {...monitoring, name:  punycode.toUnicode(monitoring.name)}

            if (daysDifference < 30) {
                result[MonitoringCategory.Early].push(domain);
            } else if (daysDifference >= 30 && monthsDifference < 6) {
                result[MonitoringCategory.Middle].push(domain);
            } else {
                result[MonitoringCategory.Later].push(domain);
            }

            return result;
        }, {
            [MonitoringCategory.Early]: [],
            [MonitoringCategory.Middle]: [],
            [MonitoringCategory.Later]: []
        });

        return grouped;
    }

    public async updateDomain(id: string, dto: Partial<Monitoring>): Promise<Monitoring | undefined> {
        const domain = await this.getById(id)

        if (!domain) {
            return;
        }

        const updated = { ...domain, ...dto }
        return this.monitoringRepository.save(updated)
    }

    public async updatedExpiredDate(id: string): Promise<Monitoring | undefined> {
        const domain = await this.getById(id);

        if (!domain) {
            return;
        }

        const updated = {
            ...domain,
            expiredAt: await getExpiredDate(domain.name),
        };

        return this.monitoringRepository.save(updated);
    }

    public async updateAllDates(): Promise<Monitoring[]> {
        const websites = await this.getAll();

        if (websites.length === 0 || !websites) {
            return;
        }

        const res = await Promise.all(
            websites.map(async (domain) => ({
                ...domain,
                expiredAt: await getExpiredDate(domain.name),
            })),
        );

        return this.monitoringRepository.save(res);
    }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    private async sendMessageToTgBot(): Promise<void> {
        const tg = await this.telegramSettingsService.getTelegramSettings()

        if (!tg) {
            return;
        }

        const checkingDays = MONITORING_DAYS.map((d) => format(addDays(new Date(), d), 'yyyy-MM-dd'))
        const domains = await this.monitoringRepository
            .createQueryBuilder('monitoring')
            .where('monitoring.expiredAt IS NOT NULL')
            .andWhere('DATE(monitoring.expiredAt) IN (:...days)', { days: checkingDays })
            .orderBy('monitoring.expiredAt', 'DESC')
            .getMany()

        if (!domains.length) {
            return;
        }

        const { token, chatId } = tg

        await Promise.all(domains.map(({name, expiredAt}) =>
            this.telegramService.sendMessageToBot(token, chatId, { message: `⚠️ ${name} expired at ${getDifferenceDays(expiredAt)} days` })))
    }

    public deleteDomain(id: string): Promise<DeleteResult | void> {
        return this.monitoringRepository.delete({ id })
    }
}