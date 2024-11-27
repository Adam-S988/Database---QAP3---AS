const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const PORT = 3000;

app.use(express.json());

const uri =
  "mongodb+srv://adamstevenson:prVF1W1rzyMOgjlr@Books.o03qa.mongodb.net";
const client = new MongoClient(uri);
let booksCollection;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    const database = client.db("QAP3"); // Replace 'taskManager' with your database name
    booksCollection = database.collection("Books");
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1);
  }
}

connectToDatabase();

// GET /books - Get all books
app.get("/books", async (req, res) => {
  try {
    const books = await booksCollection.find({}).toArray();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// POST /books - Add a new book to the database
app.post("/books", async (req, res) => {
  const { title, author, genre, year } = req.body;

  // Basic validation for the request body
  if (!title || !author || !genre || !year) {
    return res
      .status(400)
      .json({ error: "All fields (title, author, genre, year) are required" });
  }

  try {
    const newBook = { title, author, genre, year };
    const result = await booksCollection.insertOne(newBook); // Insert the book into MongoDB
    res.status(201).json({
      message: "Book added successfully",
      bookId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add book to the database" });
  }
});

// PUT /books/:id - Update a book's details (for example, changing the year)
app.put("/books/:id", async (req, res) => {
  const bookId = req.params.id;
  const { title, author, genre, year } = req.body;

  try {
    const result = await booksCollection.updateOne(
      { _id: new MongoClient.ObjectID(bookId) }, // Convert bookId to ObjectID
      { $set: { title, author, genre, year } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update book" });
  }
});

// DELETE /books/:id - Delete a book
app.delete("/books/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const result = await booksCollection.deleteOne({
      _id: new MongoClient.ObjectID(bookId), // Convert bookId to ObjectID
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
