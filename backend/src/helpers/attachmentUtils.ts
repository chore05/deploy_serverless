// import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
const AWS = require('aws-sdk')
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

// Implementation of fileStogare logic
export class AttachmentUtils{
    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4'}),
        private readonly s3BucketName = process.env.ATTACHMENT_S3_BUCKET,
        private readonly expireDate: number = Number(process.env.SIGNED_URL_EXPIRATION)
    ){}

    createUploadUrl(todoId: string): string {
        return this.s3.getSignedUrl('putObject', {
                Bucket: this.s3BucketName,
                Key: todoId,
                Expires: this.expireDate
        })
        
    }
}