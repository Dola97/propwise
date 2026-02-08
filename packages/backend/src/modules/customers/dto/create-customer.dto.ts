import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  full_name: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
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
