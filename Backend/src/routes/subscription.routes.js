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

router.route("/cs/:channelId").get(getSubscribedChannels)   
router.route("/u/:subscriberId").get(getUserChannelSubscribers);

export default router