import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prismaClient: any;

  constructor() {
    // Load Prisma client at runtime
    const { PrismaClient } = require('@prisma/client');
    this.prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  get paste() {
    return this.prismaClient.paste;
  }

  $queryRaw(...args: any[]) {
    return this.prismaClient.$queryRaw(...args);
  }

  async onModuleInit() {
    await this.prismaClient.$connect();
  }

  async onModuleDestroy() {
    await this.prismaClient.$disconnect();
  }
}
