import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/^[a-zA-Z\s'-]+$/, {
    message:
      'full_name must contain only letters, spaces, hyphens, or apostrophes',
  })
  full_name: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^\+?[0-9\s\-()]{7,20}$/, {
    message: 'phone_number must be a valid phone number',
  })
  phone_number: string;

  // Sensitive — only persisted if x-internal: true
  @IsOptional()
  @IsString()
  @MaxLength(100)
  national_id?: string;

  @IsOptional()
  @IsString()
  internal_notes?: string;
}
