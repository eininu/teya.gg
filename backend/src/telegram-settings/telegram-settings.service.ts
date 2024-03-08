import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import { Repository} from "typeorm";

import {TelegramSettings} from "./entities/telegram-settings.entity";
import {CreateTelegramSettingsDto} from "./dto/create-telegram-settings.dto";

@Injectable()
export class TelegramSettingsService {
    constructor(@InjectRepository(TelegramSettings) private readonly telegramSettingsRepository: Repository<TelegramSettings>) {
    }

    public getTelegramSettings(): Promise<TelegramSettings | undefined> {
        return this.telegramSettingsRepository.createQueryBuilder('telegram-settings').getOne()
    }


    public async createSettings(dto: CreateTelegramSettingsDto): Promise<TelegramSettings | undefined> {
        const telegramSettings = await this.getTelegramSettings()

        let data = dto

        if (telegramSettings) {
            data = { ...telegramSettings, ...dto}
        }

        return this.telegramSettingsRepository.save(data)
    }
}