const request = require("supertest");
const app = require("../server.js");

test('Test get(/)', async () => {
    await request("http://127.0.0.1:3000").get('/').expect(200)
});

test('Test get(/category)', async () => {
    await request("http://127.0.0.1:3000").get('/').expect(200)
});