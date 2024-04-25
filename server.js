import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongooseConnection from "./mongo.js";
import appRoutes from './routes/index.js'
import fs from 'fs';
import dotenv from 'dotenv';
import https from 'https';
dotenv.config();

const port = process.env.PORT || 4000;

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


mongooseConnection();

const corsOrigin = ["http://localhost:5173","http://20.192.28.44","https://smsfoundation.neodeals.in"]

app.use(
    cors({
      origin: corsOrigin,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );


  app.use("/api", appRoutes);

  app.get("/download/sample", (req, res) => {
    const filePath = "/home/example.txt"; // Path to the file on the server
  
    // Read the file from the server's filesystem
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).send("Internal Server Error");
      }
      
      // Set response headers to indicate file type and attachment
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Content-Disposition", "attachment; filename=example.txt");
      
      // Send the file as a response
      res.send(data);
    });
  });



  if(process.env.DEPLOY_ENV === "local"){
    app.listen(4000, (req, res) => {
      console.log(`Server is listening on port ${port}`);
    });
    
  }else if(process.env.DEPLOY_ENV === "prod"){
    const httpsServer = https.createServer({
      cert: fs.readFileSync(process.env.SSL_CRT_PATH),
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
    }, app);
    
    httpsServer.listen(4000, () => {
      console.log('HTTPS Server running on port 443');
    });
  }