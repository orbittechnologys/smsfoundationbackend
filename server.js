import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongooseConnection from "./mongo.js";
import appRoutes from './routes/index.js'
import fs from 'fs';


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

  app.get("/download/sample", (req, res) => {
    const filePath = "/home/sample.txt"; // Path to the file on the server
  
    // Read the file from the server's filesystem
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).send("Internal Server Error");
      }
      
      // Set response headers to indicate file type and attachment
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Content-Disposition", "attachment; filename=sample.txt");
      
      // Send the file as a response
      res.send(data);
    });
  });


  app.listen(port, (req, res) => {
    console.log(`Server is listening on port ${port}`);
  });

