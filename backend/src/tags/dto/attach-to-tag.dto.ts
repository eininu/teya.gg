import {IsNotEmpty} from "class-validator";

export class AttachToTagDto {
    @IsNotEmpty()
    domainIds: string[];
}