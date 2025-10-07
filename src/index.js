import 'dotenv/config';
import express from "express";
import hongosRouter from "./routes/hongos.js";
import imagenesRouter from "./routes/imagenes.js";
import cors from "cors";
import { connect } from "./db/index.js";
const app = express();
// Routes
app.use("/hongos", hongosRouter);
app.use("/imagenes", imagenesRouter);


app.use(express.json());
app.use(cors('*'));

app.listen(3000, async () => {
  await connect();
  console.log("Server is running on port 3000");
});