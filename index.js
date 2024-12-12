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

// Lista todos los coches
app.get("/coches", (request, response) => {
  response.json(coches);
});

// Añadir un nuevo coche
app.post("/coches", (request, response) => {
  coches.push(request.body);
  response.json({ message: "ok" });
});

// Obtener un solo coche
app.get("/coches/:id", (request, response) => {
  const id = request.params.id;
  const result = coches[id];
  response.json({ result });
});

// Actualizar un solo coche
app.put("/coches/:id", (request, response) => {
  const id = request.params.id;
  coches[id] = request.body;
  response.json({ message: "ok" });
});

// Borrar un elemento del array
app.delete("/coches/:id", (request, response) => {
  const id = request.params.id;
  coches = coches.filter((item) => coches.indexOf(item) !== id);

  response.json({ message: "ok" });
});
