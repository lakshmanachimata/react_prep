import {
  addFruit,
  createUser,
  fetchFruits,
  fetchUsers,
  getFruitFetchCount,
} from "@/lib/mock/demoApi";

describe("demoApi fruits", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("fetchFruits returns mock fruit list", async () => {
    const promise = fetchFruits();
    await jest.runAllTimersAsync();
    const fruits = await promise;

    expect(fruits.length).toBeGreaterThanOrEqual(3);
    expect(fruits[0]).toHaveProperty("name");
  });

  it("fetchFruits throws when fail option is set", async () => {
    const promise = fetchFruits({ fail: true });
    const assertion = expect(promise).rejects.toThrow("Mock network error");
    await jest.runAllTimersAsync();
    await assertion;
  });

  it("addFruit appends a fruit", async () => {
    const before = getFruitFetchCount();
    const promise = addFruit("Mango");
    await jest.runAllTimersAsync();
    const fruits = await promise;

    expect(fruits.some((f) => f.name === "Mango")).toBe(true);
    expect(getFruitFetchCount()).toBe(before);
  });

  it("addFruit rejects empty name", async () => {
    await expect(addFruit("   ")).rejects.toThrow("Fruit name is required");
  });
});

describe("demoApi users", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("fetchUsers returns mock users", async () => {
    const promise = fetchUsers();
    await jest.runAllTimersAsync();
    const users = await promise;

    expect(users.length).toBeGreaterThanOrEqual(3);
    expect(users[0]).toMatchObject({ name: expect.any(String), role: expect.any(String) });
  });

  it("fetchUsers throws on fail", async () => {
    const promise = fetchUsers({ fail: true });
    const assertion = expect(promise).rejects.toThrow("Mock server error");
    await jest.runAllTimersAsync();
    await assertion;
  });

  it("createUser adds a user", async () => {
    const promise = createUser({ name: "Taylor", role: "Editor" });
    await jest.runAllTimersAsync();
    const user = await promise;

    expect(user.name).toBe("Taylor");
    expect(user.role).toBe("Editor");
    expect(user.id).toBeGreaterThan(0);
  });

  it("createUser rejects missing fields", async () => {
    await expect(createUser({ name: "", role: "Editor" })).rejects.toThrow(
      "Name and role are required",
    );
  });
});
