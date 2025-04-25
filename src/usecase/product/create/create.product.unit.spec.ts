import { InputCreateProductDto } from "./create.product.dto";
import CreateProductUseCase from "./create.product.usecase";
const input: InputCreateProductDto = {
  name: "John",
  price: 10,
  type: "a",
};

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test create Product use case", () => {
  it("should create a Product", async () => {
    const ProductRepository = MockRepository();
    const ProductCreateUseCase = new CreateProductUseCase(ProductRepository);

    const output = await ProductCreateUseCase.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it("should thrown an error when name is missing", async () => {
    const ProductRepository = MockRepository();
    const ProductCreateUseCase = new CreateProductUseCase(ProductRepository);

    input.name = "";

    await expect(ProductCreateUseCase.execute(input)).rejects.toThrow(
      "Name is required"
    );
  });

  it("should thrown an error when price is not greater than zero", async () => {
    const ProductRepository = MockRepository();
    const ProductCreateUseCase = new CreateProductUseCase(ProductRepository);

    input.price = 0;

    await expect(ProductCreateUseCase.execute(input)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });
});
