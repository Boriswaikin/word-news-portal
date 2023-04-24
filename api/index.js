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

  if (!user) {
    res.json([]);
    return;
  }

  const news = await prisma.news.findMany({
    where: {
      authorId: user?.id,
    },
  });

  res.json(news);
});

// get detailed news
app.get("/news/:id", requireAuth, async (req, res) => {
  const newsDetails = await prisma.newsDetails.findMany({
    where: {
      newsId: parseInt(req.params.id),
    },
  });

  if (newsDetails) {
    res.json(newsDetails);
  } else {
    res.status(404).send("No news found");
  }
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
        title,
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

// deletes a news item by id
app.delete("/news/:id", requireAuth, async (req, res) => {
  const id = req.params.id;

  try {
    const deletedNewsDetails = await prisma.newsDetails.deleteMany({
      where: {
        newsId: parseInt(id),
      },
    });

    const deletedNews = await prisma.news.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.json({ deletedNews, deletedNewsDetails });
  } catch (error) {
    res.status(404).send("No news found");
  }
});

// updates a news chatGPT dialog by id (Put)
app.put("/chatGPT/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const { chatGPT } = req.body;

  if (!chatGPT) {
    res.status(400).send("chatGPT data required");
    return;
  }

  try {
    const updatedItem = await prisma.newsDetails.updateMany({
      where: {
        newsId: parseInt(id),
      },
      data: {
        chatGPT,
      },
    });
    res.json(updatedItem);
  } catch (error) {
    res.status(404).send("No news found");
  }
});

// updates a news item by id (Patch)
app.patch("/news/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const { displayTitle } = req.body;

  if (!displayTitle) {
    res.status(400).send("displayTitle is required");
    return;
  }

  try {
    const updatedItem = await prisma.news.update({
      where: {
        id: parseInt(id),
      },
      data: {
        displayTitle,
      },
    });
    res.json(updatedItem);
  } catch (error) {
    res.status(404).send("No news found");
  }
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

// update Profile information of authenticated user
app.put("/profile", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const { name, firstName, lastName, birthday, gender, phone, address } =
    req.body;
  const updatedItem = await prisma.user.update({
    where: {
      auth0Id,
    },
    data: {
      name,
      firstName,
      lastName,
      birthday,
      gender,
      phone,
      address,
    },
  });
  res.json(updatedItem);
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
