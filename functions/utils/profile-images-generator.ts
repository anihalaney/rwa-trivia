import {
    User
} from '../../projects/shared-library/src/lib/shared/model';
const profileImagesUserService = require('../services/user.service');
const stream = require('stream');
const sharp = require('sharp');

export class ProfileImagesGenerator {


    private userDict: { [key: string]: number };
    basePath = '/profile';
    profileImagePath = 'avatar';

    constructor() {
        this.userDict = {};
    }

    public fetchUsers(): Promise<any> {
        return profileImagesUserService.getUsers()
            .then(users => {
                const userImagesPromises = [];
                users.docs.map(user => {
                    const userObj: User = user.data();
                    if (userObj.userId && userObj.profilePicture) {
                        userImagesPromises.push(this.getStoredImage(userObj.userId, userObj.profilePicture, undefined));
                    }
                });
                return Promise.all(userImagesPromises)
                    .then((userImagesResults) => userImagesResults)
                    .catch((e) => {
                        console.log('user images generator error', e);
                    });
            });
    }

    public uploadCroppedImage(userId: string,cropperImageUrl: any,  profileImageUrl: String, croppedImageType: string): Promise<string> {
       
        const filePath = `${this.basePath}/${userId}/${this.profileImagePath}/${profileImageUrl}`;
        cropperImageUrl=cropperImageUrl.replace(/^data:image\/\w+;base64,/, '');
        const bufferStream = new Buffer(cropperImageUrl, 'base64');
 
        return profileImagesUserService
        .uploadProfileImage(bufferStream, croppedImageType, filePath).then((status) => {
            console.log('status', status);
            return this.getStoredImage(userId, profileImageUrl, croppedImageType).then((uploadStatus) => uploadStatus).catch((e) => {
                console.log('images generator error', e);
            });
        }).catch((e) => {
            console.log('images generator error', e);
        });
    }

    public getStoredImage(userId: string, profileImageUrl: String, croppedImageType: string): Promise<string> {
        const imagesPromises = [];
        return profileImagesUserService.generateProfileImage(userId, profileImageUrl).then((stream) => {
            imagesPromises.push(this.resizeImage(userId, profileImageUrl, stream,croppedImageType, 263, 263));
            imagesPromises.push(this.resizeImage(userId, profileImageUrl, stream,croppedImageType, 70, 60));
            imagesPromises.push(this.resizeImage(userId, profileImageUrl, stream,croppedImageType, 44, 40));
            return Promise.all(imagesPromises)
                .then((imagesResults) => imagesResults)
                .catch((e) => {
                    console.log('images generator error', e);
                });
        });
    }

    private resizeImage(userId: string, profileImageUrl: String, stream: any,croppedImageType: string, width: Number, height: Number): Promise<string> {
        const filePath = `profile/${userId}/avatar/${width}*${height}/${profileImageUrl}`;
        croppedImageType=(croppedImageType)?croppedImageType:stream.mimetype;
       // console.log('mimetype',croppedImageType);
        return sharp(stream)
            .resize(width, height)
            .toBuffer()
            .then(data => {
              
                return profileImagesUserService
                    .uploadProfileImage(data, croppedImageType, filePath).then((file) => {
                        return `${userId} with dimensions ${width}*${height} file is uploaded successfully`;
                    });
            })
            .catch(err => {
                console.log('error-->', err);
                return err;
            });
    }

}
