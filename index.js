/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});

// Definimos una estructura de datos
// (temporal hasta incorporar una base de datos)
let concesionarios = [
  {
    nombre: "Concesionario José",
    direccion: "Calle Margarita num12",
    coches: [
      { marca: "Renault", modelo: "Clio", cv: 90, precio: 16990 },
      { marca: "Nissan", modelo: "Skyline R34", cv: 280, precio: 100000 },
    ],
  },
  {
    nombre: "Concesionario María",
    direccion: "Calle Limón num25",
    coches: [
      { marca: "Ford", modelo: "Mustang", cv: 453, precio: 61150 },
      { marca: "Nissan", modelo: "Qashqai", cv: 190, precio: 30000 },
    ],
  },
  {
    nombre: "Concesionario Marcos",
    direccion: "Calle Jacinto num2",
    coches: [
      { marca: "Peugeot", modelo: "4008", cv: 130, precio: 40000 },
      { marca: "Toyota", modelo: "Yaris", cv: 120, precio: 21600 },
    ],
  },
];

// Lista todos los concesionarios
app.get("/concesionarios", (request, response) => {
  response.json(concesionarios);
});

// Añadir un nuevo concesionario
app.post("/concesionarios", (request, response) => {
  concesionarios.push(request.body);
  response.json({ message: "ok" });
});

// Obtener un solo concesionario
app.get("/concesionarios/:id", (request, response) => {
  const id = request.params.id;
  const result = concesionarios[id];
  response.json({ result });
});

// Actualizar un solo concesionarios
app.put("/concesionarios/:id", (request, response) => {
  const id = request.params.id;
  concesionarios[id] = request.body;
  response.json({ message: "ok" });
});

// Borrar un elemento del array
app.delete("/concesionarios/:id", (request, response) => {
  const id = request.params.id;
  concesionarios.splice(id, 1);

  response.json({ message: "ok" });
});

// Devuelve todos los coches del concesionario
app.get("/concesionarios/:id/coches", (request, response) => {
  const id = request.params.id;
  const result = concesionarios[id].coches;
  response.json({ result });
});

// Añadir un nuevo coche al concesionario
app.post("/concesionarios/:id/coches", (request, response) => {
  const id = request.params.id;
  concesionarios[id].coches.push(request.body);
  response.json({ message: "ok" });
});

// Obtener un solo concesionario
app.get("/concesionarios/:id/coches/:cocheid", (request, response) => {
  const id = request.params.id;
  const cocheid = request.params.cocheid;
  const result = concesionarios[id].coches[cocheid];
  response.json({ result });
});

// Actualizar un solo concesionarios
app.put("/concesionarios/:id/coches/:cocheid", (request, response) => {
  const id = request.params.id;
  const cocheid = request.params.cocheid;
  concesionarios[id].coches[cocheid] = request.body;
  response.json({ message: "ok" });
});

// Borrar un elemento del array
app.delete("/concesionarios/:id/coches/:cocheid", (request, response) => {
  const id = request.params.id;
  const cocheid = request.params.cocheid;
  concesionarios[id].coches.splice(cocheid, 1);

  response.json({ message: "ok" });
});

var variableNoUtilizada;
