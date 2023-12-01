"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// //some basic settings for types in prisma
// declare global {
//     namespace NodeJS {
//         interface Global {}
//     }
// }
// interface CustomNodeJsGlobal extends NodeJS.Global {
//     prisma: PrismaClient
// }
// declare const global: CustomNodeJsGlobal
// const prisma = global.prisma || new PrismaClient()
// if (process.env.NODE_ENV === "development") global.prisma = prisma
// export default prisma
// const { PrismaClient } = require('@prisma/client');
const prisma = new client_1.PrismaClient();
exports.default = prisma;
