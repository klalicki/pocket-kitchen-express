
//$(window).bind("load", function () {
function fixHeight(){
viewHeight = $(window).height();
$('.app-container').css({
    height: viewHeight
});
}
fixHeight();

function setPersistentTimer() {
    if (persistentTimerState) {
        $('.persistent-timer-container').slideDown(300);
    } else {
        $('.persistent-timer-container').slideUp(300);
    };
    console.log('set persistent')

};

function checkPersistentTimers() {
    if (timersRunning()) {
        if ($(mySwiper.slides[mySwiper.activeIndex]).hasClass('timer-slide')) {
            if ($(mySwiper.slides[mySwiper.activeIndex]).find('[data-timer-id="' + lastTimer + '"]').length == 0) {
                persistentTimerState = true;
            } else {
                persistentTimerState = false;
            }
        } else {
            persistentTimerState = true;
        }
    } else {
        persistentTimerState = false;
    };

    setPersistentTimer();


}

function unloadVideo(vidID) {
    if (vidID < 0) {
        return
    };
    $(mySwiper.slides[vidID]).find('video').attr('src', '');
};

function loadVideo(vidID) {
    if (vidID < 0) {
        return
    };
    oldsrc = $(mySwiper.slides[vidID]).find('video').attr('src');
    newsrc = $(mySwiper.slides[vidID]).find('video').attr('data-src');
    if (oldsrc != newsrc) {
        $(mySwiper.slides[vidID]).find('video').attr('src', newsrc);
        $(mySwiper.slides[vidID]).find('video').get(0).load();
        if (vidID == mySwiper.activeIndex) {
            $(mySwiper.slides[vidID]).find('video').get(0).play();
        };
    }
}


mySwiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    simulateTouch: true,
    iOSEdgeSwipeDetection: true,
    spaceBetween: 0,
    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },
    on: {
        init: function(){
            initFooter();
        },
        slideChangeTransitionStart: function () {
            $('video').each(function (index) {
                this.pause();
                this.currentTime = 0;
            });
            setFooter();
        },
        slideChangeTransitionEnd: function () {
            unloadVideo(mySwiper.activeIndex - 2);
            loadVideo(mySwiper.activeIndex - 1);
            loadVideo(mySwiper.activeIndex);
            loadVideo(mySwiper.activeIndex + 1);
            unloadVideo(mySwiper.activeIndex + 2);
            vidState = $(mySwiper.slides[mySwiper.activeIndex]).find('video').get(0);
            if (vidState != null) {
                $(mySwiper.slides[mySwiper.activeIndex]).find('video').get(0).play();
            }
            checkPersistentTimers();



        }
    }
});



menuState = false;
persistentTimerState = false;
menuTop = 0 - $('#menu-panel').height() - 50;
setMenu();

mySwiper.update();
setFooter();

function timersRunning() {
    for (i = 0; i < maxtimer + 1; i++) {
        if (recipeTimers[i].isRunning()) {
            return (true);
        }
    }
    return (false);
};



function goToTimerPage(timerID) {
    targetPage = $('.page-flex-container').find('[data-timer-id="' + timerID + '"]').last().parent().parent();
    // console.log(targetPage[-0]);
    targetIndex = $('.swiper-slide').index(targetPage);
    mySwiper.slideTo(targetIndex);
};

function goToTimerPageInstant(timerID) {
    targetPage = $('.page-flex-container').find('[data-timer-id="' + timerID + '"]').last().parent().parent();
    // console.log(targetPage[-0]);
    targetIndex = $('.swiper-slide').index(targetPage);
    mySwiper.slideTo(targetIndex, 0);
};
function goToTimerPageAfterInstant(timerID) {
    targetPage = $('.page-flex-container').find('[data-timer-id="' + timerID + '"]').last().parent().parent();
    // console.log(targetPage[-0]);
    targetIndex = $('.swiper-slide').index(targetPage);
    mySwiper.slideTo(targetIndex+1, 0);
};

function timerFinished(timerID) {
    $('.timer-popup').fadeIn();
    goToTimerPageAfterInstant(timerID);
    //  $('.timer-popup .popup-container .text-card .instructions').text($(mySwiper.slides[mySwiper.activeIndex]).find('.instructions').text());
    //console.log(targetIndex);
    // console.log('timer ' + timerID + ' finished!!')

};



function setFooter() {
    curStep = mySwiper.activeIndex + 1;
    totalStep = $(mySwiper.slides).length;
    $('#curContainer').text(curStep);
    $('#totalContainer').text(totalStep);
    barwidth = (curStep / totalStep) * 100 + "vw";
    arrowpos = (curStep / totalStep) * 100 - 0.5 + "vw"
    $('#progress-arrow').stop().animate({
        left: arrowpos
    }, 400);
    $('#progress-bar').stop().animate({
        width: barwidth
    }, 400);
    $('.menu-item').removeClass('menu-item-active');
    $($('.menu-item').get(mySwiper.activeIndex)).addClass('menu-item-active');
}



function resetOtherTimers(selection) {
    console.log(maxtimer);
    timerInit[i] = false;
    for (i = 0; i < maxtimer; i++) {
        if (i != selection) {
            timerInit[i] = false;
            recipeTimers[i].stop();
            removeListeners(i);
        }
    }
};


//};


function setMenu() {
    if (menuState) {
        $('#menu-panel').animate({
            bottom: "0px",
            opacity: "1"
        }, 400);
        $('#screen-overlay').show().animate({
            opacity: "0.75"
        }, 400);
    } else {
        $('#menu-panel').animate({
            bottom: "-100vh",
            opacity: "0"
        }, 400);

        $('#screen-overlay').animate({
            opacity: "0"

        }, 400, function () {
            $('#screen-overlay').hide();
        });
    }
};

function removeListeners(id) {
    recipeTimers[id] = new Timer();

};
$(document).ready(function () {
    $('#back-button').click(function(){
        $('body').fadeOut(function(){

            window.location.href="/index.html";
        })
    });

    $(window).resize(function(){
        fixHeight();
    });
    $('.timer-popup').hide();

    $('#fullscreen-banner').click(function () {
        if (screenfull.enabled) {
            screenfull.request(); //re-enable this before putting live.
        } else {
            // Ignore or do something else
        }
        $('#fullscreen-banner').hide();
    });

    $('#menu-button').click(function () {
        menuState = !menuState;
        setMenu();
    })
    $('#screen-overlay').click(function () {
        menuState = false;
        setMenu();
    });

    $(document.body).on('click', '.menu-item', function (e) {
        //console.log('clickied');
        newPageNum = $('.menu-item').index(this);
        mySwiper.slideTo(newPageNum, 0);
        // console.log('clicked menu item');
        menuState = false;
        setMenu();
    })

    $('#btn-close-menu').click(function () {
        menuState = false;
        setMenu();

    })
    //  $("#menu-panel, #screen-overlay").swipe({
    //Single swipe handler for left swipes
    // swipeDown: function (event, direction, distance, duration, fingerCount) {
    //     menuState = false;
    //       setMenu();
    //   },
    //Default is 75px, set to 0 for demo so any distance triggers swipe
    //   threshold: 50
    // });
    $("#bottom-bar").swipe({
        swipeUp: function (event, direction, distance, duration, fingerCount) {
            menuState = true;
            setMenu();
        },
        //Default is 75px, set to 0 for demo so any distance triggers swipe
        threshold: 50
    });
    $(".persistent-timer-container").click(function () {
        console.log(
            'clicked timer container'
        )
        for (i = 0; i <= maxtimer + 1; i++) {

            if (recipeTimers[i].isRunning()) {
                goToTimerPage(i);
            }

        };
    });


    $('.timer-button').click(function () {
        //eventually make some kinda coool animation for when the user clicks one of these buttons;
    });
    $('.timer-popup, .timer-popup *').click(function () {
        $('.timer-popup').fadeOut();
    })

    // $('.timer-reset').on('click',
    // {     $('.timer-reset').click(function () 
    $('body').on('click', '.timer-reset', function () {

        var curID = $(this).parent().parent().attr("data-timer-id");
        recipeTimers[curID].stop();
        removeListeners(curID);
        timerInit[curID] = false;
        // recipeTimers[curID].reset();
        timeString = secToString(timerDurations[curID]);
        $('.timer-container[data-timer-id="' + curID + '"]').find('.timer-time').text(timeString);

        $('.timer-container[data-timer-id="' + curID + '"]').find('.timer-start').text('START');
    });
    //$('.timer-start').click(function () {
    $('body').on('click', '.timer-start', function () {

        console.log(this);

        var curID = $(this).parent().parent().attr("data-timer-id");
        lastTimer = curID;
        if (timerInit[curID]) {
            if (recipeTimers[curID].isRunning()) {
                recipeTimers[curID].pause();
                $('.timer-container[data-timer-id="' + curID + '"]').find('.timer-start').text('RESUME');

            } else {
                console.log('should be starting timer');
                recipeTimers[curID].start();
            }
        } else {
            $('.timer-container[data-timer-id="' + curID + '"]').find('.timer-start').text('PAUSE');

            curDur = parseInt(timerDurations[curID]);
            resetOtherTimers(curID);
            timerInit[curID] = true;
            //  console.log(curDur);
            recipeTimers[curID].start({
                countdown: true,
                startValues: {
                    seconds: curDur
                },
            });
            checkPersistentTimers();
            // recipeTimers[curID].removeEventListener('secondsUpdated');
            recipeTimers[curID].addEventListener('secondsUpdated', function timer_handler() {
                timeObject = recipeTimers[curID].getTimeValues();
                //   console.log(timeObject);
                timeString = makeString(timeObject);
                $('.timer-container[data-timer-id="' + curID + '"]').find('.timer-time').text(timeString);
                $('.persistent-timer').text(timeString);

                timetotal = timeObject.hours * 3600 + timeObject.minutes * 60 + timeObject.seconds;
                // console.log(timetotal);
                //   console.log(timeObject);
                if (timetotal == 0) {
                    timerFinished(curID);
                }
            });
        };
        // console.log("starting timer " + curID)

    });

});

//});

setFooter();