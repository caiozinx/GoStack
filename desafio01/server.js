const express = require("express");

const server = express();

server.use(express.json());

const projects = [
  {
    id: 1,
    title: "Gerenciador de projetos",
    tasks: []
  }
];

//***Middleware's

//Global, número de requisições;
let count = 0;

server.use((req, res, next) => {
  console.log(`Número de requisições: ${++count}`);
  next();
});

//Verificações de Id's
function middleCheckExistsID(req, res, next) {
  const { id } = req.params;
  const user = projects.filter(p => p.id == id);
  if (user.length === 0) {
    return res.status(400).json({
      Success: false,
      Message: "ID inexistente!"
    });
  }
  return next();
}

//***Rotas
server.get("/projects", (req, res, next) => {
  const response = "Get nos projects";
  return res.json(response);
});

server.post("/projects", (req, res, next) => {
  const project = req.body;
  projects.push(project);

  return res.json(projects);
});

server.put("/projects/:id", middleCheckExistsID, (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.filter(p => {
    if (p.id == id) p.title = title;
  });

  return res.json(projects);
});

server.delete("/projects/:id", middleCheckExistsID, (req, res, next) => {
  const { id } = req.params;
  projects.splice(projects.findIndex(p => p.id == id), 1);

  return res.json(projects);
});

server.post("/projects/:id/tasks", middleCheckExistsID, (req, res, next) => {
  const { id } = req.params;
  const { title } = req.body;

  projects.filter(p => {
    if (p.id == id) p.tasks.push(title);
  });

  return res.json(projects);
});

server.listen(3000);
