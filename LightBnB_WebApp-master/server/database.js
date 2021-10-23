const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      if (result.rows[0]) {
        return result.rows[0]
      }
      return null;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      if (result.rows[0]) {
        return result.rows[0]
      }
      return null;
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
  return pool
    .query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`, [user.name, user.email, user.password])
    .then((result) => {
      // console.log(result.rows);
      return result.rows[0]
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(`
    SELECT properties.*, reservations.*, avg(rating) AS average_rating
    FROM reservations
    JOIN properties ON properties.id = reservations.property_id
    JOIN property_reviews 
    ON property_reviews.reservation_id = reservations.id
    WHERE reservations.guest_id = $1 
    AND reservations.end_date < Now()
    GROUP BY properties.id, reservations.id
    ORDER BY start_date
    LIMIT $2;`, [guest_id, limit])
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function(options, limit = 10) {
//   const limitedProperties = {};
//   for (let i = 1; i <= limit; i++) {
//     limitedProperties[i] = properties[i];
//   }
//   return Promise.resolve(limitedProperties);
// }
const getAllProperties = (options, limit = 10) => {
  const queryArray = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) AS average_rating
  FROM properties
  JOIN property_reviews 
  ON property_id = properties.id`;

  if (options.city) {
    queryArray.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $$ queryArray.length} `;
  }

  if (options.owner_id) {
    queryArray.push(options.owner_id);
    if (!queryString.includes('WHERE')) {
      queryString += `WHERE owner_id = $$ queryArray.length} `;
    } else {
      queryString += `AND owner_id = $$ queryArray.length} `;
    }
  }

  if (options.min_cost_per_night) {
    queryArray.push(options.min_cost_per_night * 100);
    if (!queryString.includes('WHERE')) {
      queryString += `WHERE cost_per_night >= $$ queryArray.length} `;
    } else {
      queryString += `AND cost_per_night >= $$ queryArray.length} `;
    }
  }

  if (options.max_cost_per_night) {
    queryArray.push(options.max_cost_per_night * 100);
    if (!queryString.includes('WHERE')) {
      queryString += `WHERE cost_per_night <= $$ queryArray.length} `;
    } else {
      queryString += `AND cost_per_night <= $$ queryArray.length} `;
    }
  }
  queryString += `GROUP BY properties.id`

  if (options.lowest_rating) {
    queryArray.push(options.lowest_rating);
    queryString += `
  HAVING avg(property_reviews.rating) >= $$ queryArray.length} `;
  }

  queryArray.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $$ queryArray.length};
  `
  console.log(queryString, queryArray);
  return pool.query(queryString, queryArray).then((result) => result.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const queryArray = [property.owner_id,
  property.title,
  property.description,
  property.thumbnail_photo_url,
  property.cover_photo_url,
  property.cost_per_night,
  property.street,
  property.city,
  property.province,
  property.post_code,
  property.country,
  property.parking_spaces,
  property.number_of_bathrooms,
  property.number_of_bedrooms
  ];
  const queryString = `
  INSERT INTO properties (owner_id, 
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13 ,$14)
    RETURNING *;
  `
  return pool.query(queryString, queryArray).then((result) => result.rows[0]);
};
exports.addProperty = addProperty;
