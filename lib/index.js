const csv = require('csv-parser');
const express = require('express');
const fs = require('fs');
const SignalRJS = require('signalrjs');

const MESSAGES = require('./constants/MESSAGES');

const pauseMiddleware = require('./middleware/pause');
const sendMessageMiddleware = require('./middleware/sendMessage');

const formatString = require('./formatString');

const createServer = async ({
  filePath,
  interval = 1000, // in milliseconds
  message = "{0}",
  port = 8080,
  silent = false,
}) => {
  const signalR = SignalRJS();

  const app = express();
  app.use(signalR.createListener());

  // app.post('/pause', pauseMiddleware(signalR));
  // app.post('/send-message', sendMessageMiddleware(signalR));

  app.listen(port);

  // Wait for first connection to begin stream
  // await (new Promise((resolve) => {
  //   signalR.on(MESSAGES.CONNECTED, () => {
  //     resolve();
  //   });
  // }));

  if (!silent) {
    process.stdout.write('Connected.\n');
  }

  fs.createReadStream(filePath)
    .pipe(csv({ headers: false }))
    .on('data', (data) => {
      const entries = Object.entries(data);
      const dataArray = entries.reduce((acc, [idx, val]) => {
        acc[parseInt(idx)] = val;
        return acc;
      }, new Array(entries.length));
      const formattedMessage = formatString(message, ...dataArray);
      if (!silent) {
        process.stdout.write(`${formattedMessage}\n`);
      }
      try {
        const json = JSON.parse(formattedMessage);
        signalR.send(json);
      } catch (err) {
        signalR.send(formattedMessage);
      }
    });

  // setInterval(() => {
  //   const formattedMessage = formatString(message, )
  //   // signalR.send({ time: new Date() });
  // }, interval);
};

module.exports = {
  createServer,
};
