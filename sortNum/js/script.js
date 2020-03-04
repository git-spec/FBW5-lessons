"use strict"

let arr = [5, 8, 4, 7, 3, 1, 12]
/*
function sortNum(arr) {

    arr.forEach(num => {

        if(num > arr[arr.indexOf(num) + 1]) {

            let tmp = arr[arr.indexOf(num) + 1]

            arr[arr.indexOf(num) + 1] = num

            arr[arr.indexOf(num)] = tmp

            sortNum(arr)
        }
    })

    return arr
}

console.log(sortNum(arr))
*/


function sortNum(arr) {

    for(let i = 0; i < arr.length; i++) {

        if(arr[i] > arr[i + 1]) {

            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]

            sortNum(arr)
        }
    }

    return arr
}

console.log(sortNum(arr))