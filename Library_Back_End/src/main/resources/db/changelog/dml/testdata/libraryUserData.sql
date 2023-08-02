-- Insert LibraryUsers
INSERT INTO library_user (username, password) VALUES ('System', 'encoded_password_for_system');
INSERT INTO library_user (username, password) VALUES ('user', 'encoded_password_for_user');
INSERT INTO library_user (username, password) VALUES ('a', 'encoded_password_for_a');

-- Insert Roles
INSERT INTO user_role (user_id, role_id) SELECT id, 'ADMIN' FROM library_user WHERE username = 'System';
INSERT INTO user_role (user_id, role_id) SELECT id, 'CUSTOMER' FROM library_user WHERE username = 'user';
INSERT INTO user_role (user_id, role_id) SELECT id, 'ADMIN' FROM library_user WHERE username = 'a';