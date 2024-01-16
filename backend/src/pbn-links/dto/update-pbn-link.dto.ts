import { PartialType } from '@nestjs/mapped-types';
import { CreatePbnLinkDto } from './create-pbn-link.dto';

export class UpdatePbnLinkDto extends PartialType(CreatePbnLinkDto) {}
