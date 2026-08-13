import { creatApp } from "./app";
import http from "node:http";
import { env } from "./config/env";
import { ConnectToDB } from "./db/db";

async function bootsrap() {
  try {
    await ConnectToDB();
    const app = creatApp();

    const server = http.createServer(app);

    const port = Number(env.PORT) || 5000;

    server.listen(port, () => {
      console.log(`Server is listening on port: ${port}`);
    });
  } catch (error) {
    console.error(`Failed to start the sever:`, error);
    process.exit(1);
  }
}

bootsrap();
