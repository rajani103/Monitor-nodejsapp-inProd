// app.js
const express = require('express');
const client = require('prom-client');
const app = express();
const counter = new client.Counter({ name: 'node_requests_total', help: 'Total requests' });

app.get('/', (req, res) => {
  counter.inc();
  res.send('Hello Docker Monitoring!');
});

client.collectDefaultMetrics();
app.listen(3000, () => console.log('App running on port 3000'));
