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

    /* edit a todo */
    app.patch("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const info = req.body;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: info.title,
          description: info.description,
          dueDate: info.dueDate,
        },
      };
      const updateTodo = await todoCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.send(updateTodo);
    });

    /* delete a todo */
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const deleteTodo = await todoCollection.deleteOne(query);
      res.send(deleteTodo);
    });
    /* complete status change */
    app.patch("/done/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          isComplete: true,
        },
      };
      const updateTodo = await todoCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(updateTodo);
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
