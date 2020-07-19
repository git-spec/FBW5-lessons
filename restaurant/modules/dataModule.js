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
    // listen to connection
    return new Promise((resolve, reject) => {
        connect().then(client => {
            // select db
            const DB = client.db('restaurantDB')
            // select collection and find document
            DB.collection('meals').findOne({title: mealTitle}).then(meal => {
                if(meal) {
                    // close connection
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

// get all documents of collection meals
function getMeals() {
    return new Promise((resolve, reject) => {
        connect().then(client => {
            const DB = client.db('restaurantDB')
            DB.collection('meals').find().toArray().then(meals => {
                if(meals) {
                    client.close()
                    resolve(meals)
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

function addMeal(meal) {
    return new Promise((resolve, reject) => {
        connect().then(client => {
            // get db
            const DB = client.db('restaurantDB')
            // get data-type of image
            let imgIdx = meal.img.name.substr(meal.img.name.lastIndexOf('.'))
            // rename and upload image to upload-folder
            meal.img.mv('./public/upload/' + meal.title.trim().replace(/ /g, '_') + DB.collection('meals').find().toArray.length + imgIdx).then(() => {
                // add to db
                DB.collection('meals').insertOne({
                    title: meal.title,
                    description: meal.description,
                    imgUrl: '/upload/' + meal.title.trim().replace(/ /g, '_') + DB.collection('meals').find().toArray.length + imgIdx,
                    price: meal.price
                }).then(response => {
                    if(response.result.ok) {
                        client.close()
                        resolve(1)
                    } else  {
                        reject(new Error('Cannot insert the meal.'))
                    }
                }).catch(err => {
                    client.close()
                    reject(err)
                })
            }).catch(err => {
                client.close()
                reject(err.message)
            })
        }).catch(err => {
            reject(err)
        })
    }).catch(err => {
        console.error(err)
    })
}

// get document of collection meals
function checkMeal(mealTitle) {
    // listen to connection
    return new Promise((resolve, reject) => {
        connect().then(client => {
            // select db
            const DB = client.db('restaurantDB')
            // select collection and find document
            DB.collection('meals').findOne({title: mealTitle}).then(meal => {
                if(meal) {
                    // close connection
                    client.close()
                    resolve(1)
                } else {
                    client.close()
                    resolve(2)
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
    getMeals,
    getMeal,
    addMeal,
    checkMeal
}