
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'

// Import your mock .ts files one by one
// If you use vite.mock.config.ts, just import the file directly
// You can use the import.meta.glob function to import all
import userModule from './mock/user'

export function setupProdMockServer() {
  createProdMockServer([...userModule])
}