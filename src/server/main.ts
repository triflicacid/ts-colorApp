import express from 'express';
import socketio from 'socket.io';
import path from 'path';
import { router } from './router';
import { terminate } from './utils';
import { db } from './database';
import { ClientConnection } from './ClientConnection';

// MAIN
(async function () {
  const app = express();
  var ready = false;

  app.use(express.urlencoded({ extended: true })); // Read form data

  app.use('/', router); // Router - control traffic

  app.use(express.static(path.join(__dirname, '../../public/'))); // Client-exposed files

  // Open database
  await db.open();
  console.log(`[database]: Opened connection: ${db.path}`);

  const PORT = 1234;
  const server = app.listen(PORT, async () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
    ready = true;
  });

  const io = new socketio.Server(server); // maxHttpBufferSize
  io.on('connection', (socket: socketio.Socket) => {
    if (ready) {
      const mgr = new ClientConnection(socket);
      console.log(`[server] Opened socket #${socket.id}`);

      (async function () {
        await mgr.invokeEvent("login", { email: 'root@tscolor.org', pwd: 'root' });
      })();
    } else {
      console.log(`[socket] attempted connection from ${socket.id} - server not ready`);
    }
  });

  // Handle exits - ensure graceful shutdown
  const exitHandler = terminate(server, {
    coredump: false,
    timeout: 500,
    log: true,
    fn: async () => {
      await db.close(); // Close database handle
      console.log(`[database] Closed connection: ${db.path}`);
      ClientConnection.all.forEach((sock, id) => {
        sock.disconnect();
        console.log(`[server] Closed socket #${id}`);
      });
    }
  });

  // Exit handler triggers
  process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
  process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
  process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
  process.on('SIGINT', exitHandler(0, 'SIGINT'));
})();