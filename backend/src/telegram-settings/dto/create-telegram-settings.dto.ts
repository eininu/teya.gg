import {IsNotEmpty} from "class-validator";

export class CreateTelegramSettingsDto {
    @IsNotEmpty()
    token: string;

    @IsNotEmpty()
    chatId: number;
}