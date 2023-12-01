"use strict";

const { PrismaClient } = require('@prisma/client');

// Некоторые базовые настройки для типов в Prisma
global.prisma = new PrismaClient();

module.exports = global.prisma;