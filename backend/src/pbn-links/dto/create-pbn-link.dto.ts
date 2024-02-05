import {IsFQDN, IsNotEmpty} from "class-validator";

export class CreatePbnLinkDto {
    @IsFQDN()
    @IsNotEmpty()
    website: string;
}
