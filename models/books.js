const mongoose = require('mongoose')

const booksSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Enter book name"]
        },
        author: {
            type: String,
            required: true
        },
        genre: {
            type: String,
            required: [true, "Enter genre"]
        },
        quantity: {
            type: Number,
            require: true,
            default: 1
        },
        price: {
            type: Number,
            require: true
        },
        image: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
)

const Books = mongoose.model('Books', booksSchema);

module.exports = Books;