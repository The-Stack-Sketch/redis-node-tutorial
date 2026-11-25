import express from "express";
import "./redis.js";
import { events } from "./routes/events.js";

const app = express();
app.use(express.json());
app.use(events);

app.listen(3000, () => console.log("API listening on http://localhost:3000"));
