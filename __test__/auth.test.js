const axios = require("axios");
const request = require("supertest");
const app = require("../index");

test("Test to see is the registration works well", async () => {
    const response = await axios.post("http://localhost:4000/v1/auth/register", {
        fullName: "Victor",
        email: "ukokjnr@gmail.com",
        password: "victor1234"
    });

    expect(response.status).toBe(201);
    expect(response.data).toBe("Created Successfully");

});

// test("Test to login a user", async () => {

//     const response = await axios.post("http://localhost:4000/v1/auth/login", {
//         email: "ukokjnr@gmail.com",
//         password: "victor1234"
//     });

//     expect(response.status).toBe(200);
//     expect(typeof(response.data)).toBe("object");

// });

// test("Add a task", async() => {

//     const response = await axios.post("http://localhost:4000/v1/tasks", {
//         taskTitle: "Sample task",
//         taskBody: "My task body"
//     }, {
//         headers: {
//             authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVrb2tqbnJAZ21haWwuY29tIiwidXNlcklkIjoiNjUyODA0MGQ1ZmI5ZDAyMzBlOWIzNmM3Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE2OTcxMjIyMTB9.i--Ofy02BRvBvn6cXazIw-0a0P0UHLCRRp7O3mXrcM0"
//         }
//     });

//     expect(response.data.isRequestSuccesful).toBe(true);

// });

// test("Get tasks", async () => {
//     const response = await axios.get("http://localhost:4000/v1/tasks", {
//         headers: {
//             authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVrb2tqbnJAZ21haWwuY29tIiwidXNlcklkIjoiNjUyODA0MGQ1ZmI5ZDAyMzBlOWIzNmM3Iiwicm9sZSI6InVzZXIiLCJpYXQiOjE2OTcxMjIyMTB9.i--Ofy02BRvBvn6cXazIw-0a0P0UHLCRRp7O3mXrcM0"
//         }
//     });

//     expect(response.status).toBe(200);
//     expect(typeof(response.data)).toBe("object");

// });
