import { PrismaClient } from '@prisma/prisma/client';
import { SystemRole } from '@prisma/prisma/enums';
import * as argon2 from 'argon2';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Start seeding...');

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
  const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;

  if (!superAdminEmail || !superAdminPassword) {
    throw new Error(
      'Thiếu SUPER_ADMIN_EMAIL hoặc SUPER_ADMIN_PASSWORD trong file .env',
    );
  }

  // Kiểm tra xem Super Admin đã tồn tại chưa
  const existingAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (existingAdmin) {
    console.log(`Super Admin với email ${superAdminEmail} đã tồn tại!`);
    return;
  }

  // Băm mật khẩu
  const passwordHash = await argon2.hash(superAdminPassword);

  // Tạo tài khoản Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: superAdminEmail,
      passwordHash,
      firstName: 'Super',
      lastName: 'Admin',
      emailVerified: true,
      systemRole: SystemRole.SUPER_ADMIN,
    },
  });

  console.log(`Tạo thành công Super Admin: ${superAdmin.email}`);
  console.log('Seeding kết thúc.');
}

main()
  .catch((e) => {
    console.error('Lỗi khi seed data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
