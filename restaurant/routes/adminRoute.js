const express = require('express')
const fs = require('fs')

// create function to get data from app.js
function adminRouter(data) {
    // create router
    const adminRoute = express.Router()
    // build a middleware to check the session for all routes in /admin
    adminRoute.use((req, res, next) =>{
        if(req.session.user) {
            next()
        } else {
            res.redirect('/')
        }
    })

    adminRoute.get('/', (req, res) => {
        console.log(req.session.user);
        // if(req.session.user) {
        //     res.render('adminMeal')
        // } else {
        //     res.redirect('/login')
        // }
        res.render('admin')
    })
    
    // route to addmeal
    adminRoute.get('/addmeal', (req, res) => {
        // render adminAddMeal with burger objects
        res.render('adminAddMeal', {
            meals: data,
            check: true
        })
    })
    // get data from admin/addmeal
    adminRoute.post('/addmeal', (req, res) => {
        // catch input data
        const mealTitle = req.body.mealTitle
        const mealPrice = req.body.mealPrice
        const mealDescription = req.body.mealDescription
        const mealDetails = req.body.mealDetails
        // check if data exist
        if(mealTitle && mealPrice && mealDescription && req.files) {
            // compare with meal.json
            if(data.find(item => item.title == mealTitle)) {
                // res.send('This meal already exists. Try another one!')
                res.render('adminAddMeal', {
                    meals: myMeals,
                    check: false
                })
            } else {
                // catch image file
                const mealImage = req.files.mealImage
                // get data-type
                let imgIdx = mealImage.name.substr(mealImage.name.lastIndexOf('.'))
                // upload image to upload-folder
                mealImage.mv('./public/upload/' + mealTitle.trim().replace(/ /g, '_') + data.length + imgIdx).then(() => {
                // create object
                let obj = {
                    title: mealTitle,
                    description: mealDescription,
                    details: mealDetails,
                    imgUrl: '/upload/' + mealTitle.trim().replace(/ /g, '_') + data.length + imgIdx,
                    price: mealPrice
                }
                // add new object to json
                data.push(obj)
                // write new json file
                fs.writeFileSync('./meals.json', JSON.stringify(data))
                // res.render('adminAddMeal', {meals: meals})
                    res.redirect('/admin/addmeal')
                }).catch(error => {
                    res.send(error.message)
                })
            }
        }
    })
    // route to checkmealtitle
    adminRoute.post('/checkmealtitle', (req, res) => {
        if(data.find(item => item.title == mealTitle)) {
            res.json('exists')
        } else {
            res.json('notexists')
        }
    })
    // route to deletemeal
    adminRoute.get('/deletemeal', (req, res) => {
        res.render('adminDeleteMeal', {meals: data})
    })
    // get meal id to delete
    adminRoute.post('/deletemeal', (req, res) => {
        const idx = req.body.mealID
        // delete image
        fs.unlink('./public' + data[idx].imgUrl, (err) => {
            if (err) throw err
            console.log('Image was deleted')
        })
        // delete data
        data.splice(idx, 1)
        fs.writeFileSync('./meals.json', JSON.stringify(data))
        res.sendStatus(200)
    })
    // route to admin/editmeal
    adminRoute.get('/editmeal', (rep, res) => {
        res.render('adminEditMeal', {meals: data})
    })
    // get
    adminRoute.post('/editmeal', (req, res) => {
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
    return adminRoute
}
// send function as object for method use
module.exports = { adminRouter }