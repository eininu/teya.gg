import { IsFQDN } from 'class-validator';

export class CreateWebsiteDto {
  @IsFQDN()
  siteName: string;
}
