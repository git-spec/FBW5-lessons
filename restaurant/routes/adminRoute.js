// import express module
const express = require('express')

// import file module
const fs = require('fs')

// import data module
const dataModule = require('../modules/dataModule')

// create router
const adminRouter = express.Router()
// build a middleware to check the session for all routes in /admin
adminRouter.use((req, res, next) => {
    if(req.session.user) {
        next()
    } else {
        res.redirect('/')
    }
})

// route to admin
adminRouter.get('/', (req, res) => {
    console.log(req.session.user);
    // if(req.session.user) {
    //     res.render('adminMeal')
    // } else {
    //     res.redirect('/login')
    // }
    res.render('admin')
})

// route to addmeal
adminRouter.get('/addmeal', (req, res) => {
    dataModule.getMeals().then(data => {
        // render adminAddMeal with burger objects
        res.render('adminAddMeal', {
            meals: data,
            check: true
        })
    })
})
// get data from admin/addmeal
adminRouter.post('/addmeal', (req, res) => {
    // catch input data
    const mealTitle = req.body.mealTitle
    const mealDescription = req.body.mealDescription
    const mealImage = req.files.mealImage
    const mealPrice = req.body.mealPrice
    const mealDetails = req.body.mealDetails
    // check if data exist
    if(mealTitle && mealPrice && mealDescription && mealImage) {
        // create object
        const mealObj = {
            title: mealTitle,
            description: mealDescription,
            img: mealImage,
            price: mealPrice
        }
        
        // compare with db
        dataModule.addMeal(mealObj).then(result => {
            if(result === 2) {
                // res.send('This meal already exists. Try another one!')
                res.render('adminAddMeal', {
                    meals: myMeals,
                    check: false
                })
            } else {
                res.redirect('/admin/addmeal')
            }
        }).catch(error => {
            res.send(error.message)
        })

    }
})
// route to checkmealtitle
adminRouter.post('/checkmealtitle', (req, res) => {
    dataModule.checkMeal(req.body.mealTitle).then(result => {
        if(result === 1) {
            res.json('exists')
        } else {
            res.json('notexists')
        }
    })
})
// route to deletemeal
adminRouter.get('/deletemeal', (req, res) => {
    dataModule.getMeals().then(data => {
        res.render('adminDeleteMeal', {meals: data})
    })
})
// get meal id to delete
adminRouter.post('/deletemeal', (req, res) => {
    const title = req.body.mealTitle
    // delete image
    dataModule.getMeal(title).then(meal => {
        fs.unlink('./public' + meal.imgUrl, error => {
            if (error) {
                res.send(error)
            } else {
                console.log('Image was deleted')
            }
        })
    }).catch(err => {
        res.send(err.message)
    })
    // delete data
    dataModule.deleteMeal(title).then(() => {
        res.sendStatus(200)
    }).catch(err => {
        res.send(err.message)
    })
})
// route to admin/editmeal
adminRouter.get('/editmeal', (rep, res) => {
    res.render('adminEditMeal', {meals: data})
})
// get
adminRouter.post('/editmeal', (req, res) => {
    console.log(req.body);
    console.log(req.files);
    
    data[req.body.mealID].title = req.body.mealTitle
    data[req.body.mealID].description = req.body.mealDescription
    data[req.body.mealID].price = req.body.mealPrice
    console.log(data[req.body.mealID].imgUrl);
    

    if(req.files) {
        console.log(req.files)
        const mealImg = req.files.imgFile
        // delete old image
        try {
            fs.unlinkSync('./public/' + data[req.body.mealID].imgUrl)
        } catch(err) {
            console.log(err);
            
        }
        // get image extention
        let imgExt = mealImg.name.substr(mealImg.name.lastIndexOf('.'))
        mealImg.mv('./public/upload/' + req.body.mealTitle.trim().replace(/ /g, '_') + (req.body.mealID) + imgExt).then(() => {
            data[req.body.mealID].imgUrl = '/upload/' + req.body.mealTitle.trim().replace(/ /g, '_') + (req.body.mealID) + imgExt
            fs.writeFileSync('./meals.json', JSON.stringify(data))
            res.json(data[req.body.mealID].imgUrl)
            // res.sendStatus(200)
        }).catch(error => {
            console.log(error);
            
            res.sendStatus(500)
        })
    } else {
        fs.writeFileSync('./meals.json', JSON.stringify(data))
        res.json(data[req.body.mealID].imgUrl)
        // res.sendStatus(200)
    }
})

// send function as object for method use
module.exports = adminRouter