const express = require("express");
const dotenv = require("dotenv").config();
const notes = require("./data/notes");
const connectDB = require("./config/dbConn");
const cors = require("cors");
const userRoute = require("./routes/userRoutes");
const noteRoute = require("./routes/noteRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddlewares");

const app = express();
const port = process.env.PORT || 3001;

connectDB();

// middleware
app.use(express.json());
app.use(cors());

// app.get("/", (req, res, next) => {
//   res.send("Welcome to the Note Zipper MERN Project");
// });

// app.get("/api/notes", (req, res, next) => {
//   res.send(notes);
//   // res.json(notes);
// });

app.use("/api/users", userRoute);
app.use("/api/notes", noteRoute);

app.use(notFound);
app.use(errorHandler);

//
//
//
//
// app.get("/api/notes/:id", (req, res, next) => {
//   const note = notes.find((n) => n._id === req.params.id);
//   res.send(note);
// });
//
//
//
app.listen(port, () => {
  console.log(`SERVER is listening on the port ${port}`);
});
