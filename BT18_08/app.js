const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/profile", (req, res) => {
  res.json({
    name: "Trần Thanh Nhã",
    age: 21,
    school: "Đại học Sư phạm Kỹ thuật TP.HCM",
    description: "Ngành công nghệ thông tin"
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
