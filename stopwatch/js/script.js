"use strict"

window.onload = function() {


    let display = document.querySelectorAll('span')

    display.forEach(function(item) {

        item.innerText = "00:00:00"
    })

    let milSec = 0

    let sec = 0

    let min = 0

    let hour = 0

    let checker = true

    setInterval(() => {

        display.forEach(function(item) {
    
            item.innerText = formater(hour, min, sec, milSec)
        })
        
        if(checker){

            var dStart = new Date();

            let start = dStart.getMilliseconds();

            console.log(start)
        }

        if (milSec < 100)

            milSec++
        
        if (milSec === 100) {

            milSec = 0

            sec++
        }
        
        if (sec === 60) {

            sec = 0

            min++
        }

        if (min === 60) {

            min = 0

            hour++
        }

        if (hour > 24)

            hour = 0

            if(checker){

                var dEnd = new Date();

                let end = dEnd.getMilliseconds();

                console.log(end)

                checker = false
            }
    }, 10)

    function formater(hrs, mins, scs, milscs) {

        let result = ''

        if(hrs < 10){

            result += '0' + hrs.toString()
        } else {

            result += hrs.toString()
        }

        if(mins < 10){

            result += ':0' + mins.toString()
        } else {

            result += ':' + mins.toString()
        }

        if(scs < 10){

            result += ':0' + scs.toString()
        } else {

            result += ':' + scs.toString()
        }

        if (milscs < 10) {

            result += ':0' + milscs.toString()
        } else {
            
    
                result += ':' + milscs.toString()
            

        }

        return result
    }
    
}