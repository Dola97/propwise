import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  full_name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone_number?: string;

  // Sensitive — only persisted if x-internal: true
  @IsOptional()
  @IsString()
  @MaxLength(100)
  national_id?: string;

  @IsOptional()
  @IsString()
  internal_notes?: string;
}
