import {Body, Controller, Post} from "@nestjs/common";
import {TelegramSettingsService} from "./telegram-settings.service";
import {CreateTelegramSettingsDto} from "./dto/create-telegram-settings.dto";
import {TelegramSettings} from "./entities/telegram-settings.entity";

@Controller('telegram-settings')
export class TelegramSettingsController {
    constructor(private readonly telegramSettingsService: TelegramSettingsService) {
    }

    @Post('/create-settings')
    public createSettings( @Body() dto: CreateTelegramSettingsDto):  Promise<TelegramSettings | undefined>  {
        return this.telegramSettingsService.createSettings(dto)
    }
}