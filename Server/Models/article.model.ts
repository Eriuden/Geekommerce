const mongoose = require("mongoose")

export interface IArticle extends Document {
  picture : string;
  name: string;
  password: string;
  typeArticle: Date;
  licence: Date;
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

const articleSchema = new mongoose.Schema(
    {
        picture: {
            type: String,
            required: true 
        },

        name: {
            type: String,
            trim: true,
            maxlength: 200,
            required: true,
        },

        typeArticle: {
            type: String,
            trim: true,
            maxlength: 20,
            required: true,
        },

        licence: {
            type: String,
            trim: true,
            maxlength: 500,
            required: true,
        },

        price: {
            type: String,
            trim: true,
            max: 10,
            required: true,
        },

        comments: {
            type: [
                {
                    commenterId: String,
                    commenterName: String,
                    text: String,
                    timeStamp: Number,
                }
            ],
            required: true,
        },

        likers: {
            type: [String],
            required: true,
        },

        dislikers: {
            type: [String],
            required: true,
        }
    },
    {timestamps : true}
)

const articleModel = mongoose.model("article", articleSchema)
module.exports = articleModel