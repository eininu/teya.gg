import {Global, Module} from "@nestjs/common";
import { TelegrafModule } from "nestjs-telegraf";
import { TelegramService } from "./telegram-bot.service";

const env = process.env

@Global()
@Module({
    imports: [TelegrafModule.forRoot({
        token: env.TELEGRAM_BOT_TOKEN || '',
    })],
    providers: [TelegramService],
    exports: [TelegramService],
})
export class TelegramModule {}