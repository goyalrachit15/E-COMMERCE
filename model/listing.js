const mongoose= require('mongoose');
const review = require('./reviews.js');
const user = require('./user.js');
const Schema= mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String ,
        required: true ,
    },
    description: String,
    image: {
        url : String,
        filename : String
    },
    price: Number,
    location: String,
    country: String,

    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : review,
        }
    ],

    owner : {
        type : Schema.Types.ObjectId,
        ref : user,
    },

    geometry : {
              type: {
                type: String, // Don't do `{ location: { type: String } }`
                enum: ['Point'], // 'location.type' must be 'Point'
                required: true
              },
              coordinates: {
                type: [Number],
                required: true
              }
            }
          });

const Listing= mongoose.model('Listing',listingSchema);
module.exports = Listing;
