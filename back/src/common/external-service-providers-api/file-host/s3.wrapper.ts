import { DeleteObjectCommandInput, GetObjectCommandInput, ListObjectsV2CommandInput, PutObjectCommandInput, S3 } from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'

/**
 * Represents a wrapper of S3 from AWS.
 * The purpose of this class is to abstract the implementation details of S3 to the API to simplify the integration tests.
 * So this class contains the business logic of the required AWS S3 API communication.
 */
export class S3Wrapper {
  private readonly s3: S3

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: <string>configService.get<string>('AWS_S3_ACCESS_KEY'),
        secretAccessKey: <string>configService.get<string>('AWS_S3_SECRET_KEY'),
      },
      region: configService.get<string>('AWS_S3_REGION'),
    })
  }

  public async putObject(args: PutObjectCommandInput): Promise<void> {
    await this.s3.putObject(args)
  }

  public async deleteObject(args: DeleteObjectCommandInput): Promise<void> {
    await this.s3.deleteObject(args)
  }

  public async getFile(args: GetObjectCommandInput): Promise<string | null> {
    const fileData = (await this.s3.getObject(args)).Body
    return fileData ? fileData.transformToString('base64') : null
  }

  public async getFileNameList(args: ListObjectsV2CommandInput): Promise<(string | undefined)[] | null> {
    const filesMetaData = await this.s3.listObjectsV2(args)

    return filesMetaData.Contents ? filesMetaData.Contents.map((value) => value.Key) : null
  }
}
