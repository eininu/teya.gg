import { IsOptional, IsBoolean, IsFQDN } from 'class-validator';

export class CreatePbnSiteDto {
  @IsFQDN()
  siteName: string;
}
