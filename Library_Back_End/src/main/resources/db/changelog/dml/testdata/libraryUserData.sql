-- Insert LibraryUsers
INSERT INTO library_user (username, password, created_by_id, last_modified_by_id, creation_date, last_modified_date)
VALUES ('System', 'System', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO library_user (username, password, created_by_id, last_modified_by_id, creation_date, last_modified_date)
VALUES ('a', 'a', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO library_user (username, password, created_by_id, last_modified_by_id, creation_date, last_modified_date)
VALUES ('user', 'user', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- Insert Roles
INSERT INTO user_role (user_id, role_id) VALUES (1, 1);
INSERT INTO user_role (user_id, role_id) VALUES (2, 1);
INSERT INTO user_role (user_id, role_id) VALUES (3, 2);