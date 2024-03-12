import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongooseConnection from "./mongo.js";
import appRoutes from './routes/index.js'


const port = process.env.PORT || 4000;

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


mongooseConnection();

const corsOrigin = ["http://localhost:5173"]

app.use(
    cors({
      origin: corsOrigin,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );


  app.use("/api", appRoutes);


  app.listen(port, (req, res) => {
    console.log(`Server is listening on port ${port}`);
  });

