import {IsNotEmpty} from "class-validator";

export class UpdateLinkDto {
    @IsNotEmpty()
    public url: string;

    @IsNotEmpty()
    public text: string;
}
