import { Request, Response } from "express";
import userModel from "../Models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signInErrors, signUpErrors } from "../utils/error.utils";


declare const transport: any;

const maxAge = 3 * 24 * 60 * 60 * 1000;


interface JwtPayload {
  id: string;
}


const createToken = (id: string): string => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET as string, {
    expiresIn: maxAge / 1000, 
  });
};


export const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const user = await userModel.create({ name, email, password });
    return res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = signUpErrors(error);
    return res.status(400).json({ errors });
  }
};


export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.login(email, password);

    const token = createToken(user._id.toString());

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({ user: user._id });
  } catch (error) {
    const errors = signInErrors(error);
    return res.status(400).json({ errors });
  }
};


export const logout = (_req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 1 });
  return res.redirect("/");
};

export const resetPasswordLink = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Veuillez entrer votre email" });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Utilisateur introuvable" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    user.verifytoken = token;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Lien pour modifier votre mot de passe",
      text: `Ce lien est valide 15 minutes :
${process.env.CLIENT_URL}/forgotpassword/${user._id}/${token}`,
    };

    transport.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          message: "Le mail n'a pas été envoyé",
        });
      }

      return res.status(200).json({
        message: "Email envoyé avec succès",
      });
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const forgotPasswordChecking = async (
  req: Request,
  res: Response
) => {
  const { id, token } = req.params;

  try {
    const user = await userModel.findOne({
      _id: id,
      verifytoken: token,
    });

    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as JwtPayload;

    if (user && decoded.id) {
      return res.status(200).json({ validUser: user });
    }

    return res
      .status(401)
      .json({ message: "Utilisateur introuvable" });
  } catch (error) {
    return res.status(401).json({ error });
  }
};

export const updatePassword = async (
  req: Request,
  res: Response
) => {
  const { id, token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      message: "Mot de passe requis",
    });
  }

  try {
    const user = await userModel.findOne({
      _id: id,
      verifytoken: token,
    });

    const decoded = jwt.verify(
      token,
      process.env.TOKEN_SECRET as string
    ) as JwtPayload;

    if (!user || !decoded.id) {
      return res
        .status(401)
        .json({ message: "Utilisateur introuvable" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.verifytoken = undefined;

    await user.save();

    return res.status(200).json({
      message: "Mot de passe mis à jour",
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};