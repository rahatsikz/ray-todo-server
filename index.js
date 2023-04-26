const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.htrvoxc.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const todoCollection = client.db("ray").collection("todo");

    /* get all todos */
    app.get("/todo", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const allTodo = await todoCollection.find(query).toArray();
      const uncompleted = allTodo.filter((todo) => todo.isComplete !== true);
      res.send(uncompleted);
    });

    /* post a todo */
    app.post("/addtodo", async (req, res) => {
      const info = req.body;
      const addtodo = await todoCollection.insertOne(info);
      res.send(addtodo);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
