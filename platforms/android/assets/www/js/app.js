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


    $.getJSON("quests.json", null).done(function(quests)
    {
        questStorage = quests;
        console.log(questStorage);
        $.each(quests, function(i, quest)
        {
            console.log(quest.lat);

            $("#questContainer").append('\
                <div id="questCard' + i + '" class="card quest" style="display: none;">\
                <div class="item item-divider">\
                    Þraut #' + (i+1)  + '\
                </div>\
                <div class="item item-text-wrap">\
                ' + quest.description + '\
                </div>\
                <div class="item item-divider assertive">\
                    Þraut ólokið\
                </div>\
                </div>');


        });

        $("#questCard" + currentQuestIndex).show();

    }).fail(function(e) { console.log("JSON error") });




    var locationSuccess = function(position)
    {
        var distance = getDistance(position.coords.latitude, position.coords.longitude, 64.141630, -21.966584);
        console.log(currentQuestIndex++);
        if (distance > 1.0)
        {
            $("#vegalengd").text(distance.toPrecision(3) + " km");
        }
        else
        {
            $("#vegalengd").text((distance*1000).toPrecision(3) + " m");
        }
    }

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

    /* var bgGeo = window.plugins.backgroundGeoLocation;

    var ajaxCallback = function(response)
    {
        bgGeo.finish();
    }

    var locationCallback = function(location)
    {
        console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);

        ajaxCallback.call(this);
    }

    var locationFailure = function(error)
    {
        console.log("BackgroundGeoLocation error");
    }

    bgGeo.configure(locationCallback, locationFailure, {
        url: 'http://jof.guru:8005/setBackgroundLocation',
        params: {
            auth_token: "fooauthtoken",
            foo: "bar"
        },
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        notificationTitle: "Ratleikur",
        notifcationText: "Virkur",
        activityType: 'AutomotiveNavigation',
        debug: false,
        stopOnTerminate: false
    });

    bgGeo.start();
    */

  });


})
