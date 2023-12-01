import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { v4 as uuid } from 'uuid'

class S3 {
    private s3Client: S3Client;
  
    constructor() {
      this.s3Client = new S3Client({ region: process.env.AWS_REGION });
    }
  
    private generateKey(file: Express.Multer.File, path: string = 'photos/'): string {
      const justInCase = file.originalname.replace(/ /g, '%2B')
      return `${path}-${justInCase}`;
    }
  
    private generateParams(file: Express.Multer.File, path: string = 'photos/') {
      return {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: this.generateKey(file, path),
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
        CacheControl: 'no-store'
      };
    }
  
    public async s3Upload(file: Express.Multer.File, path: string = 'photos/') {
      try {
        const params = this.generateParams(file, path);
        const result = await this.s3Client.send(new PutObjectCommand(params));
        const urlToAws = 'https://dmi-nfts-collection.s3.eu-north-1.amazonaws.com/'
        return { result, awsUrl: `${urlToAws}${params.Key}` };
      } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error; 
      }
    }

  }
  
  export default S3;