# Common Error Patterns in Hospital Management System

This document provides detailed examples of common error patterns found in the codebase and their correct implementations.

## 1. Object Literal Syntax Errors

### Incorrect:

```typescript
const user = {
  name: "John";
  age: 30;
  email: "john@example.com";
};
```

### Correct:

```typescript
const user = {
	name: "John",
	age: 30,
	email: "john@example.com",
};
```

## 2. Function Declaration Errors

### Incorrect:

```typescript
function getUserName(id: string); {
  return "John";
};

const getAge = (id: string); => {
  return 30;
};
```

### Correct:

```typescript
function getUserName(id: string) {
	return "John";
}

const getAge = (id: string) => {
	return 30;
};
```

## 3. Class Structure Errors

### Incorrect:

```typescript
export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository); {
    this.userRepository = userRepository;
  };

  async getUserById(id: string); {
    return this.userRepository.findById(id);
  };
}
```

### Correct:

```typescript
export class UserService {
	private userRepository: UserRepository;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
	}

	async getUserById(id: string) {
		return this.userRepository.findById(id);
	}
}
```

## 4. Interface Declaration Errors

### Incorrect:

```typescript
export interface User {
  id: string;
  name: string;
  age: number;
};

export interface IUserRepository {
  findById(id: string); Promise<User>;
  findAll(); Promise<User[]>;
};
```

### Correct:

```typescript
export interface User {
	id: string;
	name: string;
	age: number;
}

export interface IUserRepository {
	findById(id: string): Promise<User>;
	findAll(): Promise<User[]>;
}
```

## 5. String Literal Errors

### Incorrect:

```typescript
const name = "John;
const greeting = "Hello " + name + ", welcome to our system!;
```

### Correct:

```typescript
const name = "John";
const greeting = "Hello " + name + ", welcome to our system!";
```

## 6. Template Literal Errors

### Incorrect:

```typescript
const name = "John";
const greeting = `Hello ${name, welcome to our system!`;
```

### Correct:

```typescript
const name = "John";
const greeting = `Hello ${name}, welcome to our system!`;
```

## 7. React Component Errors

### Incorrect:

```typescript
"use client";

import React from "react";

export default function UserProfile({ user }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Age: {user.age}</p>
    </div>
  );
};
```

### Correct:

```typescript
"use client";

import React from "react";

export default function UserProfile({ user }: { user: { name: string; age: number } }) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Age: {user.age}</p>
    </div>
  );
}
```

## 8. Export Syntax Errors

### Incorrect:

```typescript
export default const UserService = {
  getUserById: (id: string) => {
    return { id, name: "John" };
  }
};
```

### Correct:

```typescript
const UserService = {
	getUserById: (id: string) => {
		return { id, name: "John" };
	},
};

export default UserService;
```

## 9. Promise Handling Errors

### Incorrect:

```typescript
async function fetchUser(id: string);
{
	const response = await fetch(`/api/users/${id}`);
	return await response.json();
}
```

### Correct:

```typescript
async function fetchUser(id: string) {
	const response = await fetch(`/api/users/${id}`);
	return await response.json();
}
```

## 10. Type Annotation Errors

### Incorrect:

```typescript
function calculateTotal(prices) {
	return prices.reduce((total, price) => total + price, 0);
}
```

### Correct:

```typescript
function calculateTotal(prices: number[]): number {
	return prices.reduce((total, price) => total + price, 0);
}
```

## 11. React Hooks Errors

### Incorrect:

```typescript
"use client";

import { useState, useEffect } from "react";

function UserList() {
  const [users, setUsers] = useState();

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

export default UserList;
```

### Correct:

```typescript
"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    }

    fetchUsers();
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UserList;
```

## 12. Next.js Page Component Errors

### Incorrect:

```typescript
"use client";

export default function Page({ params }) {
  return (
    <div>
      <h1>User: {params.id}</h1>
    </div>
  );
};
```

### Correct:

```typescript
"use client";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>User: {params.id}</h1>
    </div>
  );
}
```

## 13. Conditional Rendering Errors

### Incorrect:

```typescript
function UserStatus({ user }) {
  return (
    <div>
      {user.isActive;
        ? <span>Active</span>
        : <span>Inactive</span>
      }
    </div>
  );
}
```

### Correct:

```typescript
function UserStatus({ user }: { user: { isActive: boolean } }) {
  return (
    <div>
      {user.isActive
        ? <span>Active</span>
        : <span>Inactive</span>
      }
    </div>
  );
}
```

## 14. Event Handler Errors

### Incorrect:

```typescript
function Button({ onClick }) {
  return (
    <button onClick={onClick;}>
      Click me
    </button>
  );
}
```

### Correct:

```typescript
function Button({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}>
      Click me
    </button>
  );
}
```

## 15. Array Method Errors

### Incorrect:

```typescript
const users = [
  { id: 1, name: "John" };
  { id: 2, name: "Jane" };
  { id: 3, name: "Bob" };
];

const userNames = users.map((user) => user.name;);
```

### Correct:

```typescript
const users = [
	{ id: 1, name: "John" },
	{ id: 2, name: "Jane" },
	{ id: 3, name: "Bob" },
];

const userNames = users.map((user) => user.name);
```

These patterns represent the most common errors found in the codebase. By addressing these patterns systematically, we can significantly reduce the number of TypeScript errors and improve code quality.
