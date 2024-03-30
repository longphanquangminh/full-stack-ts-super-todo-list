# Hướng dẫn sử dụng ứng dụng Quản lý Công Việc

Một ứng dụng Quản lý Công việc được xây dựng bằng Preact cho phần giao diện người dùng và Hono cho phần backend. Dưới đây là hướng dẫn cài đặt và chạy cả hai dự án front-end và back-end.

## Front-End (Preact)

### Thiết lập Dự án

1. **Sao chép Repository:**

   ```bash
   git clone https://github.com/longphanquangminh/full-stack-ts-super-todo-list.git
   ```

2. **Di chuyển đến Thư mục Front-End:**

   ```bash
   cd frontend
   ```

3. **Cài đặt các Thư viện phụ thuộc:**
   ```bash
   npm install
   ```

### Chạy Front-End

Để khởi động máy chủ front-end:

```bash
npm run dev
```

Sau khi máy chủ chạy, bạn có thể truy cập ứng dụng tại `http://localhost:5173`.

## Back-End (Hono)

### Thiết lập Dự án

1. **Di chuyển đến Thư mục Back-End:**

   ```bash
   cd backend
   ```

2. **Cài đặt các Thư viện phụ thuộc:**
   ```bash
   npm install
   ```

### Chạy Back-End

Để khởi động máy chủ back-end:

```bash
npm run dev
```

Để truy cập tài liệu API và kiểm tra các điểm cuối, hãy di chuyển đến:

```
http://localhost:3000/swagger
```

## Tech stacks

### Front-End:

- Preact
- TypeScript
- PrimeReact
- Axios

### Back-End và Database:

- Hono
- TypeScript
- DrizzleORM
- Neon
- Swagger
- Thunder Client

## Ghi chú Bổ sung

- **Localhost Front-End:** Front-end chạy trên `http://localhost:5173`.
- **Localhost Back-End:** Back-end chạy trên `http://localhost:3000`.
- **Kiểm Tra API:** Tài liệu Swagger để kiểm tra API có sẵn tại `http://localhost:3000/swagger`.

## Link hữu ích

🌟 Youtube video: [Link to Youtube video](https://www.youtube.com/watch?v=7XJ2B-5b_M0) (chỉ có thể xem video qua đường link này)

##

Project được phát triển bởi [Phan Quang Minh Long](https://github.com/longphanquangminh).
