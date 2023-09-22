import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsPositive, Length, Max, MaxLength, Min, ValidateNested } from 'class-validator'
import { IsBase64File } from '@Common/class-operations/validators/base64-file.validator'
import { PublicFileDTO } from '@Common/request-io/request-dto/public-file.dto'
import { FlexibleDateTimeRangeDTO } from '@/common/request-io/request-dto/date-time-range.dto'
import { LenientAddressDTO, StrictAddressDTO } from '@Common/request-io/request-dto/address.dto'
import { Type } from 'class-transformer'

export class RealisationRequest {
  @IsOptional()
  @IsNumber()
  @Min(0)
  id?: number

  @IsOptional()
  @IsArray()
  @IsBase64File({ each: true })
  newFiles?: TBase64File[]

  @IsNotEmpty()
  @Length(1, 50, { message: 'Le titre des réalisations ne doit pas dépasser 50 caractères' })
  title!: string

  @IsNotEmpty()
  @Length(1, 1000, { message: 'La description des réalisations ne doit pas dépasser 1000 caractères' })
  description!: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PublicFileDTO)
  files: PublicFileDTO[] = []
}

export class CompanyRequest {
  @IsNotEmpty()
  @Length(1, 50, { message: 'Le numéro de SIRET est trop long' })
  siret!: string

  @IsNotEmpty()
  @Length(1, 50, { message: 'La forme légale est trop longue' })
  legalForm!: string

  @IsNotEmpty()
  @Length(1, 50, { message: 'La dénomination est trop longue' })
  denomination!: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => StrictAddressDTO)
  legalAddress!: StrictAddressDTO

  @IsNotEmpty()
  @Length(1, 50, { message: 'Le naf est trop long' })
  naf!: string
}

export class ProfessionalExperienceRequest {
  @IsOptional()
  @IsNumber()
  @Min(0)
  id?: number

  @IsNotEmpty()
  @Length(1, 50, { message: "L'entreprise des expériences ne doit pas dépasser 50 caractères" })
  enterprise!: string

  @IsNotEmpty()
  @Length(1, 100, { message: 'Le rôle des expériences ne doit pas dépasser 100 caractères' })
  role!: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FlexibleDateTimeRangeDTO)
  dateRange!: FlexibleDateTimeRangeDTO
}

export class StudyRequest {
  @IsOptional()
  @IsNumber()
  @Min(0)
  id?: number

  @IsNotEmpty()
  @Length(1, 50, { message: "Le nom de l'école des formations ne doit pas dépasser 50 caractères" })
  schoolName!: string

  @IsOptional()
  @ValidateNested()
  @Type(() => LenientAddressDTO)
  schoolAddress?: LenientAddressDTO

  @IsNotEmpty()
  @Length(1, 100, { message: 'Le nom du diplôme des formations ne doit pas dépasser 100 caractères' })
  grade!: string

  @IsOptional()
  @Length(0, 1000, { message: 'La description des formations ne doit pas dépasser 1000 caractères' })
  description?: string

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => FlexibleDateTimeRangeDTO)
  dateRange!: FlexibleDateTimeRangeDTO
}

export class Fields {
  @IsOptional()
  @Length(2, 50, { message: 'Votre nom commercial doit avoir une taille comprise entre 2 et 50 caractères' })
  businessName?: string

  @IsOptional()
  @IsBase64File()
  businessPicture?: TBase64File

  @IsOptional()
  @Length(10, 1000, { message: 'Votre présentation doit avoir une taille comprise entre 10 et 1000 caractères' })
  businessPresentation?: string

  @IsOptional()
  @IsPositive({ message: 'La valeur de votre taux horaire doit être positif' })
  averageHourlyRate?: number

  @IsOptional()
  @IsPositive({ message: 'La distance de déplacement max doit être positive' })
  @Max(200, { message: 'La distance de déplacement max ne doit pas être supérieur à 200km' })
  maxTravelDistance?: number

  @IsOptional()
  @MaxLength(50, { message: 'La disponibilité moyenne est trop longue' })
  averageAvailability?: string

  @IsOptional()
  @ValidateNested()
  @Type(() => StrictAddressDTO)
  workAddress?: StrictAddressDTO

  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyRequest)
  company?: CompanyRequest

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RealisationRequest)
  realisations?: RealisationRequest[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProfessionalExperienceRequest)
  professionalExperiences?: ProfessionalExperienceRequest[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudyRequest)
  studies?: StudyRequest[]

  @IsOptional()
  @IsArray()
  skillIds?: string[]

  @IsOptional()
  @IsBase64File()
  curriculum?: TBase64File

  @IsOptional()
  @IsBase64File()
  insurance?: TBase64File
}
