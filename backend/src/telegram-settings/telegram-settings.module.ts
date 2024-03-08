import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {TelegramSettings} from "./entities/telegram-settings.entity";
import {TelegramSettingsController} from "./telegram-settings.controller";
import {TelegramSettingsService} from "./telegram-settings.service";

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([TelegramSettings])],
    controllers: [TelegramSettingsController],
    providers: [TelegramSettingsService],
    exports: [TelegramSettingsService]
})
export class TelegramSettingsModule {}