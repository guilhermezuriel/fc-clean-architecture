import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for products", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Dishwasher",
        price: 1000,
        type: "a",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Dishwasher");
    expect(response.body.price).toBe(1000);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/products").send({
      name: "mouse",
    });
    expect(response.status).toBe(500);
  });

  it("should list all products", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Dishwasher",
        price: 1000,
        type: "a",
      });
    expect(response.status).toBe(200);
    const response2 = await request(app)
      .post("/products")
      .send({
        name: "Fridge",
        price: 2000,
        type: "b",
      });
    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/products").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.products.length).toBe(2);
    const product1 = listResponse.body.products[0];
    expect(product1.name).toBe("Dishwasher");
    expect(product1.price).toBe(1000);
    const product2 = listResponse.body.products[1];
    expect(product2.name).toBe("Fridge");
    expect(product2.price).toBe(4000);

    // const listResponseXML = await request(app)
    // .get("/product1")
    // .set("Accept", "application/xml")
    // .send();

    // expect(listResponseXML.status).toBe(200);
    // expect(listResponseXML.text).toContain(`<?xml version="1.0" encoding="UTF-8"?>`);
    // expect(listResponseXML.text).toContain(`<product1s>`);
    // expect(listResponseXML.text).toContain(`<product1>`);
    // expect(listResponseXML.text).toContain(`<name>John</name>`);
    // expect(listResponseXML.text).toContain(`<address>`);
    // expect(listResponseXML.text).toContain(`<street>Street</street>`);
    // expect(listResponseXML.text).toContain(`<city>City</city>`);
    // expect(listResponseXML.text).toContain(`<number>123</number>`);
    // expect(listResponseXML.text).toContain(`<zip>12345</zip>`);
    // expect(listResponseXML.text).toContain(`</address>`);
    // expect(listResponseXML.text).toContain(`</product1>`);
    // expect(listResponseXML.text).toContain(`<name>Jane</name>`);
    // expect(listResponseXML.text).toContain(`<street>Street 2</street>`);
    // expect(listResponseXML.text).toContain(`</product1s>`);
    

    
  });

  it("should find a product", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Dishwasher",
        price: 1000,
        type: "a",
      });
    expect(response.status).toBe(200);

    const listResponse = await request(app).get(`/products/${response.body.id}`).send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.name).toBe("Dishwasher");
    expect(listResponse.body.price).toBe(1000);
  });

  it("should not find a product", async () => {
    const response = await request(app).get("/products/123").send();
    expect(response.status).toBe(404);
  });

  it("should update a product", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Dishwasher",
        price: 1000,
        type: "a",
      });
    expect(response.status).toBe(200);

    const updateResponse = await request(app)
      .put("/products")
      .send({
        id: response.body.id,
        name: "Dishwasher 2",
        price: 2000,
      });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.name).toBe("Dishwasher 2");
    expect(updateResponse.body.price).toBe(2000);
  });
});
