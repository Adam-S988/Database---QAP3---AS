const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const PORT = 3000;

app.use(express.json());

const uri =
  "mongodb+srv://adamstevenson:prVF1W1rzyMOgjlr@books.o03qa.mongodb.net";

async function insertBooks() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("Database-QAP3");
    const collection = database.collection("books");

    const books = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        publishedYear: 1925,
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        publishedYear: 1960,
      },
      {
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian",
        publishedYear: 1949,
      },
    ];

    const result = await collection.insertMany(books);
    console.log(`${result.insertedCount} books added successfully.`);
  } finally {
    await client.close();
  }
}

insertBooks().catch(console.error);
