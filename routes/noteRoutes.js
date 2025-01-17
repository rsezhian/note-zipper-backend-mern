const express = require("express");
const {
  getNotes,
  createNote,
  getNoteByID,
  updateNote,
  deleteNote,
} = require("../controllers/noteControllers");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getNotes);
router.route("/create").post(protect, createNote);
router
  .route("/:id")
  .get(getNoteByID)
  .put(protect, updateNote)
  .delete(protect, deleteNote);
// router.route("/:id").put();
// router.route("/:id").delete();

module.exports = router;
