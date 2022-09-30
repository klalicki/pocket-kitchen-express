function initFooter() {
    curStep = 1;
    totalStep = $('.main-swiper-container .swiper-slide').length;
    
  //  console.log(totalStep);
    $('#curContainer').text(curStep);
    $('#totalContainer').text(totalStep);
    barwidth = (curStep / totalStep) * 100 + "vw";
    arrowpos = (curStep / totalStep) * 100 - 0.5 + "vw"
}

function makeString(msTimeObject) {
    var tString = ""
    if (msTimeObject.hours != 0) {
        tString = tString + msTimeObject.hours + ":";
        if (msTimeObject.minutes < 10) {
            tString = tString + "0"
        };
    }
    if (msTimeObject.minutes != 0) {
        tString = tString + msTimeObject.minutes + ":";
        if (msTimeObject.seconds < 10) {
            tString = tString + "0"
        };
    }

    tString = tString + msTimeObject.seconds;
    return tString;
}

function secToString(origSeconds) {
    newSec = origSeconds;

    hours = Math.floor(newSec / 3600);
    newSec = newSec - (3600 * hours);
    minutes = Math.floor(newSec / 60);
    newSec = newSec - (60 * minutes);
    var newTime = {
        hours: hours,
        minutes: minutes,
        seconds: newSec
    };
    return makeString(newTime);

}


function appendtoMenu(content) {
    // menuItem = '<li class="menu-item">' + content + '</li>';
    // $('.menu-list').append(menuItem);
}

function createTimers() {
    //figure out how many timers there are on the page !
    maxtimer = 0;
    timerInfo = new Array();
    contentArray.steps.forEach(function (element) {
        switch (element.type) {
            case "timer-start":
                if (element.timerID > maxtimer) {
                    maxtimer = element.timerID;
                };
                break;
            case "timer-end":
                if (element.timerID > maxtimer) {
                    maxtimer = element.timerID;
                };
                break;
            case "timer-single":
                if (element.timerID > maxtimer) {
                    maxtimer = element.timerID;
                };
                break;
        };

    });
    //figure out the durations for each timer
    timerDurations = new Array(maxtimer);
    contentArray.steps.forEach(function (element) {
        switch (element.type) {
            case "timer-start":
                if (element.time > 0) {
                    timerDurations[element.timerID] = element.time
                };
                break;
            case "timer-end":
                if (element.time > 0) {
                    timerDurations[element.timerID] = element.time
                };
                break;
            case "timer-single":
                if (element.time > 0) {
                    timerDurations[element.timerID] = element.time
                };
                break;
        };

    });

   // console.log(maxtimer);
    //iterate thru all the timers and create them
    recipeTimers = new Array(maxtimer);
    timerRunning = new Array(maxtimer);
    timerInit = new Array(maxtimer);
    lastTimer=0;
    for (i = 0; i <= maxtimer; i++) {
        timerRunning[i] = false;
        timerInit[i]=false;
        recipeTimers[i] = new Timer();

    };
  //  console.log(recipeTimers);
}

function loadContent() {
    createTimers();
    //load meta-content
    pagecontent = "";
    // pagecontent = '<div class="swiper-slide"><div class="page-flex-container"><div class="card bleed-card"><img src="' + contentArray.meta.hero_img + '"></div><div class="card text-card"><p class="instructions">' + contentArray.meta.description + '<br>Time: ' + contentArray.meta.time + '</p></div></div>';
    // $('.main-swiper-wrapper').prepend(pagecontent);
    // appendtoMenu(contentArray.meta.title);
    //$('#top-bar-title').text(contentArray.meta.title);
    //window.document.title ='pocket kitchen: '+ contentArray.meta.title;

    //load ingredients page
   // pagecontent = "";
   // pagecontent = '<div class="swiper-slide" id="ingredients-page"><div class="page-flex-container"><div class="card text-card"><h3 class="ingredient-header">Ingredients</h3><ul class="ingredient-list">';
   // contentArray.ingredients.forEach(function (element) {

  //      curItem = '<li class="ingredient-list-item"><h6>' + '<span class="variable-quantity" data-original-qty="' + element.qty + '">' + element.qty + '</span> ' + element.unit + ' ' + element.name + '</h6><p class="ingredient-notes">' + element.notes + '</p></li>';
        // console.log(curItem);
    //    pagecontent = pagecontent + curItem;
    });
   // pagecontent = pagecontent + '</ul></div></div></div>';

   // $('.main-swiper-wrapper').append(pagecontent);
  //  appendtoMenu('Ingredients');

    //load steps :)
    contentArray.steps.forEach(function (element) {
        pagecontent = "";
        switch (element.type) {
            case "video":
                pagecontent = '<div class="swiper-slide step-slide video-step-slide"><div class="page-flex-container"><div class="card bleed-card"><video autoplay muted loop playsinline data-src="' + element.vidsrc + '"></video></div><div class="card text-card"><p class="instructions">' + element.instructions + '</p></div></div></div>';
                break;
            case "big-number":
            pagecontent = '<div class="swiper-slide step-slide video-step-slide"><div class="page-flex-container"><div class="card bleed-card big-number"><h1>'+element.bignum+'</h1></div><div class="card text-card"><p class="instructions">' + element.instructions + '</p></div></div></div>';
            break;
            case "timer-start":
            timeVal=secToString(element.time);
            // console.log("min:"+minutes+" sec:"+seconds);
            pagecontent = '<div class="swiper-slide step-slide timer-slide timer-start-slide"><div class="page-flex-container"><div class="timer-container" data-timer-id="' +
                element.timerID + '"><h1 class="timer-time">'+timeVal+'</h1><div class="timer-button-container"><button class="timer-button timer-start">START</button><button class="timer-button timer-reset"> RESET</button></button></div></div><div class="card text-card"><p class="instructions">' + element.instructions + '</p></div></div></div>';


                break;
            case "timer-end":
            timeVal=secToString(element.time);
            // console.log("min:"+minutes+" sec:"+seconds);
            pagecontent = '<div class="swiper-slide step-slide timer-slide timer-start-slide"><div class="page-flex-container"><div class="timer-container" data-timer-id="' +
                element.timerID + '"><h1 class="timer-time">'+timeVal+'</h1><div class="timer-button-container"><button class="timer-button timer-start">START</button><button class="timer-button timer-reset"> RESET</button></button></div></div><div class="card text-card"><p class="instructions">' + element.instructions + '</p></div></div></div>';

                break;
            case "timer-single":
                timeVal=secToString(element.time);
                // console.log("min:"+minutes+" sec:"+seconds);
                pagecontent = '<div class="swiper-slide step-slide timer-slide timer-start-slide"><div class="page-flex-container"><div class="timer-container" data-timer-id="' +
                    element.timerID + '"><h1 class="timer-time">'+timeVal+'</h1><div class="timer-button-container"><button class="timer-button timer-start">START</button><button class="timer-button timer-reset"> RESET</button></button></div></div><div class="card text-card"><p class="instructions">' + element.instructions + '</p></div></div></div>';

                break;
        };
        $('.main-swiper-wrapper').append(pagecontent);
        appendtoMenu(element.caption);

    });
  // mySwiper.update();
  //  setFooter();

};

var xmlhttp = new XMLHttpRequest();
var url = "./recipes/"+recipeName+".json";

xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        contentArray = JSON.parse(this.responseText);

        loadContent();
        
    }
}
xmlhttp.open("GET", url, true);
xmlhttp.send();

//setFooter();
initFooter();