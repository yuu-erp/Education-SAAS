import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { StudentsController } from './controllers/students.controller';
import { StudentsRepository } from './repositories/students.repository';
import { StudentMapper } from './mappers/student.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [StudentsController],
  providers: [StudentsRepository, StudentMapper],
})
export class StudentsModule {}
