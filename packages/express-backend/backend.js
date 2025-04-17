import express from "express";
import cors from "cors";
import userServices from "./models/user-services.js"

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Travis!");
});

const users = {
  users_list : []
}

const findUserByNameAndJob = (name, job) => {
  return users.users_list.filter(
    (user) => (user.name === name) && (user.job === job)
  )
}

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;

  if (name != undefined && job != undefined) {
    userServices.findUserByNameAndJob(name, job)
      .then((result) => {
        result = { users_list: result };
        res.send(result)
      })
  } else if (name != undefined) {
    userServices.findUserByName(name)
      .then((result) => {
      result = { users_list: result };
      res.send(result);
      })
      .catch((error) => {
      res.status(500).send({ error: "An error occurred while fetching users." });
      });
  } else {
    res.send(users);
  }
});

app.get("/users/:_id", (req, res) => {
  const id = req.params._id;
  userServices.findUserById(id)
    .then((result) => 
      result ? res.send(result) : res.status(404).send("Resource not found.")
    )
    .catch(() => res.status(500).send("An error occurred while fetching the user."));
});

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userServices.addUser(userToAdd)
    .then((userToAdd) => {
      res.status(201).send(userToAdd)
    })
});

app.delete("/users/:_id", (req, res) => {
  const id = req.params._id;
  userServices.removeUserById(id)
    .then(() => res.send(users));
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});