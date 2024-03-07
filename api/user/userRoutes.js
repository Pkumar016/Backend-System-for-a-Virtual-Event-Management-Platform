const router = require("express").Router();
const { checkToken } = require("../../auth/token");
const {checkAdmin} =require("../../auth/checkAdmin")
const {
  createUser,
  login,
  getUserByUserId,
  getUsers,
  updateUsers,
  deleteUser,
  addPreference,
  deletePreference,
  updatePreference
} = require("./userController");

router.get("/", checkToken, checkAdmin, getUsers);
router.post("/", createUser);
router.get("/:id", checkToken, checkAdmin, getUserByUserId);
router.post("/login", login);
router.patch("/", checkToken, updateUsers);
router.delete("/", checkToken, deleteUser);
router.post("/preference/:id", checkToken, checkAdmin, addPreference);
router.delete("/preference/:id", checkToken, checkAdmin, deletePreference);
router.put("/preference/:id", checkToken, checkAdmin, updatePreference);

module.exports = router;