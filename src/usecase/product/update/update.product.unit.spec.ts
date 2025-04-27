import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";
const product = ProductFactory.create(
  "a",
  "Product",
  10
);

const input = {
  id: product.id,
  name: "Product Updated",
  price: 20,
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    update: jest.fn(),
  };
};

describe("Unit test for customer update use case", () => {
  it("should update a customer", async () => {
    const productRepository = MockRepository();
    const productUseCase = new UpdateProductUseCase(productRepository);

    const output = await productUseCase.execute(input);

    expect(output).toEqual(input);
  });
});
