const path = require("path");
const fs = require("fs").promises;
const File = require("../models/file");

/**
 * @description       Upload a file
 * @param {object}    req - The request object. It contains the file and the user id. { file, user }
 * @returns {object}  An object containing the file info {name, extension, mimeType, size, path, userId}
 */
exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = await File.create({
      name: req.file.originalname,
      extension: path.extname(req.file.originalname),
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      userId: req.user.id,
    });

    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @description       List all files
 * @returns {object}  An object containing the files info {files, total, currentPage, totalPages}. files is a list of files
 */
exports.list = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.page_size) || 10;
    const offset = (page - 1) * pageSize;

    const files = await File.findAndCountAll({
      where: { userId: req.user.id },
      limit: pageSize,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      files: files.rows,
      total: files.count,
      currentPage: page,
      totalPages: Math.ceil(files.count / pageSize),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @description       Get a file
 * @returns {object}  An object containing the file info
 */
exports.getFile = async (req, res) => {
  try {
    const file = await File.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @description       Download a file
 * @returns {object}  A file
 */
exports.download = async (req, res) => {
  try {
    const file = await File.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.download(file.path, file.name);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @description       Update a file
 * @param {object}    req - The request object. It contains the file and the user id. { file, user }
 * @returns {object}  An object containing the file info {name, extension, mimeType, size, path, userId}
 */
exports.update = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = await File.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete old file
    await fs.unlink(file.path);

    // Update with new file
    await file.update({
      name: req.file.originalname,
      extension: path.extname(req.file.originalname),
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    });

    res.json(file);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @description       Delete a file
 * @returns {object}  An object containing the message. {message: "File deleted successfully"}
 */
exports.delete = async (req, res) => {
  try {
    const file = await File.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    await fs.unlink(file.path);
    await file.destroy();

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
