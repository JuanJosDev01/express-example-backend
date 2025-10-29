import 'dotenv/config';
import express from "express";
import hongosRouter from "./routes/hongos.js";
import imagenesRouter from "./routes/imagenes.js";
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";
import cors from "cors";
import { connect } from "./db/index.js";
connect();
const app = express();

// Middleware
app.use(cors({
  origin: "https://vite-example-app-blgv.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World");
});
// Routes
app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/hongos", hongosRouter);
app.use("/imagenes", imagenesRouter);

export default app;