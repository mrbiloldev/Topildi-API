# Topildi API

Topildi — yo‘qolgan va topilgan buyumlar uchun yaratilgan REST API.

Loyiha foydalanuvchilarga yo‘qolgan buyumlari haqida e’lon berish yoki topib olingan buyumlarni joylashtirish imkonini beradi.

Topilgan buyumlar uchun maxfiy savol va javob tizimi mavjud. Buyumga da’vo qilgan foydalanuvchi maxfiy savolga javob beradi va javob to‘g‘ri bo‘lsa, e’lon egasiga da’vo yuboriladi.

---

## Texnologiyalar

Loyihada quyidagi texnologiyalar ishlatilgan:

- Node.js
- Express.js
- PostgreSQL
- TypeORM
- JWT
- bcrypt
- Joi
- Redis
- Nodemailer
- Multer
- dotenv

---

## Asosiy imkoniyatlar

### Authentication

- Foydalanuvchini ro‘yxatdan o‘tkazish
- Email orqali OTP tasdiqlash
- OTP kodni qayta yuborish
- Login
- JWT authentication
- Role-based authorization
- Forgot password
- Reset password
- Joriy foydalanuvchi ma’lumotlarini olish

### Categories

- Barcha kategoriyalarni olish
- Yangi kategoriya yaratish
- Kategoriyani tahrirlash
- Kategoriyani o‘chirish

Kategoriya yaratish, o‘zgartirish va o‘chirish faqat `admin` uchun mavjud.

### Items

Foydalanuvchi ikki xil e’lon yaratishi mumkin:

- `lost` — yo‘qolgan buyum
- `found` — topilgan buyum

Item imkoniyatlari:

- Barcha e’lonlarni olish
- Bitta e’lonni olish
- Foydalanuvchining o‘z e’lonlarini olish
- Yangi e’lon yaratish
- E’lonni tahrirlash
- E’lonni o‘chirish
- Rasmlar yuklash
- Yo‘qolgan buyum uchun `Men topdim` xabarini yuborish

### Claims

`found` turidagi e’lon uchun foydalanuvchi buyumga da’vo yuborishi mumkin.

Da’vo yuborishda:

- maxfiy savolga javob beriladi
- javob bcrypt orqali tekshiriladi
- to‘g‘ri javobda claim `pending` bo‘ladi
- noto‘g‘ri javobda claim `rejected` bo‘ladi
- bir foydalanuvchi uchun noto‘g‘ri urinishlar soni cheklangan

E’lon egasi:

- claimlarni ko‘rishi
- claimni approve qilishi
- claimni reject qilishi mumkin

Claim approve qilinganda item holati `returned` ga o‘tadi.

---

# Project Structure

```text
Topildi API/
│
├── src/
│   ├── config/
│   │   ├── data-source.js
│   │   ├── mailer.js
│   │   └── redis.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── category.controller.js
│   │   ├── claims.controller.js
│   │   └── items.controller.js
│   │
│   ├── entities/
│   │   ├── user.entity.js
│   │   ├── category.entity.js
│   │   ├── items.entity.js
│   │   ├── item-images.entity.js
│   │   └── claims.entity.js
│   │
│   ├── helpers/
│   │   ├── hash.js
│   │   ├── jwt.js
│   │   └── otp.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── validate.middleware.js
│   │   ├── upload.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── category.routes.js
│   │   ├── claim.routes.js
│   │   └── items.routes.js
│   │
│   ├── validation/
│   │   ├── auth.validation.js
│   │   ├── category.validation.js
│   │   ├── claims.validation.js
│   │   └── item.validation.js
│   │
│   └── index.js
│
├── uploads/
│   └── items/
│
├── .env
├── .gitignore
├── package.json
└── README.md