const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const pgp = require("pg-promise")();

const port = process.env.PORT || 5200;

const backendURL = "http://192.168.0.65";

const db = pgp({
  connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
});

app.use(cors());
app.use(express.json());

app.get("/get-tasks", async (req, res) => {
  try {
    const tasks = await db.any("SELECT * FROM messages ORDER BY id DESC");
    res.json(tasks);
  } catch (error) {
    console.error("Błąd pobierania zadań:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.post("/add-task", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Treść zadania jest wymagana" });
    }

    const newTask = await db.one(
      "INSERT INTO messages (content) VALUES ($1) RETURNING *",
      [content]
    );
    res.json(newTask);
  } catch (error) {
    console.error("Błąd dodawania zadania:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.delete("/delete-task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.none("DELETE FROM messages WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Błąd usuwania zadania:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.patch("/edit-task/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Treść zadania jest wymagana" });
    }

    await db.none("UPDATE messages SET content = $1 WHERE id = $2", [
      content,
      id,
    ]);
    res.json({ success: true });
  } catch (error) {
    console.error("Błąd edycji zadania:", error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.listen(port, () => {
  console.log(`Serwer działa na ${backendURL}:${port}`);
});
