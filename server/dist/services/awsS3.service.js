"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
class S3 {
    constructor() {
        this.s3Client = new client_s3_1.S3Client({ region: process.env.AWS_REGION });
    }
    generateKey(file, path = 'photos/') {
        return `${path}${(0, uuid_1.v4)()}-${file.originalname}`;
    }
    generateParams(file, path = 'photos/') {
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: this.generateKey(file, path),
            Body: file.buffer,
            ContentType: file.mimetype,
            ContentDisposition: 'inline'
        };
    }
    s3Upload(file, path = 'photos/') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = this.generateParams(file, path);
                const result = yield this.s3Client.send(new client_s3_1.PutObjectCommand(params));
                const urlToAws = 'https://dmi-nfts-collection.s3.eu-north-1.amazonaws.com/';
                return { result, awsUrl: `${urlToAws}${params.Key}` };
            }
            catch (error) {
                console.error('Error uploading to S3:', error);
                throw error;
            }
        });
    }
}
exports.default = S3;
