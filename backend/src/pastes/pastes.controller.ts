import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  BadRequestException,
  NotFoundException,
  HttpCode,
  Request,
} from '@nestjs/common';
import { PastesService } from './pastes.service';
import { CreatePasteDto } from './dto/create-paste.dto';

@Controller('api/pastes')
export class PastesController {
  constructor(private readonly pastesService: PastesService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createPasteDto: CreatePasteDto) {
    return this.pastesService.create(createPasteDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    const pasteData = await this.pastesService.findOne(id, req);
    if (!pasteData) {
      throw new NotFoundException();
    }
    return pasteData;
  }
}


