const express = require("express");
const fs = require("fs");
const AWS = require("aws-sdk");
const app = express();
const port = 3000;

// Create write stream to log file
const logStream = fs.createWriteStream("/var/log/nodejs-app.log", { flags: "a" });

// AWS CloudWatch config (optional, if sending custom metrics)
const cloudwatch = new AWS.CloudWatch({ region: "us-east-1" }); // Replace with your region

// Function to send custom metric
function sendMetric() {
  const params = {
    MetricData: [
      {
        MetricName: "CustomAppRequests",
        Dimensions: [
          {
            Name: "ServiceName",
            Value: "NodeApp"
          }
        ],
        Unit: "Count",
        Value: 1
      }
    ],
    Namespace: "NodeApp/Metrics"
  };

  cloudwatch.putMetricData(params, (err, data) => {
    if (err) console.error("CloudWatch Error:", err);
  });
}

// Middleware to log all requests
app.use((req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  logStream.write(log);
  console.log(log);
  sendMetric(); // Optional
  next();
});

app.get("/", (req, res) => {
  res.send("Hello from Node.js App running in Production!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
