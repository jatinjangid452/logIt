const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;
//      const normalizedEmail = email.toLowerCase();
//     const existingUser = await User.findOne({ normalizedEmail });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const user = await User.create({
//       name,
//       email : normalizedEmail,
//       password: hashedPassword,
//       role,
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       user,
//     });
//   } catch (err) {
//     console.error("Registration error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase();

    const emailExists = await User.findOne({ email: normalizedEmail });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }


    const nameAndRoleExists = await User.findOne({ 
      name: name.trim(), 
      role 
    });

    if (nameAndRoleExists) {
      return res.status(400).json({ message: "Name already exists with same role" });
    }
    const allUsers = await User.find();
    for (const u of allUsers) {
      const isSamePassword = await bcrypt.compare(password, u.password);
      if (isSamePassword) {
        return res.status(400).json({ message: "Password already used by another user" });
      }
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = req.body.email.toLowerCase();
    const user = await User.findOne({ email:normalizedEmail });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_USER,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const getAllManagers = async (req, res) => {
  try {
    const users = await User.find({ role: "Manager" }, "-password"); 
    res.status(200).json(users);
  } catch (err) {
    console.error("Fetch users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role?.toLowerCase() === "admin") {
      return res.status(403).json({ message: "Admins cannot be deleted" });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully ✅" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTechnicians = async (req, res) => {
  try {
    const technicians = await User.find({ role: "technician" }, "-password");
    res.status(200).json(technicians);
  } catch (err) {
    console.error("Fetch technicians error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { registerUser, loginUser, getAllUsers, getTechnicians, getAllManagers, deleteUser,getLoggedInUser};
