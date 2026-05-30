# Education SaaS - Infrastructure Cost Estimation & Growth Stages

## Mục tiêu

Tài liệu này ước tính toàn bộ chi phí vận hành hệ thống Education SaaS theo từng giai đoạn phát triển.

Stack giả định:

- Frontend: Next.js
- Backend: NestJS
- Database: PostgreSQL
- Cache: Redis
- Storage: Cloudflare R2
- Email: Resend
- Reverse Proxy: Nginx
- Monitoring: UptimeRobot, Grafana, Prometheus
- SSL: Let's Encrypt

---

# Giai đoạn 1 - MVP

## Quy mô

- 0 - 20 khách hàng
- Dưới 10.000 học viên
- 1 nhà sáng lập vận hành

## Kiến trúc

```text
Internet
    │
Cloudflare
    │
VPS
 ├── Nginx
 ├── Next.js
 ├── NestJS
 ├── PostgreSQL
 └── Redis
```

---

## Chi phí

### Domain

| Hạng mục | Chi phí                   |
| -------- | ------------------------- |
| .com     | 300.000 - 500.000 VNĐ/năm |
| .vn      | 300.000 - 800.000 VNĐ/năm |

Trung bình:

```text
500.000 VNĐ/năm
≈ 42.000 VNĐ/tháng
```

---

### VPS

Cấu hình:

```text
4 vCPU
8GB RAM
160GB SSD
```

Chi phí:

```text
300.000 - 600.000 VNĐ/tháng
```

Ước tính:

```text
500.000 VNĐ/tháng
```

---

### Storage

Cloudflare R2

Chi phí:

```text
0 - 100.000 VNĐ/tháng
```

Ước tính:

```text
50.000 VNĐ/tháng
```

---

### Email

Resend

Free Tier:

```text
3.000 email/tháng
```

Chi phí:

```text
0 VNĐ
```

---

### SSL

Let's Encrypt

```text
0 VNĐ
```

---

### Monitoring

UptimeRobot

```text
0 VNĐ
```

---

### Backup

Cloudflare R2

```text
50.000 VNĐ/tháng
```

---

## Tổng chi phí MVP

| Hạng mục   | Chi phí |
| ---------- | ------- |
| Domain     | 42.000  |
| VPS        | 500.000 |
| Storage    | 50.000  |
| Backup     | 50.000  |
| Email      | 0       |
| Monitoring | 0       |

### Tổng

```text
642.000 VNĐ/tháng
```

Làm tròn:

```text
700.000 VNĐ/tháng
```

---

# Giai đoạn 2 - Early Growth

## Quy mô

- 20 - 100 khách hàng
- 10.000 - 50.000 học viên
- Có doanh thu ổn định

## Kiến trúc

```text
Internet
    │
Cloudflare
    │
Load Balancer
    │
App Server
    │
Database Server
    │
Redis
```

---

## Chi phí

### App Server

```text
4 vCPU
8GB RAM
```

```text
800.000 VNĐ/tháng
```

---

### Database Server

```text
4 vCPU
8GB RAM
```

```text
800.000 VNĐ/tháng
```

---

### Redis

```text
100.000 VNĐ/tháng
```

---

### Storage

```text
500GB - 1TB
```

```text
300.000 VNĐ/tháng
```

---

### Email

```text
50.000 email/tháng
```

```text
500.000 VNĐ/tháng
```

---

### Monitoring

Grafana + Prometheus

```text
200.000 VNĐ/tháng
```

---

### Backup

```text
300.000 VNĐ/tháng
```

---

### Domain

```text
42.000 VNĐ/tháng
```

---

## Tổng chi phí Early Growth

| Hạng mục   | Chi phí |
| ---------- | ------- |
| App Server | 800.000 |
| Database   | 800.000 |
| Redis      | 100.000 |
| Storage    | 300.000 |
| Email      | 500.000 |
| Monitoring | 200.000 |
| Backup     | 300.000 |
| Domain     | 42.000  |

### Tổng

```text
3.042.000 VNĐ/tháng
```

Làm tròn:

```text
3.000.000 VNĐ/tháng
```

---

# Giai đoạn 3 - Scale

## Quy mô

- 100+ khách hàng
- 50.000+ học viên
- Nhiều trung tâm lớn

## Kiến trúc

```text
Cloudflare
     │
Load Balancer
     │
 ┌───┴───┐
API 1   API 2
     │
PostgreSQL
     │
Redis
     │
Object Storage
```

---

## Chi phí

### Load Balancer

```text
500.000 VNĐ/tháng
```

---

### API Server 1

```text
1.500.000 VNĐ/tháng
```

---

### API Server 2

```text
1.500.000 VNĐ/tháng
```

---

### PostgreSQL

```text
3.000.000 VNĐ/tháng
```

---

### Redis

```text
500.000 VNĐ/tháng
```

---

### Storage

```text
1.000.000 VNĐ/tháng
```

---

### Email

```text
1.000.000 VNĐ/tháng
```

---

### Monitoring

```text
500.000 VNĐ/tháng
```

---

### Backup

```text
1.000.000 VNĐ/tháng
```

---

### Domain

```text
42.000 VNĐ/tháng
```

---

## Tổng chi phí Scale

| Hạng mục      | Chi phí   |
| ------------- | --------- |
| Load Balancer | 500.000   |
| API Server 1  | 1.500.000 |
| API Server 2  | 1.500.000 |
| PostgreSQL    | 3.000.000 |
| Redis         | 500.000   |
| Storage       | 1.000.000 |
| Email         | 1.000.000 |
| Monitoring    | 500.000   |
| Backup        | 1.000.000 |
| Domain        | 42.000    |

### Tổng

```text
9.542.000 VNĐ/tháng
```

Làm tròn:

```text
10.000.000 VNĐ/tháng
```

---

# Revenue vs Infrastructure

## Pro

```text
699.000 VNĐ/tháng
```

## Ultra

```text
2.490.000 VNĐ/tháng
```

---

## Ví dụ doanh thu

### 10 khách hàng Pro

```text
6.990.000 VNĐ/tháng
```

---

### 20 khách hàng Pro

```text
13.980.000 VNĐ/tháng
```

---

### 50 khách hàng Pro

```text
34.950.000 VNĐ/tháng
```

---

### 20 khách hàng Pro + 10 khách hàng Ultra

```text
13.980.000
+
24.900.000

= 38.880.000 VNĐ/tháng
```

---

# Tổng kết

| Giai đoạn    | Chi phí vận hành      |
| ------------ | --------------------- |
| MVP          | ~700.000 VNĐ/tháng    |
| Early Growth | ~3.000.000 VNĐ/tháng  |
| Scale        | ~10.000.000 VNĐ/tháng |

---

# Khuyến nghị

1. Bắt đầu với một VPS duy nhất.
2. Chỉ tách Database khi đạt trên 20 khách hàng.
3. Chỉ triển khai Load Balancer khi thực sự cần scale.
4. Dùng Cloudflare R2 để giảm chi phí lưu trữ.
5. Dùng Resend Free Tier trong giai đoạn đầu.
6. Thiết lập backup ngay từ ngày đầu tiên.
7. Kiểm tra khả năng restore backup hàng tháng.
8. Tập trung vào bán hàng và sản phẩm trước khi tối ưu hạ tầng.

Nguyên tắc quan trọng:

Infrastructure không phải là chi phí lớn nhất của SaaS.

Trong 2 năm đầu, chi phí lớn nhất thường là:

- Marketing
- Sales
- Customer Support
- Product Development

Server thường chỉ chiếm một phần nhỏ trong tổng chi phí vận hành.
