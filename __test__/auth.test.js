const axios = require("axios");
// const app = require("../index");

// test("Test to see is the registration works well", async () => {
//     const response = await axios.post("http://localhost:4000/v1/auth/register", {
//         fullName: "Victor",
//         email: "ukokjnr@gmail.com",
//         password: "victor1234"
//     });

//     expect(response.status).toBe(201);
//     expect(response.data).toBe("Created Successfully");

// });

test("Test to login a user", async () => {

    const response = await axios.post("http://localhost:4000/v1/auth/login", {
        email: "ukokjnr@gmail.com",
        password: "victor1234"
    });

    global.token = response.data.token;

    expect(response.status).toBe(200);
    expect(typeof(response.data)).toBe("object");

});
