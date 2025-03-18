import { Client } from "./client";
// import * as core from '../server/db/schema/core'
// import * as app from '../server/db/schema/app'

// const schema = { ...core, ...app }

export const api = new Client("http://localhost:5173");