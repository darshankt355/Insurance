import jwt from "jsonwebtoken";
import JWT_SECRET from "../config.js";
import bcrypt from "bcrypt";
import User from "../modules/users.js";
import insuranceCategory from "../modules/insuranceCategory.js";


const createFresh = (user) => {
  return jwt.sign({
    userId: user._id,
    role: user.role
  }, JWT_SECRET, {
    expiresIn: "1h",
  });
}

const createRefresh = (user) => {
  return jwt.sign({
    userId: user._id,
    role: user.role
  }, JWT_SECRET, {
    expiresIn: "7d",
  });
}


const handleRegister = async (req, res) => {
  try {
    const body = req.body;

    const existingUser = await User.findOne({
      $or: [
        { email: body.email },
        { phone: body.phone },
        { username: body.username }
      ]
    });


    if (existingUser) {
      if (existingUser.email === body.email) {
        return res.status(400).json({ message: "Email already exists" });
      }

      if (existingUser.phone === body.phone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }

      if (existingUser.username === body.username) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }


    const hashedPassword = await bcrypt.hash(body.password, 10);


    const user = new User({
      firstName: body.firstName,
      middleName: body.middleName,
      lastName: body.lastName,
      username: body.username,
      email: body.email,
      phone: body.phone,
      password: hashedPassword,
      gender: body.gender,
      dateOfBirth: body.dateOfBirth,
      role: body.role || "consumer"
    });

    if(body.firstName === "" || body.username === "" || body.email === "" || body.phone === "" || body.password === ""  || body.gender === "" || body.dateOfBirth === ""){
      return res.status(400).json({ message: "Please fill in all fields" })
    }

    await user.save();


    return res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    console.error("Register Error:", error);


    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      return res.status(400).json({
        message: `${field} already exists`
      });
    }

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


const handleLogin = async (req, res) => {
  try {
    const body = req.body;
    const user = await User.findOne({
      $or: [
        { email: body.identifier },
        { phone: body.identifier },
        { username: body.identifier }
      ]
    });
    if (!user) {
      return res.status(401).json({ message: "User is not found " })
    }
    const match = await bcrypt.compare(body.password, user.password)
    if (!match) {
      return res.status(400).json({ message: "Password is incorrect!! " })
    }

    const freshToken = createFresh(user)
    const refreshToken = createRefresh(user)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    })
    if (freshToken) {
      return res.status(200).json({
        message: "Login success",
        freshToken,
        role: user.role,
        user: {
          id: user._id,
          role: user.role
        }
      });
    } else {
      return res.status(400).json({ message: "Something went wrong" })
    }


  }
  catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
}

const handelRefershToken = (req, res) => {
  const token = createFresh(req.user)
  if (token) {
    return res.status(201).json({ token })
  }
  else {
    return res.status(400).json({ message: "Something went wrong" })
  }
}


const handelForgetPassword = async (req, res) => {
  try {
    const body = req.body;
    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await User.findOneAndUpdate({email:body.email
    },
      {
        $set: { password: hashedPassword }
      }
    );
    if (body.identifier === "") {
      return res.status(401).json({ message: "User name is null" })
    }
    if (!user) {
      return res.status(401).json({ message: "User is not found " })
    }
    else {
      return res.status(200).json({ message: "password updated" })

    }
  } catch (err) {
    console.error("Error updating password:", err);
  }
}

const handleGetUsers = async (req, res) => {
  const body = req.body;
  if (body.role == "All") {
    const users = await User.find({})
    return res.status(201).json(users)
  }
  else if (body.role == "admin" || body.role == "employee" || body.role == "consumer") {
    const users = await User.find({ role: body.role })
    return res.status(201).json(users)
  }
  else {
    return res.status(400).json({ message: "Invalid role" })
  }
}
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

const handleUserProfile=async(req,res)=>{
  try {
    const userId = req.user.userId;;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
}


export { handleRegister, handleLogin, handelRefershToken, handelForgetPassword, handleGetUsers, getUserById, handleUserProfile};
