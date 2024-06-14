const expressAsyncHandler = require("express-async-handler");
const Note = require("../models/noteModel");

const getNotes = expressAsyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
});

const createNote = expressAsyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content || !category) {
    res.status(400);
    throw new Error("Please fill all the fields");
  } else {
    const note = new Note({ user: req.user._id, title, content, category });
    const createdNote = await note.save();
    res.status(201).json(createdNote);
  }
});

const getNoteByID = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);
  if (note) {
    res.json(note);
  } else {
    res.status(400).json({ message: "Note not found" });
  }
});

const updateNote = expressAsyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  const id = req.params.id;
  const note = await Note.findById(id);
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You can't perform this action");
  }
  if (note) {
    note.title = title;
    note.content = content;
    note.category = category;
    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error("Note not found");
  }
});

const deleteNote = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById(id);
  if (note.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("you con't perform this action");
  }
  if (note) {
    await note.deleteOne();
    res.json({ message: "note removed successfully" });
  } else {
    res.status(404);
    throw new Error("note not found");
  }
});

module.exports = { getNotes, createNote, getNoteByID, updateNote, deleteNote };
