"use strict"

let str = "Hallo Welt!"

function checkFirstCharUp(str) {

    let char = str.search(/^[A-Z]/)

    if(char != -1)

        return true
    else

        return false
}

console.log(checkFirstCharUp(str))