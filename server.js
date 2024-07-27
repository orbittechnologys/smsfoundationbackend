import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongooseConnection from "./mongo.js";
import appRoutes from "./routes/index.js";
import fs from "fs";
import dotenv from "dotenv";
import https from "https";
import { exec } from "child_process";
import { stderr } from "process";
dotenv.config();

const port = process.env.PORT || 4000;

const app = express();

app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

mongooseConnection();

const corsOrigin = [
  "http://localhost:5173",
  "http://20.192.28.44",
  "https://smsfoundation.neodeals.in",
];

app.use(
  cors({
    origin: "*",
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

const envFilePath = "C:\\DigiLibrary\\smsfoundation\\.env";

// Function to update the .env file
const updateEnvFile = (baseUrl, syncUrl) => {
  let envContent = fs.readFileSync(envFilePath, "utf-8");
  console.log("Updating base url", baseUrl);
  console.log("Updating Sync url", syncUrl);

  // Update BASE_URL
  envContent = envContent.replace(
    /VITE_APP_BASE_URL\s*=\s*.*/g,
    `VITE_APP_BASE_URL=${baseUrl}`
  );

  // Update SYNC_URL
  envContent = envContent.replace(
    /VITE_APP_SYNC_URL\s*=\s*.*/g,
    `VITE_APP_SYNC_URL=${syncUrl}`
  );

  fs.writeFileSync(envFilePath, envContent);
};

app.post("/switchOnline", (req, res) => {
  try {
    const newBaseUrl = "http://localhost:4000/api/";
    const newSyncUrl = "http://localhost:4001/";
    updateEnvFile(newBaseUrl, newSyncUrl);
    res.send({ message: "Switched to localhost" });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.post("/switchOffline", (req, res) => {
  try {
    const ip = req.body.ip;
    if (!ip) {
      return res.status(400).send({ error: "IP address is required" });
    }
    const newBaseUrl = `http://${ip}:4000/api/`;
    const newSyncUrl = `http://${ip}:4001/`;
    updateEnvFile(newBaseUrl, newSyncUrl);
    res.send({ message: `Switched to ${ip}` });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get("/getIpConfig", (req, res) => {
  try {
    exec("ipconfig", (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          error,
          msg: "Unable to fetch Ip info",
        });
      }
      console.log('cmd output',stdout);
      const ethRegex =
        /Ethernet adapter Ethernet [^:]+:\s*[\s\S]*?IPv4 Address[.\s]*?: ([\d.]+)/;
      const wlanRegex =
        /Wireless LAN adapter [^:]+:\s*[\s\S]*?IPv4 Address[.\s]*?: ([\d.]+)/;

      const ethMatch = stdout.match(ethRegex);
      const wlanMatch = stdout.match(wlanRegex);

      const ethIp = ethMatch ? ethMatch[1] : "Not found";
      const wlanIp = wlanMatch ? wlanMatch[1] : "Not found";
      console.log("Ethernet ip",ethIp);
      console.log('WLan Ip',wlanIp);
      res.send({
        ethIp,
        wlanIp,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error,
      msg: "Unable to fetch Ip info",
    });
  }
});

if (process.env.DEPLOY_ENV === "local") {
  app.listen(4000, (req, res) => {
    console.log(`Server is listening on port ${port}`);
  });
} else if (process.env.DEPLOY_ENV === "prod") {
  const httpsServer = https.createServer(
    {
      cert: fs.readFileSync(process.env.SSL_CRT_PATH),
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
    },
    app
  );

  httpsServer.listen(4000, () => {
    console.log("HTTPS Server running on port 443");
  });
}
