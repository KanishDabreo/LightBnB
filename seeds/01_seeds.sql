INSERT INTO user (name, email, password)
VALUES ('Inuyasha Halfdemon', 'inuyasha@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Kagome Higurashi', 'kagome@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
('Sesshoumaru Demonbrother','sesshoumaru@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- ADD THUMBNAIL AND COVER PHOTO URLS 
INSERT INTO properties ( owner_id, title,
  description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'Kappei Yamaguchi', 'description', 'thumbnail_photo_url', 'cover_photo_url', 100, 1, 1, 1, 'Japan', 'street', 'Toyko', 'Kanto region', 'L6Z2A1', true);,
(2,'Satsuki Yukino', 'description', 'thumbnail_photo_url', 'cover_photo_url', 150, 1, 2, 2, 'Japan', 'street', 'Toyko', 'Kanto region', 'L6Z2A2', true),
(3,'Ken Narita', 'description','thumbnail_photo_url', 'cover_photo_url', 200, 1, 3, 4, 'Japan', 'street', 'Toyko', 'Kanto region','L6Z2A2', true);

INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 3, 4, 'message'),
(2, 1, 4, 5, 'message'),
(3, 1, 5, 4, 'message');
