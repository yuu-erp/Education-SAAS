import { Injectable } from '@nestjs/common';
import { StudentEntity } from '../entities/student.entity';

@Injectable()
export class StudentMapper {
  static toDomain(): StudentEntity {
    const student = new StudentEntity();
    return student;
  }
}
