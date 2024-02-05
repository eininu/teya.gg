import {IsNotEmpty} from "class-validator";

export class CreateLinkDto {
    @IsNotEmpty()
    public url: string;

    @IsNotEmpty()
    public text: string;
}
