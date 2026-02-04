import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePasteDto } from './dto/create-paste.dto';
import { Paste } from '@prisma/client';

@Injectable()
export class PastesService {
  constructor(private prisma: PrismaService) {}

  async create(createPasteDto: CreatePasteDto) {
    // Validation
    if (!createPasteDto.content || createPasteDto.content.trim().length === 0) {
      throw new BadRequestException('Content cannot be empty');
    }

    if (createPasteDto.ttl_seconds && createPasteDto.ttl_seconds < 1) {
      throw new BadRequestException('ttl_seconds must be >= 1');
    }

    if (createPasteDto.max_views && createPasteDto.max_views < 1) {
      throw new BadRequestException('max_views must be >= 1');
    }

    const now = new Date();
    const expiresAt = createPasteDto.ttl_seconds
      ? new Date(now.getTime() + createPasteDto.ttl_seconds * 1000)
      : null;

    const paste = await this.prisma.paste.create({
      data: {
        content: createPasteDto.content,
        expiresAt,
        maxViews: createPasteDto.max_views || null,
      },
    });

    return {
      id: paste.id,
      url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/p/${paste.id}`,
    };
  }

  async findOne(id: string, req?: any): Promise<any> {
    const paste = await this.prisma.paste.findUnique({
      where: { id },
    });

    if (!paste) {
      return null;
    }

    // Check expiry
    const now = this.getTestNow(req);
    if (paste.expiresAt && now > paste.expiresAt) {
      return null;
    }

    // Check view limit
    if (paste.maxViews && paste.viewCount >= paste.maxViews) {
      return null;
    }

    // Increment view count
    const updated = await this.prisma.paste.update({
      where: { id },
      data: { viewCount: paste.viewCount + 1 },
    });

    return {
      content: paste.content,
      remaining_views: paste.maxViews ? paste.maxViews - updated.viewCount : null,
      expires_at: paste.expiresAt?.toISOString() || null,
    };
  }

  private getTestNow(req?: any): Date {
    if (process.env.TEST_MODE === '1' && req?.headers) {
      const testNowMs = req.headers['x-test-now-ms'];
      if (testNowMs) {
        return new Date(parseInt(testNowMs, 10));
      }
    }
    return new Date();
  }
}

