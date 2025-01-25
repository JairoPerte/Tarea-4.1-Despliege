/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// URL de la conexión
const uri =
  "mongodb+srv://jairopertecarras:0KDqpwXztJapX3mW@cluster0.iqta3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");
// Importar mongodb
const { MongoClient, ServerApiVersion, Db, ObjectId } = require("mongodb");
// Importar Helmet
const helmet = require("helmet");
// Importar el Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

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
    // Que también use helmet
    app.use(helmet());
    // Configuramos el Swagger
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Indicamos el puerto en el que vamos a desplegar la aplicación
    const port = process.env.PORT || 8080;

    // Obtenemos la base de datos y la colección concesionario
    const db = client.db("concesionario");
    const concesionarios = db.collection("concesionario");

    // Arrancamos la aplicación
    app.listen(port, () => {
      console.log(`Servidor desplegado en puerto: ${port}`);
    });

    // Lista todos los concesionarios
    app.get("/concesionarios", async (request, response) => {
      try {
        // Encontramos todos concesionario
        response.json(await concesionarios.find().toArray());
      } catch (e) {
        console.error("Error al listar:", e);
      }
    });

    // Añadir un nuevo concesionario
    app.post("/concesionarios", async (request, response) => {
      try {
        await concesionarios.insertOne(request.body);

        response.json({ message: "ok" });
      } catch (e) {
        console.error("Error al añadir:", e);
      }
    });

    // Obtener un solo concesionario
    app.get("/concesionarios/:id", async (request, response) => {
      try {
        // Obtenemos los datos de ruta
        const id = request.params.id;

        // Encontramos el concesionario
        // (el id es un objeto especial de MongoDB por eso lo ponemos así)
        const result = await concesionarios.findOne({ _id: new ObjectId(id) });

        response.json(result);
      } catch (e) {
        console.error("Error al obtener:", e);
      }
    });

    // Actualizar un solo concesionarios
    app.put("/concesionarios/:id", async (request, response) => {
      try {
        // Obtenemos los datos de ruta
        const id = request.params.id;

        await concesionarios.updateOne(
          { _id: new ObjectId(id) },
          { $set: request.body }
        );

        response.json({ message: "ok" });
      } catch (e) {
        console.error("Error al actualizar:", e);
      }
    });

    // Borrar un concesionario
    app.delete("/concesionarios/:id", async (request, response) => {
      try {
        // Obtenemos los datos de ruta
        const id = request.params.id;

        await concesionarios.deleteOne({ _id: new ObjectId(id) });

        response.json({ message: "ok" });
      } catch (e) {
        console.error("Error al eliminar:", e);
      }
    });

    // Devuelve todos los coches del concesionario
    app.get("/concesionarios/:id/coches", async (request, response) => {
      try {
        // Obtenemos los datos de ruta
        const id = request.params.id;

        // Encontramos el concesionario y devolvemos solo los coches
        // projection para sacar lo indicado (0 para que no aparezca en el resultado y 1 para que aparezca)
        const result = await concesionarios.findOne(
          { _id: new ObjectId(id) },
          { projection: { coches: 1, _id: 0 } }
        );

        response.json(result);
      } catch (e) {
        console.error("Error al listar:", e);
      }
    });

    // Añadir un nuevo coche al concesionario
    app.post("/concesionarios/:id/coches", async (request, response) => {
      try {
        // Obtenemos los datos de ruta
        const id = request.params.id;

        // Encontramos el concesionario y devolvemos solo los coches
        const concesionario = await concesionarios.findOne(
          { _id: new ObjectId(id) },
          { projection: { coches: 1, _id: 0 } }
        );

        // Sacamos del json coches para tratarlo como un array
        const coches = concesionario.coches;
        coches.push(request.body);

        await concesionarios.updateOne(
          { _id: new ObjectId(id) },
          { $set: { coches: coches } }
        );

        response.json({ message: "ok" });
      } catch (e) {
        console.error("Error al añadir:", e);
      }
    });

    // Obtener un solo coche
    app.get(
      "/concesionarios/:id/coches/:cocheid",
      async (request, response) => {
        try {
          // Obtenemos los datos de ruta
          const id = request.params.id;
          const cocheid = request.params.cocheid;

          // Encontramos el concesionario y devolvemos solo los coches
          const concesionario = await concesionarios.findOne(
            { _id: new ObjectId(id) },
            { projection: { coches: 1, _id: 0 } }
          );

          // Sacamos del json coches para tratarlo como un array
          const coche = concesionario.coches[cocheid];

          response.json(coche);
        } catch (e) {
          console.error("Error al obtener:", e);
        }
      }
    );

    // Actualizar un solo coche
    app.put(
      "/concesionarios/:id/coches/:cocheid",
      async (request, response) => {
        try {
          // Obtenemos los datos de ruta
          const id = request.params.id;
          const cocheid = request.params.cocheid;

          // Encontramos el concesionario y devolvemos solo los coches
          const concesionario = await concesionarios.findOne(
            { _id: new ObjectId(id) },
            { projection: { coches: 1, _id: 0 } }
          );

          // Sacamos del json coches para tratarlo como un array
          let coches = concesionario.coches;
          coches[cocheid] = request.body;

          await concesionarios.updateOne(
            { _id: new ObjectId(id) },
            { $set: { coches: coches } }
          );

          response.json({ message: "ok" });
        } catch (e) {
          console.error("Error al actualizar:", e);
        }
      }
    );

    // Borrar un coche del concesionario
    app.delete(
      "/concesionarios/:id/coches/:cocheid",
      async (request, response) => {
        try {
          // Obtenemos los datos de ruta
          const id = request.params.id;
          const cocheid = request.params.cocheid;

          // Encontramos el concesionario y devolvemos solo los coches
          const concesionario = await concesionarios.findOne(
            { _id: new ObjectId(id) },
            { projection: { coches: 1, _id: 0 } }
          );

          // Sacamos del json coches para tratarlo como un array
          let coches = concesionario.coches;
          coches.splice(cocheid, 1);

          await concesionarios.updateOne(
            { _id: new ObjectId(id) },
            { $set: { coches: coches } }
          );

          response.json({ message: "ok" });
        } catch (e) {
          console.error("Error al eliminar:", e);
        }
      }
    );
  } catch (e) {
    // Ensures that the client will close when you error
    console.error("Error al conectar con MongoDB:", e);
    await client.close();
  }
}

//LLama a la función de run y se conecta a la base de datos
run().catch(console.dir);
