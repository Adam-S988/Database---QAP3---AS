const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const PORT = 3000;

app.use(express.json());

const uri =
  "mongodb+srv://adambrstevenson:Pokemonn1122@qap3-books.qfu0o.mongodb.net/";
const client = new MongoClient(uri);
let tasksCollection;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    const database = client.db("taskManager"); // Replace 'taskManager' with your database name
    tasksCollection = database.collection("tasks");
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
    process.exit(1);
  }
}

let tasks = [
  { id: 1, description: "Buy groceries", status: "incomplete" },
  { id: 2, description: "Read a book", status: "complete" },
];

connectToDatabase();

// GET /tasks - Get all tasks
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await tasksCollection.find({}).toArray();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// POST /tasks - Add a new task
app.post("/tasks", (request, response) => {
  const { id, description, status } = request.body;
  if (!id || !description || !status) {
    return response
      .status(400)
      .json({ error: "All fields (id, description, status) are required" });
  }

  tasks.push({ id, description, status });
  response.status(201).json({ message: "Task added successfully" });
});

// PUT /tasks/:id - Update a task's status
app.put("/tasks/:id", (request, response) => {
  const taskId = parseInt(request.params.id, 10);
  const { status } = request.body;
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return response.status(404).json({ error: "Task not found" });
  }
  task.status = status;
  response.json({ message: "Task updated successfully" });
});

// DELETE /tasks/:id - Delete a task
app.delete("/tasks/:id", (request, response) => {
  const taskId = parseInt(request.params.id, 10);
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => t.id !== taskId);

  if (tasks.length === initialLength) {
    return response.status(404).json({ error: "Task not found" });
  }
  response.json({ message: "Task deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
