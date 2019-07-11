$(function () {
    //BASIC UI ANIMATIONS

	$("ul").hide();

	$(function () {
        $(window).scroll(function () {
        	var clearFront = $("#homepage").height() * .85 - 1;

                 // set distance user needs to scroll before we start fadeIn
            if ($(this).scrollTop() > clearFront) {
                $('ul').fadeIn(500);
            } else {
                $('ul').fadeOut(150);
            }
        });
    });

    // $(function () {
    //     $(window).scroll(function () {
    //         var current = $(this).scrollTop();
    //         var hundredVH = $("#homepage").height();
    //         var ratio = current/hundredVH;
    //         var finalVal = 100 - 50 * ratio;

    //         console.log("brightness" + finalVal.toString());

    //              // set distance user needs to scroll before we start fadeIn
    //         if (current < hundredVH) {
    //             $("#homepage").style.filter = "brightness(50%)";
    //         }
    //     });
    // });

    $(function () {
        $(document).on("mouseover", ".menubutton", function () {
            $(this).addClass("menuHover");
        });

        $(document).on("mouseleave", ".menubutton", function () {
            $(this).removeClass("menuHover");
        });
    });

    var target;

    $(function () {
        $(document).on("click", ".menubutton", function () {
            target = $(this);
 
            $ajaxUtils.sendGetRequest(
                "https://api.myjson.com/bins/k5kp3", rewriteMenu
            );

            $(".menubutton").removeClass("menuClick");
            $(this).addClass("menuClick");
        });
    });

    var rewriteMenu = function (categories) {
        var today = new Date();
        var menuText = target.text();
        var navName = target.parent().parent().parent().attr("id");

        for (var i = 0; i < categories.length; i++) {
            var hall = categories[i];

            if (navName == hall.navid) {
                var dayOfWeek = today.getDay()
                var weekday = hall.weekdays;
                var menues = weekday[dayOfWeek].menues;

                for (var j = 0; j < menues.length; j++) {
                    var menu = menues[j];

                    if (menuText == menu.menuName) {
                        $pull.singleInsert(menues, j, hall);
                    }
                }
            }
        }
    }


    $(function () {
    	$(window).scroll(function () {
    		var current = $(this).scrollTop();
    		var hundredVH = $("#homepage").height();

    		$(".ar").removeClass("linkAddOn");
    		$(".aa").removeClass("linkAddOn");
    		$(".av").removeClass("linkAddOn");
    		$(".aj").removeClass("linkAddOn");
    		$(".ab").removeClass("linkAddOn");
    		$(".ai").removeClass("linkAddOn");

    		if (current > (hundredVH - 1) && current < (hundredVH * 2 - 1)) {
    			$(".ar").addClass("linkAddOn");
    		} else if (current >= (hundredVH * 2 - 1) && current <(hundredVH * 3 - 1)) {
    			$(".aa").addClass("linkAddOn");
    		} else if (current >= (hundredVH * 3 - 1) && current <(hundredVH * 4 - 1)) {
    			$(".av").addClass("linkAddOn");
    		} else if (current >= (hundredVH * 4 - 1) && current <(hundredVH * 5 - 1)) {
    			$(".aj").addClass("linkAddOn");
    		} else if (current >= (hundredVH * 5 - 1) && current <(hundredVH * 6 - 1)) {
    			$(".ab").addClass("linkAddOn");
    		} else if (current >= (hundredVH * 6 - 1)) {
    			$(".ai").addClass("linkAddOn");
    		} 
    	});
    });
});

(function (global) {
    //JSON PARSING

    var pull = {};

    var insertHTML = function (selector, html) {
        document.querySelector(selector).innerHTML = html;

        $(selector).css('display', 'none');
        $(selector).fadeIn(500);
    };

    pull.fillMenuInfo = function () {
        $ajaxUtils.sendGetRequest(
            "https://api.myjson.com/bins/9zhon", buildMenus
            );
    };

    function compareDates(menues, time) {
        console.log("blehh");

        console.log(menues);

        for (var i = 0; i < menues.length; i++) {
            console.log('asdl;kfjs');

            var menu = menues[i];
            console.log(menu);

            console.log(menu.time[0]);
            console.log(menu.time[1]);
            console.log(time);

            var bool = menu.time[0] <= time;

            console.log(bool);

            if ((menu.time[0] <= time) && (menu.time[1] > time)) {
                return i;
            }
        }

        return -1;
    }

    pull.singleInsert = function (menues, menuNum, hall) {
        var finalMenu;
            if (menuNum != -1) {
                finalMenu = menues[menuNum];

                var star = finalMenu.star; 
                var norm = finalMenu.normal;
                
                var qHtml = "<p class='quickinfo'>";
                var sHtml = "<p>";
                var nHtml = "<p>";
                var timeStamp = "<p>";

                for(var j = 0; j < star.length; j++) {
                    qHtml = qHtml + star[j] + "</br>";
                    sHtml = sHtml + star[j] + "</br>";
                }

                for(var k = 0; k < norm.length; k++) {
                    nHtml = nHtml + norm[k]  + "</br>";
                }

                timeStamp = timeStamp + finalMenu.time[0] + " - " + finalMenu.time[1] + "</p>";

                qHtml = qHtml + "</p>";
                sHtml = sHtml + "</p>";
                nHtml = nHtml + "</p>";

                insertHTML("#" + hall.quickid, qHtml);
                insertHTML("#" + hall.id, sHtml + nHtml);
                insertHTML("#" + hall.timeid, timeStamp);
        } else {
            var closedHtml = "<p class=closed>CLOSED</p>";
            var cqHtml = "<p class=quickinfo>CLOSED</p>";

            insertHTML("#" + hall.quickid, cqHtml);
            insertHTML("#" + hall.id, closedHtml);
        }
    }

    function buildMenuNav (menues, menuNum, hall) {
        var navString = '<ul>'; 

        for (var i = 0; i < menues.length; i++) {
            navString = navString + '<li><button class="menubutton"><span>' + menues[i].menuName + '</span></button></li>';
        }

        navString = navString + "</ul>";

        insertHTML("#" + hall.navid, navString);
    }

    var allCats;

    function buildMenus (categories) {
        allCats = categories;

        for (var i = 0; i < categories.length; i++) {
            var today = new Date();
            var dayOfWeek = today.getDay()
            var time;

            if (today.getHours() < 10) {
                time = "0" + today.getHours() + ":" + today.getMinutes();    
            } else {
                time = today.getHours() + ":" + today.getMinutes();
            }

            var hall = categories[i];
            var weekday = hall.weekdays;
            var menues = weekday[dayOfWeek].menues;
            var menuNum = compareDates(menues, time);

            pull.singleInsert(menues, menuNum, hall);
            buildMenuNav(menues, menuNum, hall);
        }
    }

    $(function () {
        pull.fillMenuInfo();
    });

    global.$pull = pull;
})(window);



