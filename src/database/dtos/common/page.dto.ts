import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional } from "class-validator";
import { PageMetaDto } from "./page-meta.dto";

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @IsOptional()
  @ApiProperty({ isArray: true, required: false })
  readonly subdata?: any[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly pagination: PageMetaDto;

  constructor(data: T[], pagination: PageMetaDto, subdata?: any[]) {
    this.data = data;
    this.subdata = subdata;
    this.pagination = pagination;
  }
}