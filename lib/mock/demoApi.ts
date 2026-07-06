export type Fruit = {
  id: number;
  name: string;
};

let fruitsDb: Fruit[] = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Banana" },
  { id: 3, name: "Cherry" },
];

let nextFruitId = 4;
let fetchCount = 0;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchFruits(options?: { fail?: boolean }): Promise<Fruit[]> {
  await delay(700);
  fetchCount += 1;
  if (options?.fail) {
    throw new Error("Mock network error — try again");
  }
  return [...fruitsDb];
}

export async function addFruit(name: string): Promise<Fruit[]> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Fruit name is required");
  await delay(500);
  fruitsDb = [...fruitsDb, { id: nextFruitId++, name: trimmed }];
  return [...fruitsDb];
}

export function getFruitFetchCount() {
  return fetchCount;
}

export type User = {
  id: number;
  name: string;
  role: string;
};

let usersDb: User[] = [
  { id: 1, name: "Alex", role: "Admin" },
  { id: 2, name: "Sam", role: "Editor" },
  { id: 3, name: "Jordan", role: "Viewer" },
];

let nextUserId = 4;

export async function fetchUsers(options?: { fail?: boolean }): Promise<User[]> {
  await delay(900);
  if (options?.fail) {
    throw new Error("Mock server error");
  }
  return [...usersDb];
}

export async function createUser(input: {
  name: string;
  role: string;
}): Promise<User> {
  const name = input.name.trim();
  const role = input.role.trim();
  if (!name || !role) throw new Error("Name and role are required");
  await delay(600);
  const user = { id: nextUserId++, name, role };
  usersDb = [...usersDb, user];
  return user;
}
