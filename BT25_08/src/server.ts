import express, { Application } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDB, sequelize } from "./config/db"; 
import webRoutes from "./routes/web";

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", "./src/views");

// ✅ Kết nối MySQL
connectDB();

// ✅ Sync DB (tạo bảng nếu chưa có, update schema nếu khác)
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Database synced"))
  .catch((err: Error) => console.error("❌ Sync error:", err));

// ✅ Routes
app.use("/", webRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
