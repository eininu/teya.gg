import {IsNotEmpty} from "class-validator";

export type TagAction = 'edit' | 'add' | 'delete' | 'attach' | 'unpin'

export class UpdateTagDto {
    @IsNotEmpty()
    public name: string;
}
