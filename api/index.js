import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

// decode the JWT and verify the signature
const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: "RS256",
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// get all news
app.get("/news", requireAuth, async (req, res) => {
  // auth0 decodes the JWT and provides the payload in the request
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const news = await prisma.news.findMany({
    where: {
      authorId: user.id,
    },
  });

  res.json(news);
});

// get detailed news
app.get("/news:id", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const newsDetails = await prisma.newsDetails.findUnique({
    where: {
      newsId: parseInt(req.params.id),
    },
  });

  res.json(newsDetails);
});

// saves news and its detail to the database
app.post("/news", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const {
    title,
    category,
    publishDate,
    displayTitle,
    content,
    imageURL,
    author,
    articleURL,
  } = req.body;

  if (!title) {
    res.status(400).send("title is required");
  } else {
    const news = await prisma.news.create({
      data: {
        title,
        displayTitle,
        author: { connect: { auth0Id } },
        category,
        publishDate,
      },
    });

    const newsDetails = await prisma.newsDetails.create({
      data: {
        content,
        imageURL,
        author,
        articleURL,
        news: { connect: { id: news.id } },
      },
    });

    res.status(201).json({ news, newsDetails });
  }
});

// // insert news details
// app.post("/details", requireAuth, async (req, res) => {
//   const auth0Id = req.auth.payload.sub;

//   const { title, content, imageURL, author, articleURL } = req.body;

//   if (!title) {
//     res.status(400).send("title is required");
//   } else {
//     const newItem = await prisma.newsDetails.create({
//       data: {
//         title,
//         content,
//         imageURL,
//         author,
//         articleURL,
//         user: { connect: { auth0Id } },
//       },
//     });

//     res.status(201).json(newItem);
//   }
// });

// deletes a news item by id
app.delete("/news/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const deletedNews = await prisma.news.delete({
    where: {
      id: parseInt(id),
    },
  });

  const deletedNewsDetails = await prisma.newsDetails.delete({
    where: {
      newsId: parseInt(id),
    },
  });

  res.json({ deletedNews, deletedNewsDetails });
});

// // deletes detail item by id
// app.delete("/details/:id", requireAuth, async (req, res) => {
//   const id = req.params.id;
//   const deletedItem = await prisma.newsDetails.delete({
//     where: {
//       id: parseInt(id),
//     },
//   });
//   res.json(deletedItem);
// });

// // get a news item by id
// app.get("/news/:id", requireAuth, async (req, res) => {
//   const id = req.params.id;
//   const news = await prisma.news.findUnique({
//     where: {
//       id: parseInt(id),
//     },
//   });
//   res.json(news);
// });

// updates a news item by id (Put)
app.put("/news/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const { displayTitle } = req.body;
  const updatedItem = await prisma.news.update({
    where: {
      id: parseInt(id),
    },
    data: {
      displayTitle,
    },
  });
  res.json(updatedItem);
});

// updates a news item by id (Patch)
app.patch("/news/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const { displayTitle } = req.body;
  const updatedItem = await prisma.news.update({
    where: {
      id: parseInt(id),
    },
    data: {
      displayTitle,
    },
  });
  res.json(updatedItem);
});

// get Profile information of authenticated user
app.get("/profile", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  res.json(user);
});

// verify user status, if not registered in our database we will create it
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const email = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.auth.payload[`${process.env.AUTH0_AUDIENCE}/name`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    res.json(newUser);
  }
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 🎉 🚀");
});
