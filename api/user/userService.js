const pool = require("../../database/database");

module.exports = {
  create: (data, callBack) => {
    const defaultRole = 'attendee'; // Default role
    console.log(data); // Log the data object

    pool.query(
      `INSERT INTO users(firstName, lastName, gender, email, password, number, preferences, role) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.first_name,
        data.last_name,
        data.gender,
        data.email,
        data.password,
        data.number,
        JSON.stringify(data.preferences), // Convert preferences array to JSON string
        defaultRole // Assign default role to the 'role' column
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          callBack(null, results);
        }
      }
    );
  },
  getUserByUserEmail: (email, callBack) => {
    pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          callBack(null, results[0]);
        }
      }
    );
  },
  getUserByUserId: (id, callBack) => {
    pool.query(
      'SELECT id, firstName, lastName, gender, email, number, COALESCE(preferences, "[]") as preferences FROM users WHERE id = ?',
      [id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          // Parse preferences from JSON string to array
          results.forEach(user => {
            user.preferences = JSON.parse(user.preferences);
          });
          callBack(null, results[0]);
        }
      }
    );
  },
  getUsers: callBack => {
    pool.query(
      'SELECT id, firstName, lastName, gender, email, password, number, preferences, role FROM users',
      [],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          callBack(null, results);
        }
      }
    );
  },
  updateUser: (data, callBack) => {
    pool.query(
      'UPDATE users SET firstName=?, lastName=?, gender=?, email=?, password=?, number=? WHERE id = ?',
      [
        data.first_name,
        data.last_name,
        data.gender,
        data.email,
        data.password,
        data.number,
        data.id
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          callBack(null, results);
        }
      }
    );
  },
  deleteUser: (data, callBack) => {
    pool.query(
      'DELETE FROM users WHERE id = ?',
      [data.id],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          callBack(null, results);
        }
      }
    );
  },
  addPreference: (userId, preference, callBack) => {
    pool.query(
      'UPDATE users SET preferences = JSON_ARRAY_APPEND(preferences, "$", ?) WHERE id = ?',
      [preference, userId],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          callBack(null, results);
        }
      }
    );
  },
  deletePreference: (userId, preferenceIndex, callBack) => {
    pool.query(
      'UPDATE users SET preferences = JSON_REMOVE(preferences, ?) WHERE id = ?',
      [preferenceIndex, userId],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          callBack(null, results);
        }
      }
    );
  },
  updatePreference: (userId, preferenceIndex, newPreference, callBack) => {
    pool.query(
      'UPDATE users SET preferences = JSON_SET(preferences, CONCAT("$[", ?, "]"), ?) WHERE id = ?',
      [preferenceIndex, newPreference, userId],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        } else {
          callBack(null, results);
        }
      }
    );
  }
};
