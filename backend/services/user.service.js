import userModel from '../models/user.model.js';



export const createUser = async ({
    email,password
}) => {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const hashedPassword = await userModel.hashpassword(password);

    const user = new userModel({
        email,
        password: hashedPassword
    });
     await user.save();
    return user;
}


export const getAllUsers = async () =>{
const users = await userModel.find({});
return users;

}