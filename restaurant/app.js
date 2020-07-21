// import express
const express = require('express')
const app = express()

// import module saver
const emailSender = require('./modules/emailSender')

// import validator
const validator = require('validator')

// import file system
const fs = require('fs')
// get json file
// const rawdata = fs.readFileSync(__dirname + '/meals.json')
// parse to json
// const data = JSON.parse(rawdata)

// import fileupload
const fileupload = require('express-fileupload')
// use as middleware
app.use(fileupload({
    limits: {fileSize: 50 * 1024 * 1024}
}))

// import data module
const dataModule = require('./modules/dataModule')

// create session object
const session = require('express-session')
// set session options
const sessionOpt = {
    secret: 'burger',
    cookie: {
        // secure: true,
        // maxAge: 5 * 60 * 1000 // 24 * 60 * 60 * 1000
    }
}
// use session
app.use(session(sessionOpt))

// import cookie parser
const cookie = require('cookie-parser')
// use cookie parser
app.use(cookie())

// create static url for public
app.use(express.static('./public'))
// Parse incoming request bodies in a middleware (integrated body parser)
app.use(express.urlencoded({extended: false}))
// get posted json data and convert to object
app.use(express.json())

// import admin router
const adminRouter = require('./routes/adminRoute')
// route to admin
app.use('/admin', adminRouter)

// module for templating (Embedded JavaScript)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

// route to home
app.get('/', (req, res) => {
    res.render('index')
})
// route to menu
app.get('/menu', (req,res) => {
    dataModule.getMeals().then(meals => {
        // render menu with burger objects
        res.render('menu', {meals: meals})
    })
})
// route to admin/addmeal
// app.get('/addmeal', (req, res) => {
//     let rawdata = fs.readFileSync(__dirname + '/meals.json')
//     let data = JSON.parse(rawdata)
//     // render adminAddMeal with burger objects
//     res.render('adminAddMeal', {meals: data})
// })
// route to admin/deletemeal
// app.get('/deletemeal', (req, res) => {
//     res.render('adminDeleteMeal', {meals: data})
// })
// get data from admin/addmeal
// app.post('/addmeal', (req, res) => {
//     const mealTitle = req.body.mealTitle
//     const mealPrice = req.body.mealPrice
//     const mealDescription = req.body.mealDescription
//     let obj = {
//         title: mealTitle,
//         description: mealDescription,
//         imgUrl: "/img/burger/1.png",
//         price: mealPrice
//     }
//     // let rawdata = fs.readFileSync(__dirname + '/meals.json')
//     // let data = JSON.parse(rawdata)
//     // add new object to json
//     data.push(obj)
//     // write new json file
//     fs.writeFileSync(__dirname + '/meals.json', JSON.stringify(data))
//     // res.render('adminAddMeal', {meals: meals})
//     res.redirect('/admin/addmeal')
// })

// route to menu
app.get('/menu', (req, res) => {
    res.render('menu')
})
// route to login
app.get('/login', (req, res) => {
    console.log(req.cookies);
    if(req.cookies.burgerUser) {
        // load users.json
        const usersJSON = fs.readFileSync(__dirname + '/users.json')
        // convert to json
        const users = JSON.parse(usersJSON)
        // find user
        const validUser = users.find(user => user.username === req.cookies.burgerUser.username && user.password === req.cookies.burgerUser.password)  
        if(validUser) { // 
            req.session.user = validUser
            res.redirect('/admin')
        } else {
            res.render('login')
        }
    } else {
        res.render('login')
    }
})
app.post('/login', (req, res) => {
    // load users.json
    const usersJSON = fs.readFileSync(__dirname + '/users.json')
    // convert to json
    const users = JSON.parse(usersJSON)
    // find user
    const validUser = users.find(user => user.username === req.body.username && user.password === req.body.password)  
    if(validUser) {
        req.session.user = validUser
        res.cookie('burgerUser', validUser, {maxAge: 600000, httpOnly: true})
        res.json('exist')
    } else {
        res.json('not exist')
    }
})
// route to logout
app.get('/logout', (req, res) => {
    // destroy the session
    req.session.destroy()
    // clear cookie on logout
    res.clearCookie('burgerUser')
    res.redirect('/')
})
// route to about
app.get('/about', (req, res) => {
    res.render('about')
})
// route to contact
app.get('/contact', (req, res) => {
    res.render('contact', {sent: 1})
})
// get form data
app.post('/contact', (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const subject = req.body.subject
    const message = req.body.message
    if(!name && name.length < 100) {
        emailSender.sendEmail(name, email, subject, message, (ok) => {
            if(ok) {
                res.sendStatus(200)
            } else {
                res.sendStatus(500)
            }
        })
    }
    res.json(1)
})
app.post('/contact1', (req, res) => {
    const name = req.body.name
    const email = req.body.email
    const subject = req.body.subject
    const message = req.body.message
    if(!name && name.length < 100) {
        emailSender.sendEmail(name, email, subject, message, (ok) => {
            if(ok) {
                // res.sendStatus(200)
                res.render('contact', {sent: 2})
            } else {
                // res.sendStatus(500)
                res.render('contact', {sent: 3})
            }
        })
    }
})
// route to meal using title
app.get('/meal/:title', (req, res) => {
    // search for title in db
    dataModule.getMeal(req.params.title.trim().replace(/_/g, ' ')).then(meal => {
        // send params
        if(meal) {
            res.render('meal', {
                mealTitle: meal.title,
                mealPrice: '$ ' + meal.price,
                mealDescription: meal.description,
                mealImage: meal.imgUrl,
                mealDetails: meal.details
            })
        } else {
            res.send("This meal doesn't exists.")
        }
    }).catch(err => {
        console.error(err)
    })
})
// route to meal using index
// app.get('/meal/:id', (req, res) => {
//     // search for title in data json
//     const idx = req.params.id
//     // send params
//     if(data[idx]) {
//         res.render('meal', {
//             mealTitle: data[idx].title,
//             mealPrice: data[idx].price,
//             mealDescription: data[idx].description,
//             mealImage: data[idx].imgeUrl
//         })
//     } else {
//         res.send("This meal doesn't exists")
//     }
// })

app.listen(3000, () => {
    console.log('App listening at port 3000')
})