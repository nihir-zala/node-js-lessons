const User = require("../models/user");

async function handleGetAllUsers(req, res) {
  const allDBUsers = await User.find({});

  return res.json(allDBUsers);
}

async function getUserById(req, res) {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.json(user);
}

async function storeUser(req, res) {
  const body = req.body;
  const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    gender: body.gender,
    jobTitle: body.job_title,
  });

  console.log(result);
  return res.status(201).json({ msg: "success" });
}

async function updateUserById(req, res) {
  await User.findByIdAndUpdate(req.params.id, {
    lastName: "Changed",
  });

  return res.json({ status: "success" });
}

async function deleteUserById(req, res) {
  await User.findByIdAndDelete(req.params.id);

  return res.json({ status: "success" });
}

module.exports = {
  handleGetAllUsers,
  getUserById,
  storeUser,
  updateUserById,
  deleteUserById,
};
