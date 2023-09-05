const Fastify = require("fastify");
const cors = require("@fastify/cors");
const helmet = require("@fastify/helmet");
const fastifyMultipart = require("@fastify/multipart");
const fastifyStatic = require("@fastify/static");
const path = require("path");
const fileURLToPath = require("path");
const exec = require("child_process");
const fastify = Fastify({
  logger: true,
});
fastify.register(cors, { origin: "*", methods: ["POST", "GET"] });
fastify.register(fastifyMultipart);
fastify.register(helmet, {
  contentSecurityPolicy: false,
});
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "src"),
});
// Client Page
fastify.get("/", function (req, reply) {
  reply.sendFile("index.html");
});
// Install New package
fastify.get("/cmd", function (req, res) {
  const package = req.query.pkg;
  exec.exec(`yarn add ${package}`);
  res.send({ message: "Installed" });
});
// Update packages
fastify.get("/update", function (req, reply) {
  exec.exec(`yarn`);
  reply.send({ message: "Done" });
});

// Start Server
const start = async () => {
  try {
    await fastify.listen({ port: 3197 });
    const p = require('./package.json')
    console.log(p.dependencies);
  } catch (error) {
    console.error("Error", error);
    process.exit(1);
  }
};

start();
