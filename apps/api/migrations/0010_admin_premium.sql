-- users: premium дуусах хугацаа (admin-аас +1 сар гэх мэт)
ALTER TABLE users ADD COLUMN premium_until TEXT NULL;

-- Анхны admin: D1 дээр гараар `UPDATE users SET is_admin = 1 WHERE email = '...';`
