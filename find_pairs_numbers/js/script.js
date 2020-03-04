"use strict"

function findUniquePairsNum(arr) {

    let storage = []

    let pair = []
    
    arr.forEach(num => {

        for (let i = arr.indexOf(num) + 1; i < arr.length; i++) {

            if (storage.length === 0) {

                storage.push([num, arr[i]].sort((a, b) => {return a - b}))

            } else {

                pair = [num, arr[i]].sort((a, b) => {return a - b})

                let x = 0

                while (x < storage.length) {

                    if (pair[0] === storage[x][0] && pair[1] === storage[x][1]) {

                        pair.length = 0

                        break
                    } else {

                        x++
                    }
                }

                if (pair.length != 0)

                    storage.push(pair)
            }
        }
    })

    return storage
}

let arr = [5, 9, 2, 1, 1]

document.write()

console.log(findUniquePairsNum(arr))