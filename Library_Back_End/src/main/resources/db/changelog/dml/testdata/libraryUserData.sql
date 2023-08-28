-- Insert LibraryUsers
INSERT INTO library_user (username, password, created_by_id, last_modified_by_id, creation_date, last_modified_date)
VALUES ('System', '$2a$10$fBOTa.nmO7XMV4hsuz4P7ejnHO3JMGmI.S72fNotKcniygIisiKKe', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO library_user (username, password, created_by_id, last_modified_by_id, creation_date, last_modified_date)
VALUES ('a', '$2a$10$cd.RcKIRS2q1nbUxI/3llewy6oQSVRn77ONIjRlr2/10iUTHsz04.', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO library_user (username, password, created_by_id, last_modified_by_id, creation_date, last_modified_date)
VALUES ('user', '$2a$10$zDCFfJLTykuRAg3hY8jqlOhyKLuWzEyHEpHkBFO0gJM8MfCLUrYia', 1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- Insert Roles
INSERT INTO user_role (user_id, role_id) VALUES (1, 1);
INSERT INTO user_role (user_id, role_id) VALUES (2, 1);
INSERT INTO user_role (user_id, role_id) VALUES (3, 2);