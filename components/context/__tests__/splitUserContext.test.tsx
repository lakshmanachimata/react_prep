import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  SplitUserProvider,
  useUserDispatch,
  useUserState,
} from "@/components/context/splitUserContext";

function StateReader() {
  const { name } = useUserState();
  return <span data-testid="name">{name}</span>;
}

function DispatchWriter() {
  const { setName, setAge, setGender } = useUserDispatch();
  return (
    <div>
      <button type="button" onClick={() => setName("From dispatch")}>
        Set name
      </button>
      <button type="button" onClick={() => setAge(40)}>
        Set age
      </button>
      <button type="button" onClick={() => setGender("Other")}>
        Set gender
      </button>
    </div>
  );
}

function AgeReader() {
  const { age } = useUserState();
  return <span data-testid="age">{age}</span>;
}

function GenderReader() {
  const { gender } = useUserState();
  return <span data-testid="gender">{gender}</span>;
}

describe("splitUserContext", () => {
  it("useUserState reads user data", () => {
    render(
      <SplitUserProvider>
        <StateReader />
      </SplitUserProvider>,
    );

    expect(screen.getByTestId("name")).toHaveTextContent("Alex");
  });

  it("useUserDispatch updates state context", async () => {
    const user = userEvent.setup();
    render(
      <SplitUserProvider>
        <DispatchWriter />
        <StateReader />
      </SplitUserProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Set name" }));
    expect(screen.getByTestId("name")).toHaveTextContent("From dispatch");
  });

  it("useUserDispatch setAge updates age in state context", async () => {
    const user = userEvent.setup();
    render(
      <SplitUserProvider>
        <DispatchWriter />
        <AgeReader />
      </SplitUserProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Set age" }));
    expect(screen.getByTestId("age")).toHaveTextContent("40");
  });

  it("useUserDispatch setGender updates gender in state context", async () => {
    const user = userEvent.setup();
    render(
      <SplitUserProvider>
        <DispatchWriter />
        <GenderReader />
      </SplitUserProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Set gender" }));
    expect(screen.getByTestId("gender")).toHaveTextContent("Other");
  });

  it("useUserState throws outside provider", () => {
    function Bad() {
      useUserState();
      return null;
    }
    expect(() => render(<Bad />)).toThrow(
      "useUserState must be used within SplitUserProvider",
    );
  });

  it("useUserDispatch throws outside provider", () => {
    function Bad() {
      useUserDispatch();
      return null;
    }
    expect(() => render(<Bad />)).toThrow(
      "useUserDispatch must be used within SplitUserProvider",
    );
  });
});
