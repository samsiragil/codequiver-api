// tests/profile.test.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import request from "supertest";
import app from "../server.js";

let token;

beforeAll(async () => {
  // Connect to test DB
  await mongoose.connect(process.env.MONGO_URI);

  // Register a test user
  const testUser = {
    username: "profileuser",
    email: "profile@example.com",
    password: "pass1234",
    profile: { name: "Profile User", bio: "", avatar: "" }
  };
  await request(app).post("/api/auth/register").send(testUser);

  // Login to get JWT
  const res = await request(app)
    .post("/api/auth/login")
    .send({ username: testUser.username, password: testUser.password });

  token = res.body.token;
});

afterAll(async () => {
  // Clean up DB
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});

describe("Protected Profile Route", () => {
  it("should deny access without a token", async () => {
    const res = await request(app).get("/api/user/profile");
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "Access denied. No token provided.");
  });

  it("should return profile data with a valid token", async () => {
    const res = await request(app)
      .get("/api/user/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("username", "profileuser");
    expect(res.body.user).toHaveProperty("email", "profile@example.com");
  });
});
