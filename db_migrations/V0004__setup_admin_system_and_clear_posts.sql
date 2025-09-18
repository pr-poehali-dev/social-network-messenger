-- Очистка тестовых постов и создание специального админ аккаунта

-- Очистка тестовых постов
UPDATE posts SET content = '' WHERE id > 0;
UPDATE posts SET likes_count = 0, comments_count = 0 WHERE id > 0;

-- Добавление специального админ аккаунта Himo
INSERT INTO users (username, email, full_name, bio, is_online, is_admin, user_id, password_hash) VALUES
('Himo', 'admin@system.local', 'System Administrator', 'System Administrator Account', true, true, 'ADMIN001', '$2b$12$LQv3c1yX8LjjRF8PkM8eWu9gH0k5zF9xN3t8vR2pL1mQ4sW6uE7yK');

-- Обновление активности админа
INSERT INTO user_activity (user_id, last_activity, is_online) VALUES
((SELECT id FROM users WHERE username = 'Himo'), CURRENT_TIMESTAMP, true);

-- Создание таблицы для логов администратора
CREATE TABLE admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,
    target_user_id INTEGER REFERENCES users(id),
    target_data TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для чтения переписок админом
CREATE TABLE admin_message_access (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id),
    user1_id INTEGER REFERENCES users(id),
    user2_id INTEGER REFERENCES users(id),
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT
);

-- Создание индексов для админ функций
CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_target_user ON admin_logs(target_user_id);
CREATE INDEX idx_admin_message_access_users ON admin_message_access(user1_id, user2_id);