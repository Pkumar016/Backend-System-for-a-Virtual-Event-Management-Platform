const {
  create,
  getUserByUserEmail,
  getUserByUserId,
  getUsers,
  updateUser,
  deleteUser,
  addPreference,
  deletePreference,
  updatePreference
} = require("./userService");
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    body.role = 'attendee'; // Default role

    create(body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: 0,
          message: "Database connection error"
        });
      }
      return res.status(200).json({
        success: 1,
        data: results
      });
    });
  },
  login: (req, res) => {
    const body = req.body;
    getUserByUserEmail(body.email, (err, results) => {
      if (err) {
        console.log(err);
      }
      if (!results) {
        return res.json({
          success: 0,
          data: "Invalid email or password"
        });
      }
      const result = compareSync(body.password, results.password);
      if (result) {
        results.password = undefined;
        const jsontoken = sign({ result: results }, "qwe1234", {
          expiresIn: "1h"
        });
        return res.json({
          success: 1,
          message: "Login successfully",
          token: jsontoken
        });
      } else {
        return res.json({
          success: 0,
          data: "Invalid email or password"
        });
      }
    });
  },
  getUserByUserId: (req, res) => {
    const id = req.params.id;
    getUserByUserId(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not found"
        });
      }
      results.password = undefined;
      return res.json({
        success: 1,
        data: results
      });
    });
  },
  getUsers: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        data: results
      });
    });
  },
  updateUsers: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    updateUser(body, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      return res.json({
        success: 1,
        message: "Updated successfully"
      });
    });
  },
  deleteUser: (req, res) => {
    const data = req.body;
    deleteUser(data, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.json({
          success: 0,
          message: "Record not found"
        });
      }
      return res.json({
        success: 1,
        message: "User deleted successfully"
      });
    });
  },
  addPreference: (req, res) => {
    const userId = req.params.id;
    const preference = req.body.preference;

    getUserByUserId(userId, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Database connection error"
            });
        }

        if (!user) {
            return res.status(404).json({
                success: 0,
                message: "User not found"
            });
        }

        user.preferences.push(preference);

        updateUser(user, (err, updatedUser) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                message: "Preference added successfully",
                data: updatedUser
            });
        });
    });
},

deletePreference: (req, res) => {
  const userId = req.params.id;
  const preferenceIndex = parseInt(req.body.index); // Parse index as integer

  getUserByUserId(userId, (err, user) => {
      if (err) {
          console.log(err);
          return res.status(500).json({
              success: 0,
              message: "Database connection error"
          });
      }

      if (!user) {
          return res.status(404).json({
              success: 0,
              message: "User not found"
          });
      }

      // Check if preferences is an array
      if (!Array.isArray(user.preferences)) {
          return res.status(400).json({
              success: 0,
              message: "User preferences is not an array"
          });
      }

      // Check if preferenceIndex is a valid integer and within bounds
      if (isNaN(preferenceIndex) || preferenceIndex < 0 || preferenceIndex >= user.preferences.length) {
          return res.status(400).json({
              success: 0,
              message: "Invalid preference index"
          });
      }

      // Now you can safely use preferenceIndex as an integer
      user.preferences.splice(preferenceIndex, 1);

      updateUser(user, (err, updatedUser) => {
          if (err) {
              console.log(err);
              return res.status(500).json({
                  success: 0,
                  message: "Database connection error"
              });
          }
          return res.status(200).json({
              success: 1,
              message: "Preference deleted successfully",
              data: updatedUser
          });
      });
  });
},


updatePreference: (req, res) => {
    const userId = req.params.id;
    const preferenceIndex = req.body.index;
    const newPreference = req.body.preference;

    getUserByUserId(userId, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: 0,
                message: "Database connection error"
            });
        }

        if (!user) {
            return res.status(404).json({
                success: 0,
                message: "User not found"
            });
        }

        if (user.preferences.length <= preferenceIndex || preferenceIndex < 0) {
            return res.status(400).json({
                success: 0,
                message: "Invalid preference index"
            });
        }

        user.preferences[preferenceIndex] = newPreference;

        updateUser(user, (err, updatedUser) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: 0,
                    message: "Database connection error"
                });
            }
            return res.status(200).json({
                success: 1,
                message: "Preference updated successfully",
                data: updatedUser
            });
        });
    });
},
};