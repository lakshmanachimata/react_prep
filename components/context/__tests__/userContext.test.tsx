import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProvider, useUser } from "@/components/context/userContext";
import { defaultUser } from "@/components/context/userTypes";

function TestConsumer() {
  const { name, age, gender, setName, setAge, setGender } = useUser();
  return (
    <div>
      <span data-testid="name">{name}</span>
      <span data-testid="age">{age}</span>
      <span data-testid="gender">{gender}</span>
      <button type="button" onClick={() => setName("Updated")}>
        Change name
      </button>
      <button type="button" onClick={() => setAge(40)}>
        Change age
      </button>
      <button type="button" onClick={() => setGender("Other")}>
        Change gender
      </button>
    </div>
  );
}

describe("userContext", () => {
  it("provides default user values", () => {
    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>,
    );

    expect(screen.getByTestId("name")).toHaveTextContent(defaultUser.name);
    expect(screen.getByTestId("age")).toHaveTextContent(String(defaultUser.age));
    expect(screen.getByTestId("gender")).toHaveTextContent(defaultUser.gender);
  });

  it("updates name via setter", async () => {
    const user = userEvent.setup();
    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Change name" }));
    expect(screen.getByTestId("name")).toHaveTextContent("Updated");
  });

  it("updates age via setter", async () => {
    const user = userEvent.setup();
    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Change age" }));
    expect(screen.getByTestId("age")).toHaveTextContent("40");
  });

  it("updates gender via setter", async () => {
    const user = userEvent.setup();
    render(
      <UserProvider>
        <TestConsumer />
      </UserProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Change gender" }));
    expect(screen.getByTestId("gender")).toHaveTextContent("Other");
  });

  it("supports initialUser override", () => {
    render(
      <UserProvider initialUser={{ name: "Jordan", age: 35, gender: "Female" }}>
        <TestConsumer />
      </UserProvider>,
    );

    expect(screen.getByTestId("name")).toHaveTextContent("Jordan");
    expect(screen.getByTestId("age")).toHaveTextContent("35");
    expect(screen.getByTestId("gender")).toHaveTextContent("Female");
  });

  it("useUser throws outside provider", () => {
    function BadConsumer() {
      useUser();
      return null;
    }

    expect(() => render(<BadConsumer />)).toThrow(
      "useUser must be used within UserProvider",
    );
  });
});
