import { defaultUser } from "@/components/context/userTypes";

describe("userTypes", () => {
  it("defaultUser has expected shape", () => {
    expect(defaultUser).toEqual({
      name: expect.any(String),
      age: expect.any(Number),
      gender: expect.any(String),
    });
    expect(defaultUser.name).toBe("Alex");
  });
});
