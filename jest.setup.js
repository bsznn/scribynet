require("@testing-library/jest-dom");
const { TextEncoder, TextDecoder } = require("node:util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

Object.defineProperty(globalThis, "import", {
  value: {
    meta: {
      env: {
        VITE_API_URL: "http://localhost:5000",
      },
    },
  },
});