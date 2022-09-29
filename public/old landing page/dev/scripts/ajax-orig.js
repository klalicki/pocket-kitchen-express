function appendtoMenu(content) {
    menuItem = '<li class="menu-item">' + content + '</li>';
    $('.menu-list').append(menuItem);
}

function loadContent() {
    //load meta-content
    pagecontent = "";
    pagecontent = '<div class="swiper-slide"><div class="sq-container"><div class="square-slide"><img src="' + contentArray.meta.hero_img + '"></div></div><div class="text-card-wrapper"><div class="text-card"><p class="instructions">' + contentArray.meta.description + '<br>Time: ' + contentArray.meta.time + '</p></div></div></div>';
    $('.swiper-wrapper').prepend(pagecontent);
    appendtoMenu(contentArray.meta.title);
    $('#top-bar-title').text(contentArray.meta.title);
    
    //load ingredients page
    pagecontent = "";
    pagecontent = '<div class="swiper-slide" id="ingredients-page"><div class="text-card-wrapper"><div class="text-card"><h3 class="ingredient-header">Ingredients</h3><ul class="ingredient-list">';
    contentArray.ingredients.forEach(function (element) {

        curItem = '<li class="ingredient-list-item"><h6>' + '<span class="variable-quantity" data-original-qty="' + element.qty + '">' + element.qty + '</span> ' + element.unit + ' ' + element.name + '</h6><p class="ingredient-notes">' + element.notes + '</p></li>';
        console.log(curItem);
        pagecontent = pagecontent + curItem;
    });
    pagecontent = pagecontent + '</ul></div></div></div>';

    $('.swiper-wrapper').append(pagecontent);
    appendtoMenu('Ingredients');

    //load steps :)
    contentArray.steps.forEach(function (element) {
        pagecontent = "";
        switch (element.type) {
            case "video":
                pagecontent = '<div class="swiper-slide step-slide video-step-slide"><div class="sq-container"><div class="square-slide"><video src="' + element.vidsrc + '"></video></div></div><h2 class="sq-caption">' + element.caption + '</h2><div class="text-card-wrapper"><div class="text-card"><p class="instructions">' + element.instructions + '</p></div></div></div>';
                break;

            case "timer-start":
                pagecontent = '<div class="swiper-slide step-slide timer-slide timer-start-slide"><div class="timer-container" data-timer-id="'+
                element.timerID+ '"><h1 class="timer-time">'+
                '<span class="timer-minutes">00</span> : <span class="timer-seconds">00</span></h1></div></div>';
                
                break;
            case "timer-end":
                pagecontent = '<div class="swiper-slide step-slide video-step-slide"><h2>TIMER-END-SLIDE</h2></div>';
                break;
            case "timer-single":
                pagecontent = '<div class="swiper-slide step-slide video-step-slide"><h2>TIMER-SINGLE-SLIDE</h2></div>';
               
                break;
        };
        $('.swiper-wrapper').append(pagecontent);
        appendtoMenu(element.caption);

    });
    mySwiper.update();
    setFooter();

};

var xmlhttp = new XMLHttpRequest();
var url = "./recipe.json";

xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        contentArray = JSON.parse(this.responseText);

        loadContent();
    }
}
xmlhttp.open("GET", url, true);
xmlhttp.send();

function startTimer(timerID){
    var now= new Date().getTime;
    timeToAdd=pageTimers[timerID].duration*1000;
    now=now+timeToAdd;
}