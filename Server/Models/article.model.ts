import { Schema, Document, model } from "mongoose";


export interface IArticle extends Document {
  picture : string;
  name: string;
  typeArticle: string;
  licence: string;
  price : string;
  comments : [
    commenterId: string,
    commenterName : string,
    text: string,
    timestamp: Number
  ],
  likers: [string],
  dislikers: [string]
}

const articleSchema = new Schema<IArticle>(
    {
        picture: {
            required: true 
        },

        name: {
            trim: true,
            maxlength: 200,
            required: true,
        },

        typeArticle: {
            trim: true,
            maxlength: 20,
            required: true,
        },

        licence: {
            trim: true,
            maxlength: 500,
            required: true,
        },

        price: {
            trim: true,
            max: 10,
            required: true,
        },

        comments: {
            required: true,
        },

        likers: {
            required: true,
        },

        dislikers: {
            required: true,
        }
    },
    {timestamps : true}
)

export const ArticleModel = model<IArticle>(
  "MonthlySnapshot",
  articleSchema
);