import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApolloGraphqlServer from "./graphql";
import UserService from "./services/user";
import cookieParser from "cookie-parser";
import http from "http";
import setupSocket from "./socket";
import cors from "cors";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;
  const server = http.createServer(app);
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use(
    "/graphql",
    expressMiddleware(await createApolloGraphqlServer(), {
      context: async ({ req, res }) => {
        // @ts-ignore
        const token = req.cookies["token"];
        try {
          if (!token)
            return {
              req,
              res,
            };
          const user = UserService.decodeJWTToken(token as string);
          return {
            user,
            req,
            res,
          };
        } catch (error) {
          console.log(error);
          return {};
        }
      },
    })
  );

  async function resetDatabase() {
    try {
      await prismaClient.contact.deleteMany();
      // Repeat the above line for each model/table you want to clear

      console.log("Database reset complete.");
    } catch (error) {
      console.error("Error resetting database:", error);
    } finally {
      await prismaClient.$disconnect();
    }
  }

  // resetDatabase();

  setupSocket(server);
  server.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
}

init();
