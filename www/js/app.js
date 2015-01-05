// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    if (typeof Number.prototype.toRadians == 'undefined') {
        Number.prototype.toRadians = function() { return this * Math.PI / 180; };
    }

    if (typeof Number.prototype.toDegrees == 'undefined') {
        Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };
    }

    var getDistance = function(lat1, lon1, lat2, lon2)
    {
        var R = 6371; // km
        var φ1 = lat1.toRadians();
        var φ2 = lat2.toRadians();
        var Δφ = (lat2-lat1).toRadians();
        var Δλ = (lon2-lon1).toRadians();

        var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }

    var questStorage = null;

    var currentQuestIndex = 0;
    var hintNumber = 5;
    var hintsGiven = [];

    if (window.localStorage.getItem("currentQuestIndex") == null)
    {
        window.localStorage.setItem("currentQuestIndex", currentQuestIndex);
        window.localStorage.setItem("hintsGiven", []);
    }
    else
    {
        currentQuestIndex = parseInt(window.localStorage.getItem("currentQuestIndex"), 10);
        if (window.localStorage.getItem("hintsGiven").length > 0)
        {
            hintsGiven = $.map($(window.localStorage.getItem("hintsGiven").split(',')), function(value){
                return parseInt(value, 10);
            });
        }
    }

    // Load all the quests from a local JSON file.
    $.ajax({ dataType: "json", url: "quests.json", async: false }).done(function(quests)
    {
        questStorage = quests;
        $.each(quests, function(i, quest)
        {
            $("#questContainer").append('\
                <div id="questCard' + i + '" class="card quest" style="display: none;">\
                <div class="item item-divider">\
                    Þraut #' + (i+1)  + '\
                </div>\
                <div class="item item-text-wrap questDescription">\
                <div>' + quest.description + '</div>\
                <div class="questHint" style="display:none;"><b>Vísbending:</b> ' + quest.hint + '</div>\
                </div>\
                <div class="item item-divider assertive questStatus">\
                    Þraut ólokið\
                </div>\
                </div>');


        });
    }).fail(function(e) { console.log("JSON error") });

    // Go through all of the loaded quests and update their status
    // according to our local-storage
    // This is a bit ugly .. relying on global variables, etc.
    var updateQuests = function()
    {
        $.each(questStorage, function(i, quest)
        {
            var questCard = $("#questCard" + i);
            var questDescription = $("#questCard" + i + " .questDescription:first");
            var questStatus = $("#questCard" + i + " .questStatus:first");
            var questHint = $("#questCard" + i + " .questHint:first");

            if (i < currentQuestIndex)
            {
                questStatus.html("Þraut lokið").removeClass("assertive").addClass("balanced");
                questDescription.hide();
                questCard.show();
            }
            else if (i == currentQuestIndex)
            {
                questCard.show();
            }

            if (hintsGiven.indexOf(i) >= 0)
            {
                questHint.show();
            }

        });

        $("#hintCounter").text(""+(hintNumber-hintsGiven.length));
    }


    updateQuests();



    // We have a new position
    var locationSuccess = function(position)
    {
        if (currentQuestIndex < questStorage.length)
        {

            var questLat = questStorage[currentQuestIndex].lat;
            var questLon = questStorage[currentQuestIndex].lon;
            var questRadius = questStorage[currentQuestIndex].radius;
            var distance = getDistance(
                position.coords.latitude,
                position.coords.longitude,
                questLat,
                questLon
            );

            if (distance > 1.0)
            {
                $("#vegalengd").text(distance.toPrecision(3) + " km");
            }
            else
            {
                $("#vegalengd").text((distance*1000).toPrecision(3) + " m");
            }

            if (distance*1000.0 <= questRadius)
            {
                currentQuestIndex++;
                window.localStorage.setItem("currentQuestIndex", currentQuestIndex);
                if (currentQuestIndex < questStorage.length) // Make sure this wasn't the last quest.
                {
                    var media = new Media("/android_asset/www/sound/quest-complete.wav", function() { console.log(this); });
                    media.play();
                    navigator.vibrate(1000);
                }
            }

            updateQuests();

        }
        else
        {
            $("#vegalengd").text("Lokið");
            if (window.localStorage.getItem("campaignComplete") == null)
            {
                window.localStorage.setItem("campaignComplete", "true");
                var media = new Media("/android_asset/www/sound/campaign-complete.flac", function() { this.release(); });
                media.play();
                navigator.vibrate(5000);
            }
        }
    }

    // Failed getting a new position (i.e. a timeout)
    var locationError = function(error)
    {
        console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
    }

    var watchID = navigator.geolocation.watchPosition(
        locationSuccess,
        locationError,
        {
            enableHighAccuracy: true,
            timeout: 30000 
        });

    $("#hintButton").click(function()
    {
         if (currentQuestIndex < questStorage.length)
        {
            if (hintsGiven.indexOf(currentQuestIndex) < 0)
            {
                hintsGiven.push(currentQuestIndex);
                window.localStorage.setItem("hintsGiven", hintsGiven);
            }
            updateQuests();
        }
    });

  });


})
