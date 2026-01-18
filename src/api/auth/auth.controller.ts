import { Request, Response } from 'express';
import { UserModel } from '../../models/user.model';
import jwt from "jsonwebtoken";


export const register = async function (req:Request, res:Response) {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            message: 'Email and password are required' 
        });
    }

    const existingUser = await UserModel.findOne({ email }); // checks if user 409 user exists
      if (existingUser) {
       return res.status(409).json({ 
        message: 'User already exists' 
       });
    }

    const user = await UserModel.create({ email, password });

    return res.status(201).json({
     message: 'User registered successfully',
     user: {
      id: user._id,
      email: user.email,
     },
   });
}

export const login = async (req: Request, res: Response) => {
  const jwtSecret = process.env.JWT_SECRET!;
  const { email, password } = req.body;


  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user._id },
    jwtSecret as string,
    { expiresIn: Number(process.env.JWT_EXPIRES_IN)}
  );

  return res.status(200).json({
    message: 'Login successful',
    token,
  });
};

