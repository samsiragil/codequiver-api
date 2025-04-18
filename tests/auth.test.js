// tests/auth.test.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import request from "supertest";
import app from "../server.js";

const testUser = {
  username: "ragil",
  email: "kayakragil@gmail.com",
  password: "Ragil123",
  role: "admin",
  profile: {
    name: "Ragil Samsi",
    bio: "-",
    avatar: "https://dummyimage.com/300x300/000000/fff"
  }
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});

describe("Auth Endpoints", () => {
  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(testUser.email);
  });

  it("should login a user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        username: testUser.username,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
