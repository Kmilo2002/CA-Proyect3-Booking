const express = require("express");
const UserRouter = express.Router();
const User = require("../models/User");
const Reservations = require("../models/Reservations")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const authAdmin = require("../middleware/authAdmin")

let myUser;

const salt = bcrypt.genSaltSync(10)

const createToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN, {expiresIn:"7d"})
}

UserRouter.post("/register/user", async (req, res) => {
  const { name, surname, email, password, phone, city, country } = req.body;
  try {
    let userFind = await User.findOne({ email });
    if (userFind) {
      return res.status(400).send({
        success: false,
        message:
          "¡Un usuario ha usado esta dirección de correo para registrarse!",
      });
    }
    if (
      !name ||
      !surname ||
      !email ||
      !password ||
      !phone ||
      !city ||
      !country
    ) {
      return res.status(400).send({
        success: false,
        message: "¡No has rellando todos los datos necesarios!",
      });
    }
    if (name.lenght < 2) {
      return res.status(400).send({
        success: false,
        message: "¡Nombre demasiado corto!",
      });
    }
    if (name.lenght > 20) {
      return res.status(400).send({
        success: false,
        message: "¡Nombre demasiado largo!",
      });
    }
    if (password.lenght < 6) {
      return res.status(400).send({
        success: false,
        message: "¡Contraseña demasiado corta!",
      });
    }

    let passwordHash = bcrypt.hashSync(password, salt);

    myUser = new User({
      name,
      surname,
      email,
      password: passwordHash,
      phone,
      city,
      country,
    });

    const accessToken = createToken({id: myUser._id})

    await myUser.save();
    
    return res.status(201).send({
      success: true,
      message: "¡Usuario creado correctamente!",
      myUser,
      accessToken,
    });

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

UserRouter.post("/users/log_in", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFind = await User.findOne({email})
    if(userFind.banned === true){
      return res.status(403).send({
        success: false,
        message: `${userFind.name}, tu cuenta ha sido bloqueda`
      })
    }
    if(!userFind){
      return res.status(404).send({
        success: false,
        message: "Something is wrong, check your credentials!"
      })
    }
    const passwordOK = bcrypt.compareSync(password, userFind.password)
    if(!passwordOK){
      return res.status(404).send({
        success: false,
        message: "Something is wrong, check your credentials!"
      })
    }

    const accessToken = createToken({id: userFind._id})

    return res.status(200).send({
      success: true,
      message: "Usuario logueado correctamente",
      userFind,
      accessToken
    })

  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
})

UserRouter.post('/users_ban/:id', auth, authAdmin, async (req, res) => {
  const {id} = req.params
  try {
    // Busca al usuario en la base de datos
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found"
      });
    }

    // Si el usuario ya está baneado, no hagas nada
    if (user.banned === true) {
      return res.status(400).send({
        success: false,
        message: `El usuario ${user.name} está baneado`
      });
    }

    // Actualiza el campo "banned" en la base de datos
    user.banned = true;
    await user.save();

    res.status(200).send({
      success: true,
      message: `El usuario ${user.name} ha sido baneado`
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


UserRouter.get("/users", auth, authAdmin, async (req, res) => {
  try {
    // let usuarios = await User.find({}).select("name surname email") -> Esto es para buscar datos en específicos!!
    let usuarios = await User.find({});
    if (!usuarios) {
      return res.status(404).send({
        success: false,
        message: "¡There is no users in DB!",
      });
    }
    return res.status(200).send({
      success: true,
      usuarios,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

UserRouter.get("/user/:id", auth, authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    //let user = await User.findById(id).select("reservation").populate("reservation")
    //let user = await User.findById(id).select("reservation").populate({path:"reservation", select:"room days meals"})
    let user = await User.findById(id)
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "¡There is no user with that id!",
      });
    }
    return res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

UserRouter.get("/user_rev/:id", auth, authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    let user = await User.findById(id).select("reservation").populate({path:"reservation", select:"days persons meals"})
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "¡There is no user with that id!",
      });
    }
    return res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
})

UserRouter.get("/user", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user.id)
    if(!user){
      res.status(404).send({
        success: false,
        message: "User not found!"
      })
    }
    return res.status(200).send({
      success: true,
      message: "User found!",
      user
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
})

UserRouter.get("/user_rev", auth, async (req, res) => {
  try {
    //const { id } = req.params;
    let user = await User.findById(req.user.id).select("reservation").populate({path:"reservation", select:"days persons meals"})
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "¡There is no user with that id!",
      });
    }
    return res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
})

UserRouter.put("/users_modify", auth, async (req, res) => {
  try {
    //const {id} = req.params;
    const {password, email, phone, city, country} = req.body;
    let user = await User.findByIdAndUpdate(req.user.id, {password, email, phone, city, country})
    if(!user){
      return res.status(404).send({
        success: false,
        message: "User no found"
      })
    }
    return res.status(200).send({
      success: true,
      message: "User Updated!",
      user
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
})

UserRouter.put("/user_unbanned/:id", auth, authAdmin, async (req, res) => {
  try {
    const {id} = req.params;
    const userUpdate = await User.findByIdAndUpdate(id, {
      banned: false
    },
    {
      new: true
    })
    if(!userUpdate){
      return res.status(404).send({
        success: false,
        message: "User not found!"
      })
    }     
    return res.status(200).send({
      success: true,
      message: "User unbanned"
  })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
})

UserRouter.delete("/users/:reservationId", auth, async (req, res) => {
  try {
    const {reservationId} = req.params;
    await Reservations.findByIdAndUpdate(reservationId, {
      $pull:{
        registration: _id
      }
    })
    await User.findByIdAndDelete(req.user.id);
    if(!User){
      return res.status(404).send({
        success: false,
        message:"User not found!"
      })
    }
    return res.status(200).send({
      success: true,
      message: "User deleted correctly!"
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
})

UserRouter.delete("/user", auth, async (req, res) => {
  try {
    //const {id} = req.params;
    const {password} = req.body
    
    const user = await User.findById(req.user.id)
    console.log(user)
    if(!user){
      return res.status(401).send({
        success: false,
        message: "User not authorized"
      })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Wrong Password"
      })
    }
    await User.findByIdAndDelete(req.user.id)
    return res.status(200).send({
      success: true,
      message: "User deleted"
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
})


UserRouter.delete("/user/:id/:reservationId", auth, authAdmin, async (req, res) => {
  try {
    const {id, reservationId} = req.params;
    await Reservations.findByIdAndUpdate(reservationId, {
      $pull:{
        registration: _id
      }
    })
    await User.findByIdAndDelete(id)
    return res.status(200).send({
      success: true,
      message: "User deleted!!"
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
})

UserRouter.delete("/user/:id", auth, authAdmin, async (req, res) => {
  try {
    const {id} = req.params;
    const {password} = req.body
    
    const user = await User.findById(req.user.id)
    console.log(user)
    if(!user){
      return res.status(401).send({
        success: false,
        message: "User not authorized"
      })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Wrong Password"
      })
    }
    await User.findByIdAndDelete(id)
    return res.status(200).send({
      success: true,
      message: "User deleted"
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
})

UserRouter.delete("/users", auth, authAdmin, async (req, res) => {
  try {
    const {password} = req.body
    if(!password){
      res.status(400).send({
        success: false,
        message: "Introduzca contraseña"
      })
    }
    await User.findByIdAndDelete(req.user.id)    
    return res.status(200).send({
      success: true,
      message: "Admin deleted!!"
    })
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
})

module.exports = UserRouter;
