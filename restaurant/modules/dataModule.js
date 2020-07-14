const {MongoClient, ObjectID} = require('mongodb')
const connectionString = 'mongodb+srv://Ingo:123456abc@cluster0.uoold.mongodb.net/restaurantDB?retryWrites=true&w=majority'

// connect with mongodb
function connect() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}).then(client => {
            resolve(client)
        }).catch(err => {
            reject(err)
        })
    })
}

// get document of collection meals
function getMeal(mealTitle) {
    return new Promise((resolve, reject) => {
        connect().then(client => {
            const DB = client.db('restaurantDB')
            DB.collection('meals').findOne({title: mealTitle}).then(meal => {
                if(meal) {
                    client.close()
                    resolve(meal)
                } else {
                    client.close()
                    reject(new Error('Cannot find a meal with title: ' + mealTitle))
                }
            }).catch(err => {
                client.close()
                reject(err.message)
            })
        }).catch(err => {
            reject(err.message)
        })
    })
}

// export modules
module.exports = {
    getMeal
}