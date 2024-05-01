import express, { json } from "express";
import cors from "cors";
import { v4 } from "uuid";
import http from "http";
const app = express();
const server = http.createServer(app);

const sessions = [];

app.use(json());
app.use(cors());

app.get("/whiteboard/all", (req, res) => {
  const simplifiedSessions = sessions.map((session) => ({
    sessionId: session.sessionId,
    canvasName: session.canvasName,
  }));

  res.json(simplifiedSessions);
});

app.get("/whiteboard/new", (req, res) => {
  const sessionId = v4();
  sessions.push({
    sessionId: sessionId,
    canvasName: "Untitled Whiteboard",
    canvasData: {},
  });
  res.json({ sessionId });
});

app.get("/whiteboard/:sessionId", (req, res) => {
  const sessionId = req.params.sessionId;
  const sessionData = sessions.find(
    (session) => session.sessionId === sessionId
  );

  if (!sessionData) {
    res.status(404).send("Session not found");
    return;
  }

  res.json({
    sessionId: sessionData.sessionId,
    canvasData: sessionData.canvasData,
    canvasName: sessionData.canvasName,
  });
});

app.post("/whiteboard/:sessionId/save", async (req, res) => {
  const sessionId = req.params.sessionId;
  console.log(sessionId);
  const { canvasData, canvasName } = req.body;
  const session = sessions.find((session) => session.sessionId === sessionId);
  if (!session) {
    res.status(404).send("Session not found");
    return;
  }
  session.canvasData = canvasData;
  session.canvasName = canvasName;
  console.log(session);
  res.status(200).json({ message: "Canvas data saved successfully" });
});

server.listen(3000, () => {
  console.log("listening on PORT 3000");
});
