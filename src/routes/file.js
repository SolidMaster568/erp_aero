/**
 * @author Arsen Grigoryan
 * @email grigoryan.arsen65@gmail.com
 * @date 21.02.2025
 */
const express = require("express");
const multer = require("multer");
const { authenticateToken } = require("../middleware/auth");
const fileController = require("../controllers/fileController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.FILE_UPLOAD_PATH);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post(
  "/upload",
  authenticateToken,
  upload.single("file"),
  fileController.upload
);
router.get("/list", authenticateToken, fileController.list);
router.get("/:id", authenticateToken, fileController.getFile);
router.get("/download/:id", authenticateToken, fileController.download);
router.put(
  "/update/:id",
  authenticateToken,
  upload.single("file"),
  fileController.update
);
router.delete("/delete/:id", authenticateToken, fileController.delete);

module.exports = router;
