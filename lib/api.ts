// ---------- Custom error ----------
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message); // runs the built-in Error constructor so message and stack are set
    this.name = "ApiError";
    this.status = status;
  }
}

// ---------- Types ----------
export type Employee = {
  id: number;
  name: string;
  email: string;
  company: { name: string };
};

export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

// ---------- Constants ----------
export const EMPLOYEE_ID = 1;
export const BASE_URL = "https://jsonplaceholder.typicode.com";

// ---------- The ONE place where responses are checked and parsed ----------
export async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // fetch does NOT throw on 404/503, so we throw our own error here
    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status
    );
  }
  return (await response.json()) as T;
}

// ---------- Request functions ----------
export async function fetchEmployee(): Promise<Employee> {
  const response = await fetch(`${BASE_URL}/users/${EMPLOYEE_ID}`);
  return parseResponse<Employee>(response);
}

export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(`${BASE_URL}/posts?userId=${EMPLOYEE_ID}`);
  return parseResponse<Post[]>(response);
}
