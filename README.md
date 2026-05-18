# auth# 🚀 Project Microservices

Hệ thống backend được xây dựng theo kiến trúc **Microservices**, gồm các service độc lập giao tiếp với nhau qua **RabbitMQ**.

---

## 📦 Các Service

| Service | Port | Mô tả |
|---|---|---|
| **API Gateway** | `3000` | Điểm vào duy nhất, điều phối request đến các service |
| **Auth Service** | `3001` | Xác thực người dùng, cấp JWT token |
| **User Service** | `3002` | Quản lý thông tin người dùng |
| **File Service** | `3008` | Upload và quản lý file/ảnh |
| **Email Service** | — | Gửi email thông báo qua RabbitMQ |

---

## 🛠️ Yêu cầu hệ thống

Trước khi chạy project, đảm bảo đã cài đặt:

- [Docker](https://www.docker.com/) & Docker Compose
- Node.js >= 18
- Các service infrastructure: **MongoDB**, **Redis**, **RabbitMQ**, **MailHog**

---

## ⚙️ Cấu hình môi trường

Mỗi service có file `.env` riêng. Tạo file `.env` từ file mẫu:

```bash
cp .env.example .env
```

### API Gateway — `.env`

```dotenv
SECRET_KEY=your-secret-key-here
NEXT_PUBLIC_API_URL=http://your-domain:3000/api/v1
API_URL=http://your-domain:3000/api/v1
NEXT_PUBLIC_HOST=http://your-domain:3000

SERVICE_AUTH_URL=http://your-auth-service-host:3001
SERVICE_PHOTO_URL=http://your-file-service-host:3008
SERVICE_USER_URL=http://your-user-service-host:3002
SERVICE_FRONT_END_URL=http://your-frontend-host:3030
```

### Auth Service — `.env`

```dotenv
RABBITMQ_HOST=your-rabbitmq-host
RABBITMQ_PORT=5672
RABBITMQ_USER=your-rabbitmq-user
RABBITMQ_PASS=your-rabbitmq-password

HOST_DB=mongodb://your-mongodb-host
PORT_DB=27017
DATABASE=AUTH-SERVICE

PORT_SERVICE=3001
HOST_SERVICE=your-service-host

CACHE_HOST=redis://your-redis-host
CACHE_PORT=6379

SECRET_KEY=your-secret-key-here
```

### User Service — `.env`

```dotenv
RABBITMQ_HOST=your-rabbitmq-host
RABBITMQ_PORT=5672
RABBITMQ_USER=your-rabbitmq-user
RABBITMQ_PASS=your-rabbitmq-password

HOST_DB=mongodb://your-mongodb-host
PORT_DB=27017
DATABASE=USER-SERVICE

PORT_SERVICE=3002
HOST_SERVICE=your-service-host

CACHE_HOST=redis://your-redis-host
CACHE_PORT=6379

SECRET_KEY=your-secret-key-here
SECRET_INTERNAL=your-internal-secret-here
```

### Email Service — `.env`

```dotenv
RABBITMQ_HOST=your-rabbitmq-host
RABBITMQ_PORT=5672
RABBITMQ_USER=your-rabbitmq-user
RABBITMQ_PASS=your-rabbitmq-password

HOST_SMTP=your-smtp-host
PORT_SMTP=1025
AUTH_GOOGLE_EMAIL=your-email@gmail.com

FRONT_END_URL=http://your-frontend-host:3030
```

---

## 🔑 Mô tả các biến môi trường

| Biến | Mô tả | Bắt buộc |
|---|---|---|
| `SECRET_KEY` | JWT signing key | ✅ |
| `SECRET_INTERNAL` | Key xác thực nội bộ giữa các service | ✅ |
| `RABBITMQ_HOST` | Host của RabbitMQ | ✅ |
| `RABBITMQ_PORT` | Port RabbitMQ (mặc định: `5672`) | ✅ |
| `RABBITMQ_USER` | Username RabbitMQ | ✅ |
| `RABBITMQ_PASS` | Password RabbitMQ | ✅ |
| `HOST_DB` | MongoDB connection URI | ✅ |
| `PORT_DB` | Port MongoDB (mặc định: `27017`) | ✅ |
| `DATABASE` | Tên database | ✅ |
| `CACHE_HOST` | Redis connection URI | ✅ |
| `CACHE_PORT` | Port Redis (mặc định: `6379`) | ✅ |
| `HOST_SMTP` | SMTP server host | ✅ (Email Service) |
| `PORT_SMTP` | SMTP server port | ✅ (Email Service) |
| `AUTH_GOOGLE_EMAIL` | Gmail dùng để gửi email | ✅ (Email Service) |
| `SERVICE_AUTH_URL` | URL nội bộ của Auth Service | ✅ (API Gateway) |
| `SERVICE_USER_URL` | URL nội bộ của User Service | ✅ (API Gateway) |
| `SERVICE_PHOTO_URL` | URL nội bộ của File Service | ✅ (API Gateway) |
| `FRONT_END_URL` | URL của Frontend | ✅ |

---

## 🚀 Hướng dẫn chạy project

### Chạy bằng Docker Compose

```bash
# Build và chạy toàn bộ hệ thống
docker-compose up -d --build

# Kiểm tra trạng thái các container
docker-compose ps

# Xem log của một service
docker-compose logs -f auth-service
```

### Chạy từng service (Development)

```bash
# Cài dependencies
npm install

# Chạy ở môi trường development
npm run dev

# Chạy ở môi trường production
npm run start
```

---

## ⚠️ Lưu ý bảo mật

- **Không** commit file `.env` lên git. Đảm bảo `.env` đã có trong `.gitignore`
- **Luôn** dùng file `.env.example` làm template, không để giá trị thật trong file này
- `SECRET_KEY` và `SECRET_INTERNAL` nên được tạo ngẫu nhiên và **rotate định kỳ**
- Không dùng thông tin mặc định (`guest/guest`) của RabbitMQ ở môi trường production

---

## 📁 Cấu trúc thư mục

```
.
├── api-gateway/
│   ├── .env.example
│   └── ...
├── auth-service/
│   ├── .env.example
│   └── ...
├── user-service/
│   ├── .env.example
│   └── ...
├── file-service/
│   ├── .env.example
│   └── ...
├── email-service/
│   ├── .env.example
│   └── ...
└── docker-compose.yml
```