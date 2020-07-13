const {MongoClient, ObjectID} = require('mongodb')
const connectionString = 'mongodb+srv://mongoose_user:CNZQeevZFJyDL6YE@cluster0.uoold.mongodb.net/restaurantDB?retryWrites=true&w=majority'

function connect() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}).then(client => {
            resolve(client)
        }).catch(err => {
            reject(err)
        })
    })
}