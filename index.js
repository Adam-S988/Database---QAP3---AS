const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const PORT = 3000;

app.use(express.json());

const uri =
  "mongodb+srv://adambrstevenson:Pokemonn1122@qap3-books.qfu0o.mongodb.net/";
const client = new MongoClient(uri);
let booksCollection;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    const database = client.db("taskManager"); // Replace 'taskManager' with your database name
    booksCollection = database.collection("books");
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1);
  }
}

let books = [
  {
    id: 1,
    title: "The Hobbit",
    author: "J. R. R. Tolken",
    genre: "Fantasy",
    year: "1937",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    year: "1960",
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    year: "1949",
  },
];

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

// POST /books - Add a new task
app.post("/books", (request, response) => {
  const { id, description, status } = request.body;
  if (!id || !description || !status) {
    return response
      .status(400)
      .json({ error: "All fields (id, description, status) are required" });
  }

  books.push({ id, description, status });
  response.status(201).json({ message: "Task added successfully" });
});

// PUT /books/:id - Update a task's status
app.put("/books/:id", (request, response) => {
  const taskId = parseInt(request.params.id, 10);
  const { status } = request.body;
  const task = books.find((t) => t.id === taskId);

  if (!task) {
    return response.status(404).json({ error: "Task not found" });
  }
  task.status = status;
  response.json({ message: "Task updated successfully" });
});

// DELETE /books/:id - Delete a task
app.delete("/books/:id", (request, response) => {
  const taskId = parseInt(request.params.id, 10);
  const initialLength = books.length;
  books = books.filter((t) => t.id !== taskId);

  if (books.length === initialLength) {
    return response.status(404).json({ error: "Task not found" });
  }
  response.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
