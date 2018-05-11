
const userService = require('../services/user.service');
import { User } from '../../src/app/model';

/**
 * getUserById
 * return user
 */
exports.getUserById = (req, res) => {
    // console.log('body---->', req.body);
    const userId = req.params.userId;


    if (!userId) {
        // Game Option is not added
        res.status(403).send('userId is not available');
        return;
    }

    userService.getUserById(userId).then((u) => {
        const dbUser = u.data();
        console.log('user--->', dbUser);
        const user = new User();
        user.displayName = (dbUser && dbUser.displayName) ? dbUser.displayName : '';
        user.location = (dbUser && dbUser.location) ? dbUser.location : '';
        user.profilePicture = (dbUser && dbUser.profilePicture) ? dbUser.profilePicture : '';
        user.userId = userId;
        console.log('userinfo--->', user);
        res.send(user);
    });
};
