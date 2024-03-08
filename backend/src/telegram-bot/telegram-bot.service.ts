import { InjectBot, Update} from "nestjs-telegraf";
import { Telegraf } from "telegraf";

export type SendMessageDto = {
    message: string;
}

@Update()
export class TelegramService {
    private bot: Telegraf;

    constructor() {
    }

    public async sendMessageToBot(token: string, chatId: number, { message }: SendMessageDto): Promise<void> {
        this.bot = new Telegraf(token);
        try {
            await this.bot.telegram.sendMessage(chatId, message)
            console.error('Success send message to bot');
        } catch (error) {
            console.error('Error sending message to bot:', error);
        }
    }
}