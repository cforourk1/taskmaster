import express from "express";
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from "#db/queries/tasks";
import requireUser from "#middleware/requireUser";

const router = express.Router();
export default router;

/*I needed to have router explained to me again. Instead of havving a massive app.js folder to handle all of the API requests, breaking them off into sections and sorting as the requests come in allows the api to function more fluidly and quickly. Router is a miniu express app - so anything I send to /tasks goes to that router and is handled there rather than getting comingled with users requests. Router param(id)  runs anytime a request has the qualifier :id added. Router param takes the parameter :id and verifies if that thing even exisits before moving on to the next section of the request. it prevents unwanted errors being thrown and handles api routing cleaner.

*/

// get tasks requires user ID
router.use(requireUser);
// get tasks
router.get("/", async (req, res) => {
  const tasks = await getTasks(req.user.id);
  res.send(tasks);
});


/* when posting a task body is required and whether or not it is done.
checks the body to make sure body and if the task is done is there




*/

router.post("/", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");
  const { title, done } = req.body;
  if (title === undefined || done === undefined)
    return res.status(400).send("Request body requires: title, done");
  const task = await createTask(title, done, req.user.id);
  res.status(201).send(task);
});

router.param("id", async (req, res, next, id) => {
  const task = await getTaskById(id);
  if (!task) return res.status(404).send("Task not found.");
  req.task = task;
  next();
});

router.put("/:id", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");
  const { title, done } = req.body;
  if (title === undefined || done === undefined)
    return res.status(400).send("Request body requires: title, done");
  if (req.task.user_id !== req.user.id) return res.status(403).send("Forbidden.");
  const task = await updateTask(req.task.id, title, done);
  res.send(task);
});

router.delete("/:id", async (req, res) => {
  if (req.task.user_id !== req.user.id) return res.status(403).send("Forbidden.");
  await deleteTask(req.task.id);
  res.sendStatus(204);
});

