import { IsFQDN } from 'class-validator';

export class CreateWebsiteDto {
  @IsFQDN()
  domainName: string;
}
