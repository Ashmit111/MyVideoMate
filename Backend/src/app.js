import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();

// Middleware setup
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// WebSocket integration
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST", "PATCH"],
        credentials: true
    }
});

// Manage connected users
const connectedUsers = {};

// Handle WebSocket connections
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // Register user by their ID
    socket.on("register", (userId) => {
        connectedUsers[userId] = socket.id;
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        for (const [userId, socketId] of Object.entries(connectedUsers)) {
            if (socketId === socket.id) {
                delete connectedUsers[userId];
                break;
            }
        }
    });
});

// Middleware to pass `io` instance to all routes/controllers
app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers; // Make connected users available
    next();
});

// Routes import
import userRouter from './routes/user.routes.js';
import healthcheckRouter from "./routes/healthcheck.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import videoRouter from "./routes/video.routes.js";
import commentRouter from "./routes/comment.routes.js";
import likeRouter from "./routes/like.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js"; 

// Routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter); 

// Export the app
export { app }; 