import express from "express"
import { randomBytes } from "crypto"
import cors from "cors"
import axios from "axios"

const posts = {}

const app = express()
app.use(express.json())
app.use(cors())

app.get("/posts", (req, res) => {
  return res.send(posts)
})

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex")
  const { title } = req.body
  posts[id] = {
    id,
    title
  }
  await axios.post("http://event-bus-srv:5000/events", {
    type: "PostCreated",
    data: posts[id]
  })
  return res.status(201).send(posts[id])
})

app.post("/events", (req, res) => {
  const { type, data } = req.body
  console.log("Event Received => ", type)
  return res.send({})
})

app.listen(4001, () => {
  console.log("v245")
  console.log("Service running on port 4001")
})
