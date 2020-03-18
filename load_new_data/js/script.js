"use strict"

// connection by xhr to chucknorris.io
function loadNewData() {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.open('GET', 'https://api.chucknorris.io/jokes/random')
        xhr.send()
        xhr.onload = () => {
            if(xhr.status === 200)
                resolve(JSON.parse(xhr.response))
            else
                reject('Sorry, but there are problems with the connection.')
        }
    })
}

window.onload = () => {
    // get container
    let container = document.getElementById('container')
    // call data
    loadNewData().then(response => {
        // create and display image
        let img = new Image()
        img.setAttribute('src', response.icon_url)
        container.append(img)
        // create and display id
        let p = document.createElement('p')
        p.innerText = response.id
        container.append(p)
        // create and display text
        let article = document.createElement('article')
        article.innerText = response.value
        container.append(article)
        // create and display button
        let button = document.createElement('button')
        button.type = 'button'
        button.innerText = 'Refresh'
        container.append(button)
        // add event listener
        button.addEventListener('click', function() {
            refresh(loadNewData, img, p, article)
        })
    }).catch(error => {
        console.log(error)
    })
}

function refresh(newData, img, p, article) {
    newData().then(response => {
        // replace image
        img.setAttribute('src', response.icon_url)
        // replace id
        p.innerText = response.id
        // replace text
        article.innerText = response.value
    }).catch(error => {
        console.log(error)
    })
}