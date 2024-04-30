import Adminmodel from "../Model/Adminmodel.js";

const Register = async (req, res) => {
    try {
        const existingUser = await Adminmodel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already exists",
            });
        }
        const user = new Adminmodel(req.body);
        await user.save();
        return res.status(201).send({
            message: "Registered successfully",
            user,
        });
    } catch (error) {
        res.status(500).send({
            message: "Error in register API",
            error:error.message
        });
    }
};

const Login = async (req, res) => {
    try {
        const user = await Adminmodel.findOne({ email:req.body.email});
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

// if(user.role!=req.body.role){
//     return res.status(500).send({
//         success:false,
//         message:"Role does not match"
//     })
// }
if (user.password !== req.body.password) {
    return res.status(404).send({
        success: false,
        message: "Password is incorrect",
    });
}

return res.status(200).send({
    success: true,
    message: "Login successful",
    user,
});
} catch (error) {
console.log(error)
res.status(500).send({
    success: false,
    message: "Error in login API",
    error:error.message
});
}
};

export {Register,Login}