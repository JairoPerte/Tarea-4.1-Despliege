/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importar mongodb
const { MongoClient, ServerApiVersion, Db } = require("mongodb");

// URL de la conexión
const uri =
  "mongodb+srv://jairopertecarras:<db_password>@cluster0.iqta3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Conectado al MongoDB");

    // Código de la API
    // Inicializamos la aplicación
    const app = express();

    // Indicamos que la aplicación puede recibir JSON (API Rest)
    app.use(express.json());

    // Indicamos el puerto en el que vamos a desplegar la aplicación
    const port = process.env.PORT || 8080;

    const db = client.db("concesionario");
    const concesionarios = db.collection("concesionario");

    // Arrancamos la aplicación
    app.listen(port, () => {
      console.log(`Servidor desplegado en puerto: ${port}`);
    });

    // Lista todos los concesionarios
    app.get("/concesionarios", (request, response) => {
      response.json(concesionarios.find());
    });

    // Añadir un nuevo concesionario
    app.post("/concesionarios", (request, response) => {
      concesionarios.insertOne(request.body);
      response.json({ message: "ok" });
    });

    // Obtener un solo concesionario
    app.get("/concesionarios/:id", (request, response) => {
      const id = request.params.id;
      const result = concesionarios.findOne({ _id: id });
      response.json({ result });
    });

    // Actualizar un solo concesionarios
    app.put("/concesionarios/:id", (request, response) => {
      const id = request.params.id;
      concesionarios.updateOne({ _id: id }, request.body);
      response.json({ message: "ok" });
    });

    // Borrar un elemento del array
    app.delete("/concesionarios/:id", (request, response) => {
      const id = request.params.id;
      concesionarios.deleteOne({ _id: id });

      response.json({ message: "ok" });
    });

    // Devuelve todos los coches del concesionario
    app.get("/concesionarios/:id/coches", (request, response) => {
      const id = request.params.id;
      //0 para que no aparezca en el resultado y 1 para que aparezca
      const result = concesionarios.findOne({ _id: id }, { coches: 1, _id: 0 });
      response.json({ result });
    });

    // Añadir un nuevo coche al concesionario
    app.post("/concesionarios/:id/coches", (request, response) => {
      const id = request.params.id;
      let coches = concesionarios.findOne({ _id: id }, { coches: 1, _id: 0 });
      coches.push(request.body);
      concesionarios.updateOne({ _id: id }, { $set: { coches: coches } });
      response.json({ message: "ok" });
    });

    // Obtener un solo coche
    app.get("/concesionarios/:id/coches/:cocheid", (request, response) => {
      const id = request.params.id;
      const cocheid = request.params.cocheid;
      const result = concesionarios.findOne({ _id: id }, { coches: 1, _id: 0 })[
        cocheid
      ];
      response.json({ result });
    });

    // Actualizar un solo coche
    app.put("/concesionarios/:id/coches/:cocheid", (request, response) => {
      const id = request.params.id;
      const cocheid = request.params.cocheid;
      let coches = concesionarios.findOne({ _id: id }, { coches: 1, _id: 0 });
      coches[cocheid] = request.body;
      concesionarios.updateOne({ _id: id }, { $set: { coches: coches } });

      response.json({ message: "ok" });
    });

    // Borrar un elemento del array
    app.delete("/concesionarios/:id/coches/:cocheid", (request, response) => {
      const id = request.params.id;
      const cocheid = request.params.cocheid;
      let coches = concesionarios.findOne({ _id: id }, { coches: 1, _id: 0 });
      coches.splice(cocheid, 1);
      concesionarios.updateOne({ _id: id }, { $set: { coches: coches } });

      response.json({ message: "ok" });
    });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

//LLama a la función de run y se conecta a la base de datos
run().catch(console.dir);
