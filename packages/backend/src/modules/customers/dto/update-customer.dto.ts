import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message:
      'full_name must contain only letters, spaces, hyphens, or apostrophes',
  })
  full_name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Matches(/^\+?[0-9\s\-()]{7,20}$/)
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
