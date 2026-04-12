import { Request, Response } from "express";
import articleModel from "../Models/article.model";
import userModel from "../Models/user.model";
import mongoose from "mongoose";
import fs from "fs";
import { promisify } from "util";
import stream from "stream";
import { uploadErrors } from "../utils/error.utils";

const ObjectId = mongoose.Types.ObjectId;
const pipeline = promisify(stream.pipeline);

<<<<<<< HEAD
=======
// Types
>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
interface MulterFile {
  detectedMimeType?: string;
  size: number;
  stream: NodeJS.ReadableStream;
}

interface CustomRequest extends Request {
  file?: MulterFile;
}

<<<<<<< HEAD
=======
// READ
>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
export const readArticle = async (_req: Request, res: Response) => {
  try {
    const docs = await articleModel.find().sort({ createdAt: -1 });
    res.send(docs);
  } catch (err) {
    console.log("Erreur de réception :", err);
    res.status(500).send(err);
  }
};

<<<<<<< HEAD
export const createArticle = async (
  req: CustomRequest,
  res: Response
) => {
=======
// CREATE
export const createArticle = async (req: CustomRequest, res: Response) => {
>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
  let fileName: string | undefined;

  if (req.file) {
    try {
      if (
        req.file.detectedMimeType !== "image/jpg" &&
        req.file.detectedMimeType !== "image/png" &&
        req.file.detectedMimeType !== "image/jpeg"
      ) {
        throw new Error("Invalid file");
      }

      if (req.file.size > 500000) {
        throw new Error("Taille maximale dépassée");
      }
    } catch (error) {
      const errors = uploadErrors(error);
      return res.status(400).json({ errors });
    }

    fileName = `${req.body._id}_${Date.now()}.jpg`;

    await pipeline(
      req.file.stream,
      fs.createWriteStream(
        `${__dirname}/../client/public/uploads/articleImages/${fileName}`
      )
    );
  }

  try {
<<<<<<< HEAD
    const article = await articleModel.create({
=======
    const newArticle = await articleModel.create({
>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
      picture: fileName
        ? `./uploads/articleImages/${fileName}`
        : "",
      name: req.body.name,
      typeArticle: req.body.typeArticle,
      licence: req.body.licence,
      price: req.body.price,
    });

<<<<<<< HEAD
    return res.status(201).json(article);
=======
    return res.status(201).json(newArticle);
>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
  } catch (error) {
    return res.status(400).send(error);
  }
};

<<<<<<< HEAD
=======
// UPDATE
>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
export const updateArticle = async (req: Request, res: Response) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Id inconnue: " + req.params.id);
  }

  try {
    const updated = await articleModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          picture: req.body.picture,
          name: req.body.name,
          typeArticle: req.body.typeArticle,
          licence: req.body.licence,
          price: req.body.price,
        },
      },
      { new: true }
    );

    res.send(updated);
  } catch (err) {
<<<<<<< HEAD
    console.log("Erreur update :", err);
=======
    console.log("Erreur d'update :", err);
>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
    res.status(500).send(err);
  }
};

<<<<<<< HEAD
=======
// DELETE
>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
export const deleteArticle = async (req: Request, res: Response) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Id inconnue: " + req.params.id);
  }

  try {
    const deleted = await articleModel.findByIdAndDelete(req.params.id);
    res.send(deleted);
  } catch (err) {
    console.log("Erreur suppression :", err);
    res.status(500).send(err);
  }
};

<<<<<<< HEAD
export const likeArticle = async (req: Request, res: Response) => {
=======
// LIKE
export const likeArticle = async (req: Request, res: Response) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Id inconnue");
  }

>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
  try {
    await articleModel.findByIdAndUpdate(req.params.id, {
      $addToSet: { likers: req.body.id },
    });

    const user = await userModel.findByIdAndUpdate(
      req.body.id,
      { $addToSet: { likes: req.params.id } },
      { new: true }
    );

    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

<<<<<<< HEAD
export const dislikeArticle = async (req: Request, res: Response) => {
=======
// DISLIKE
export const dislikeArticle = async (req: Request, res: Response) => {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Id inconnue");
  }

>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
  try {
    await articleModel.findByIdAndUpdate(req.params.id, {
      $addToSet: { dislikers: req.body.id },
    });

    const user = await userModel.findByIdAndUpdate(
      req.body.id,
      { $addToSet: { dislikes: req.params.id } },
      { new: true }
    );

    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

<<<<<<< HEAD
=======
// UNLIKE
>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
export const unlikeArticle = async (req: Request, res: Response) => {
  try {
    await articleModel.findByIdAndUpdate(req.params.id, {
      $pull: { likers: req.body.id },
    });

    const user = await userModel.findByIdAndUpdate(
      req.body.id,
      { $pull: { likes: req.params.id } },
      { new: true }
    );

    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

<<<<<<< HEAD
export const undislikeArticle = async (
  req: Request,
  res: Response
) => {
=======
// UNDISLIKE
export const undislikeArticle = async (req: Request, res: Response) => {
>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
  try {
    await articleModel.findByIdAndUpdate(req.params.id, {
      $pull: { dislikers: req.body.id },
    });

    const user = await userModel.findByIdAndUpdate(
      req.body.id,
      { $pull: { dislikes: req.params.id } },
      { new: true }
    );

    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

<<<<<<< HEAD
export const commentArticle = async (
  req: Request,
  res: Response
) => {
=======
// COMMENT
export const commentArticle = async (req: Request, res: Response) => {
>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
  try {
    const updated = await articleModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterName: req.body.commenterName,
            text: req.body.text,
            timestamp: Date.now(),
          },
        },
      },
      { new: true }
    );

    res.send(updated);
  } catch (err) {
    res.status(400).send(err);
  }
};

<<<<<<< HEAD
export const editCommentArticle = async (
  req: Request,
  res: Response
) => {
=======
// EDIT COMMENT
export const editCommentArticle = async (req: Request, res: Response) => {
>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
  try {
    const doc = await articleModel.findById(req.params.id);

    if (!doc) return res.status(404).send("Article introuvable");

    const comment = doc.comments.find((c: any) =>
      c._id.equals(req.body.commentId)
    );

<<<<<<< HEAD
    if (!comment) {
      return res.status(404).send("Commentaire introuvable");
    }
=======
    if (!comment) return res.status(404).send("Commentaire introuvable");
>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381

    comment.text = req.body.text;

    await doc.save();
<<<<<<< HEAD

=======
>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
    res.send(doc);
  } catch (err) {
    res.status(400).send(err);
  }
};

<<<<<<< HEAD
export const deleteCommentArticle = async (
  req: Request,
  res: Response
) => {
=======
// DELETE COMMENT
export const deleteCommentArticle = async (req: Request, res: Response) => {
>>>>>>> a308bc7c0dea5e72f6ae51582b34b71f60cb5381
  try {
    const updated = await articleModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: {
          comments: { _id: req.body.commentId },
        },
      },
      { new: true }
    );

    res.send(updated);
  } catch (err) {
    res.status(400).send(err);
  }
};