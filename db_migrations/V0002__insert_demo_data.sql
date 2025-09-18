-- Добавление тестовых данных для демонстрации

-- Добавление пользователей
INSERT INTO users (username, email, full_name, bio, is_online) VALUES
('alex_petrov', 'alex@example.com', 'Алексей Петров', 'Любитель фотографии и путешествий', true),
('maria_ivanova', 'maria@example.com', 'Мария Иванова', 'Дизайнер и творческая личность', false),
('dmitry_kozlov', 'dmitry@example.com', 'Дмитрий Козлов', 'Фотограф и видеограф', true),
('anna_sidorova', 'anna@example.com', 'Анна Сидорова', 'Маркетолог и блогер', false);

-- Добавление постов
INSERT INTO posts (user_id, content, likes_count, comments_count) VALUES
(1, 'Отличная погода сегодня! Решил прогуляться по парку. Как дела у вас?', 12, 3),
(2, 'Закончила новый проект! Очень довольна результатом 🚀', 8, 5),
(3, 'Кто-нибудь знает хорошие места для фотосессии в городе?', 15, 7),
(4, 'Сегодня изучаю новые техники маркетинга. Очень интересно!', 6, 2);

-- Добавление лайков
INSERT INTO likes (user_id, post_id) VALUES
(2, 1), (3, 1), (4, 1),
(1, 2), (3, 2), (4, 2),
(1, 3), (2, 3), (4, 3),
(1, 4), (2, 4), (3, 4);

-- Добавление комментариев
INSERT INTO comments (user_id, post_id, content) VALUES
(2, 1, 'Да, погода действительно замечательная!'),
(3, 1, 'А я вчера был в том же парке'),
(1, 2, 'Поздравляю с завершением проекта!'),
(4, 3, 'Рекомендую парк Горького для фотосессий');

-- Добавление дружеских связей
INSERT INTO friendships (requester_id, addressee_id, status) VALUES
(1, 2, 'accepted'),
(1, 3, 'accepted'),
(2, 3, 'accepted'),
(2, 4, 'accepted'),
(3, 4, 'pending');

-- Добавление сообществ
INSERT INTO communities (name, description, members_count, created_by) VALUES
('Программисты', 'Обсуждение технологий и кода', 1250, 1),
('Фотография', 'Делимся снимками и техниками', 856, 3),
('Путешествия', 'Советы и впечатления о поездках', 2100, 2),
('Дизайн', 'Творчество и вдохновение', 645, 2);

-- Добавление участников сообществ
INSERT INTO community_members (user_id, community_id, role) VALUES
(1, 1, 'owner'),
(2, 1, 'member'),
(3, 1, 'member'),
(1, 2, 'member'),
(3, 2, 'owner'),
(4, 2, 'member'),
(2, 3, 'owner'),
(1, 3, 'member'),
(4, 3, 'member'),
(2, 4, 'owner'),
(4, 4, 'admin');

-- Добавление сообщений
INSERT INTO messages (sender_id, receiver_id, content, is_read) VALUES
(1, 2, 'Привет! Как дела?', true),
(2, 1, 'Привет! Всё отлично, спасибо!', true),
(1, 2, 'Увидимся завтра?', false),
(3, 1, 'Спасибо за совет по фотографии!', true),
(4, 2, 'Отличный проект получился!', false);