import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";

import CreateProductUseCase from "./create.product.usecase";

describe("Test create product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CreateProductUseCase(productRepository);

    const input = {
      id: "123",
      name: "Product",
      price: 10,
      type: "b"
    };

    const output = {
      name: "Product",
      price: 20,
    };

    const result = await usecase.execute(input);

    expect(result.name).toEqual(output.name);
    expect(result.price).toEqual(output.price);

    const productInDb = await ProductModel.findOne({ where: { id: result.id } });
    expect(productInDb).not.toBeNull();
    expect(productInDb?.name).toBe(result.name);
    expect(productInDb?.price).toBe(result.price);
  
  });
});
