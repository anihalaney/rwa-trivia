

import { UserService } from '../services/user.service';
import { ProfileImagesGenerator } from '../utils/profile-images-generator';
const userService: UserService = new UserService();
const generalAccountService = require('../services/account.service');

export class UserController {

    userService: UserService;

    constructor() {
       // this.userService = new UserService();
    }

    /**
     * getUserById
     * return user
     */
    public async getUserById(req, res) {

        const userId = req.params.userId;

        if (!userId) {
            // userId is not available
            return res.status(400).send('Bad Request');
        }
        try {
            res.status(200).send(await userService.getUserProfile(userId));
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }
    }

    /**
     * getUserImages
     * return user
     */
    public async getUserImages(req, res) {
        const userId = req.params.userId;
        const width = req.params.width;
        const height = req.params.height;


        if (!userId) {
            // userId is not available
            return res.status(400).send('Bad Request');
        }

        if (!width) {
            // width is not available
            return res.status(400).send('Bad Request');
        }

        if (!height) {
            // height is not available
            return res.status(400).send('Bad Request');
        }


        try {
            const stream = await userService.getUserProfileImage(userId, width, height);
            res.setHeader('content-disposition', 'attachment; filename=profile_image.png');
            res.setHeader('content-type', 'image/jpeg');
            res.send(stream);
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
            return error;
        }

    }

    /**
     * generateUserProfileImage
     * return status
     */
    public async generateUserProfileImage(req, res) {
        if (req.body.user.userId === req.user.uid) {
            return res.status(401).send('Unauthorized');
        }

        const user = req.body.user;

        const profileImagesGenerator: ProfileImagesGenerator = new ProfileImagesGenerator();

        try {
            if (user.profilePicture && user.croppedImageUrl && user.originalImageUrl) {

                await profileImagesGenerator.uploadProfileImage(user);

                delete user.originalImageUrl;
                delete user.croppedImageUrl;
                delete user.imageType;
            }

            await userService.updateUser(user);
            res.status(200).send({ 'status': 'Profile Data is saved !!' });

        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
        }
    }

    /**
     * updateLives
     * return status
     */
    public async updateLives(req, res) {
        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).send('Bad Request');
        }
        if (req.user.user_id !== userId) {
            return res.status(401).send('Unauthorized');
        }

        try {
            await generalAccountService.updateLives(userId);
            res.status(200).send({ 'status': 'Lives added successfully !!' });
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server error');
        }

    }

}









