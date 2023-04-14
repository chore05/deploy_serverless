import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

// Implementation of fileStogare logic
export class AttachmentUtils{
    constructor(
        private readonly s3BucketName:string = process.env.ATTACHMENT_S3_BUCKET
    ){}
    async createUploadUrl(todoId:string){
        const expireDate = process.env.SIGNED_URL_EXPIRATION;
        const uploadUrl:string = await s3.getSignedUrl(
            'putObject', {
                Bucket: this.s3BucketName,
                Key: `${todoId}-img`,
                Expires: expireDate
        })
        return uploadUrl
    }
}