export type MockType<T> = {
  [P in keyof T]?: jest.Mock<unknown>;
};
