import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async healthz() {
    try {
      // Test database connection
      await this.prisma.$queryRaw`SELECT 1`;
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  }
}

