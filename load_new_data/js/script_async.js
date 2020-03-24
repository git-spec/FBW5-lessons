"use strict"

window.onload =  function () {
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
    loadDataAsync(img, h2, article)
    // create and display button
    let button = document.createElement('button')
    button.type = 'button'
    button.innerText = 'Refresh'
    container.append(button)
    // add event listener to load data again
    button.addEventListener('click', function() {
        loadDataAsync(img, h2, article)
    })
}
// get data and attach them to DOM    
async function loadDataAsync(img, h2, article) {
    let data = await fetch('https://api.chucknorris.io/jokes/random')
    if(data.status === 200) {
        let obj = await data.json()
        img.src = obj.icon_url
        h2.innerText = obj.id 
        article.innerText = obj.value
    } else {
        article.innerText = 'Sorry, but there are problems with the connection.'
    }
}