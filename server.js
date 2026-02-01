import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB  from "./db.js";
import statusRouter from "./routes/statusRouter.js";
import Message from "./models/message.js";
import http from "http";
import {Server} from "socket.io";
import messageRouter from "./routes/messageRouter.js";
import authRouter from "./routes/authRouter.js";
import WebSocket, {WebSocketServer} from "ws";

dotenv.config();

const app = express();
connectDB();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())

app.use("/status", statusRouter);
app.use("/uploads", express.static("uploads"));
app.use("/messages", messageRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send({messafe: "Hello World its TuChat Backend Server"})
})

const server = http.createServer(app);
const wss = new WebSocketServer({server});

wss.on("connection", (ws) => {
    console.log("The Websocket server connection succcess");

    ws.on("message", async(raw) => {
        try {
                    const payload = JSON.parse(raw.toString())
                    console.log("WS payload:", payload);
                    if(payload.type === "join" || payload.type === 'status') {
                        return
                    };
                    if(!payload.chatId || !payload.sender) {
                        console.error("Invalid message payload");
                        return;
                    }

const savedMessage = await Message.create({
    chatId: payload.chatId,
    senderId: payload.sender,
    receiverId: payload.receiver  || "unknown",
    text: payload.message  || "",
    type: payload.type || "text",
    file: payload.file || null,
});

wss.clients.forEach((client) => {
    if(client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(savedMessage));
    }
});
        }catch (err) {
            console.error("Ws parse error:", err);
        }
    });

    ws.on("close", () => {
        console.log("Gosh WebSocket client disconnected")
    });
});

const io = new Server(server, {
    cors: {origin: "*"},
});

const lives = new Map();

io.on("connection", (socket) => {
    console.log("Socket.IO (live) connected:", socket.id);

    socket.on("live-start", ({liveId}) => {
        socket.join(liveId);
        lives.set(liveId, 1);
        io.to(liveId).emit("viewer-count", 1)
    });
    socket.on("live-join", ({liveId}) => {
        socket.join(liveId);
        const count = lives.get(liveId) || 0;
        lives.set(liveId, count + 1);
        io.to(liveId).emit("viewer-count", live.get(liveId));
    });

    socket.on("offer", ({liveId, offer}) => {
        socket.to(liveId).emit("offer", {offer});
    });

    socket.on("answer", ({liveId, answer}) => {
        socket.to(liveId).emit("answer", {answer});
    });

    socket.on("ice-candidate", ({liveId, candidate}) => {
        socket.to(liveId).emit("ice-candidate", {candidate});
    });
    
    socket.on("live-end", ({liveId}) => {
        io.to(liveId).emit("live-end");
        lives.delete(liveId)
    })
    socket.on("disconnect", () => {
        lives.forEach((count, liveId) => {
            lives.set(liveId, Math.max(count -1, 0));
            io.to(liveId).emit("viewer-count", lives.get(liveId));
        });
    });
});
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend Server connected Succesfully ${PORT}`)
})