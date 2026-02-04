import { IsString, IsOptional, IsInt, Min } from 'class-validator';

export class CreatePasteDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  ttl_seconds?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  max_views?: number;
}
