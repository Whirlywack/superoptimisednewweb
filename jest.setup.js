import "@testing-library/jest-dom";

// Mock superjson to avoid ES module issues
jest.mock("superjson", () => ({
  default: {
    serialize: (data) => JSON.stringify(data),
    deserialize: (data) => JSON.parse(data),
  },
}));

// Mock next-auth modules
jest.mock("next-auth", () => ({
  default: jest.fn(),
}));

jest.mock("next-auth/providers/github", () => ({
  default: jest.fn(),
}));

jest.mock("next-auth/providers/google", () => ({
  default: jest.fn(),
}));

// Mock other problematic ES modules
jest.mock("jose", () => ({
  jwtVerify: jest.fn(),
  SignJWT: jest.fn(),
}));

jest.mock("openid-client", () => ({
  Issuer: {
    discover: jest.fn(),
  },
}));

// Mock Headers
global.Headers = class MockHeaders extends Map {
  constructor(init) {
    super();
    if (init) {
      if (Array.isArray(init)) {
        init.forEach(([key, value]) => this.set(key, value));
      } else if (typeof init === "object") {
        Object.entries(init).forEach(([key, value]) => this.set(key, value));
      }
    }
  }

  get(key) {
    return super.get(key.toLowerCase());
  }

  set(key, value) {
    return super.set(key.toLowerCase(), value);
  }

  has(key) {
    return super.has(key.toLowerCase());
  }

  delete(key) {
    return super.delete(key.toLowerCase());
  }
};

// Mock Request and Response for Next.js API routes
global.Request = class MockRequest {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || "GET";
    this.headers = new Headers(options.headers || {});
    this.body = options.body;
  }
};

global.Response = class MockResponse {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.headers = new Headers(options.headers || {});
  }

  json() {
    return JSON.parse(this.body);
  }

  text() {
    return Promise.resolve(this.body);
  }
};
