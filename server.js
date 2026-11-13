const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 9)}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (/^image\/(jpeg|png|gif|webp)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("শুধু JPG, PNG, GIF অথবা WEBP ছবি আপলোড করা যাবে।"));
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(uploadDir));

app.get("/api/photos", (_req, res) => {
  const photos = fs.readdirSync(uploadDir)
    .filter(name => /\.(jpe?g|png|gif|webp)$/i.test(name))
    .map(name => ({ name, url: `/uploads/${encodeURIComponent(name)}` }))
    .sort((a, b) => b.name.localeCompare(a.name));
  res.json(photos);
});

app.post("/api/upload", upload.array("photos", 10), (req, res) => {
  res.json({ message: "ছবি সফলভাবে আপলোড হয়েছে!", uploaded: (req.files || []).length });
});

app.use((err, _req, res, _next) => {
  const message = err.code === "LIMIT_FILE_SIZE"
    ? "প্রতি ছবির সর্বোচ্চ সাইজ ১০ MB।"
    : err.code === "LIMIT_FILE_COUNT"
    ? "একসাথে সর্বোচ্চ ১০টি ছবি আপলোড করা যাবে।"
    : err.message || "আপলোড করা যায়নি।";
  res.status(400).json({ error: message });
});

app.listen(PORT, () => console.log(`MD TUMUL website running on port ${PORT}`));
