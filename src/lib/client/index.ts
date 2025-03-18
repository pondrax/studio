import { PUBLIC_API_URL } from "$env/static/public";
import { Client } from "./client";
// import * as core from '../server/db/schema/core'
// import * as app from '../server/db/schema/app'

// const schema = { ...core, ...app }

export const api = new Client(PUBLIC_API_URL);