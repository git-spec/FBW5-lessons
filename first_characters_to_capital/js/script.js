"use strict"

let txt = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem."

function firstCharsToCap(txt) {

    let words = txt.split(" ")

    let str = ""

    words.forEach(item => {

        let capChar = item[0].toUpperCase()

        let word = capChar + item.substr(1)
        
        str += word + " "
    })
    
    return str.trim()
}

console.log(firstCharsToCap(txt))