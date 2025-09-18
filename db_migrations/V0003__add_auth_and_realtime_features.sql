-- Обновление структуры для авторизации и уникальных ID

-- Добавление уникальных ID и данных для авторизации
ALTER TABLE users ADD COLUMN user_id VARCHAR(20) UNIQUE;
ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN is_banned BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN banned_reason TEXT;
ALTER TABLE users ADD COLUMN banned_by INTEGER REFERENCES users(id);
ALTER TABLE users ADD COLUMN banned_at TIMESTAMP;

-- Генерируем уникальные ID для существующих пользователей
UPDATE users SET user_id = 'USER' || LPAD(id::text, 6, '0') WHERE user_id IS NULL;

-- Добавление таблицы для сессий пользователей
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Обновление структуры сообщений для real-time
ALTER TABLE messages ADD COLUMN message_type VARCHAR(20) DEFAULT 'text';
ALTER TABLE messages ADD COLUMN edited_at TIMESTAMP;
ALTER TABLE messages ADD COLUMN is_edited BOOLEAN DEFAULT false;

-- Таблица для отслеживания онлайн статуса
CREATE TABLE user_activity (
    user_id INTEGER PRIMARY KEY REFERENCES users(id),
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_online BOOLEAN DEFAULT false,
    socket_id VARCHAR(255)
);

-- Таблица для хранения блокировок пользователей
CREATE TABLE user_blocks (
    id SERIAL PRIMARY KEY,
    blocker_id INTEGER REFERENCES users(id),
    blocked_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(blocker_id, blocked_id)
);

-- Индексы для быстрого поиска
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_activity_online ON user_activity(is_online);
CREATE INDEX idx_messages_real_time ON messages(receiver_id, created_at DESC);