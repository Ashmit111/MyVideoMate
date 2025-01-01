import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleAndGetSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/c/:channelId")
    .get(toggleAndGetSubscription)
    .post(toggleAndGetSubscription);


router.route("/subscribers/:channelId").get(getUserChannelSubscribers);    

router.route("/subscriberCount").get(toggleAndGetSubscription)    
router.route("/subscribedChannels").get(getSubscribedChannels)   
router.route("/channelSubscribers").get(getUserChannelSubscribers);


export default router