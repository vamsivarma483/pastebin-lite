import { Module } from '@nestjs/common';
import { PastesController } from './pastes.controller';
import { PastesService } from './pastes.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PastesController],
  providers: [PastesService, PrismaService],
})
export class PastesModule {}
