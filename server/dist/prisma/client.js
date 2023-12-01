"use strict";

const { PrismaClient } = require('@prisma/client');

// Некоторые базовые настройки для типов в Prisma
global.prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = global.prisma;
}

module.exports = global.prisma;