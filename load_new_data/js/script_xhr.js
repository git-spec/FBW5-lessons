"use strict"

// connects with xhr to chucknorris.io
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
// get data and attach them to DOM
function refresh(newData, img, h2, article) {
    newData().then(response => {
        // replace image
        img.setAttribute('src', response.icon_url)
        // replace id
        h2.innerText = response.id
        // replace text
        article.innerText = response.value
    }).catch(error => {
        console.log(error)
    })
}
// wait for page been loaded to create the DOM with content
window.onload = () => {
    // get container
    let container = document.getElementById('container')
    // create and display image
    let img = new Image()
    container.append(img)
    // create whitespace
    let br = document.createElement('br')
    container.append(br)
    // create and display id
    let h2 = document.createElement('h2')
    container.append(h2)
    // create whitespace
    br = document.createElement('br')
    container.append(br)
    // create and display text
    let article = document.createElement('article')
    container.append(article)
    // call and attach data
    refresh(loadNewData, img, h2, article)
    // create and display button
    let button = document.createElement('button')
    button.type = 'button'
    button.innerText = 'Refresh'
    container.append(button)
    // add event listener to load data again
    button.addEventListener('click', function() {
        refresh(loadNewData, img, h2, article)
    })
}