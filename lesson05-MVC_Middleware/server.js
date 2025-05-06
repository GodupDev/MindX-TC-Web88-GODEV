import express from "express";
import connectMongooseSever from "./database/mongooseSever.js";
import rootRouter from "./routes/routes.index.js";

connectMongooseSever(); // Kết nối tới MongoDB

const PORT = 8081;
const app = express();
app.use(express.json());

app.use("/api/v1", rootRouter);

// Server listening
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
