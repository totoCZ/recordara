// recordara 0.1
// WebSDR Automatic Recorder
// Licensed under MIT.

var config = require('./config');
var urlify = require('urlify').create();
var moment = require('moment');
var spawn = require('child_process').spawn;
var spawnSync = require('child_process').spawnSync;
var fs = require('fs');

var hasEvents = false;
var events = [];

var schedNext;
var schedAnnounce;

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

function main() {
    console.log('[i] Asking Google for data');

    var calanderUrl = "https://www.googleapis.com/calendar/v3/calendars/" + config.calendarId + "@group.calendar.google.com/events?orderBy=startTime&singleEvents=true&timeMin=" + new Date().toISOString() +
        "&fields=items(start%2Csummary)%2Csummary&key=" + config.apiKey + "&maxResults=" + config.maxResults;

    var https = require('https');

    https.get(calanderUrl, function (res) {
        console.log("[i] got statusCode: ", res.statusCode);

        var data = '';

        res.on('data', function(chunk) {
            data += chunk;
        });

        res.on('end', function () {
            var obj = JSON.parse(data);
            onHttpReturn(obj);
        });

    }).on('error', function (e) {
        console.log("[!] " + e.message);
        // it shouldn't cycle :>
        // yeah i know, it's stupid
        // why not fix it for me?
        main();
    });
}

function onHttpReturn(obj) {
    hasEvents = true;

    console.log("[i] Number of events found: " + obj.items.length);
    console.log("[i] Time of first event: " + obj.items[0].start.dateTime);

    for (var i = 0; i < obj.items.length; i++) {
        var title = obj.items[i].summary;
        var time = obj.items[i].start.dateTime;
        var eventDate = new Date(time);
        var frequency = extractFrequency(title);
        var theEvent = {
            "eventDate": eventDate,
            "title": title,
            "frequency": frequency
        };
        events.push(theEvent);
    }

    if (hasEvents) {
        onReady();
    }
}


function onReady() {
    console.log('[i] starting main system');
    schedAnnounce = setTimeout(nextAnnouncement, 1);
}

function nextAnnouncement() {
    var next = getNextEvent(false);

    if (next === -1) {
        console.log('[i] restarting');
        hasEvents = false;
        events = [];
        clearTimeout(schedNext);
        clearTimeout(schedAnnounce);
        main();
        return false;
    }

    var time = next.getTime() - (new Date()).getTime();
    schedNext = setTimeout(cmdNext, time - config.announceEarly);

    console.log('[i] scheduler event cmdNext added for ' + next.toISOString());
}

function cmdNext(recursion) {
    recursion = typeof recursion !== 'undefined' ? recursion : true;
    var next = getNextEvent();

    if (next === -1) {
        console.log('[i] restarting');
        hasEvents = false;
        events = [];
        clearTimeout(schedNext);
        clearTimeout(schedAnnounce);
        main();
        return false;
    }

    if (recursion) {
        var next = getNextEvent(false);
        var time = next.getTime() - (new Date()).getTime();
        schedAnnounce = setTimeout(nextAnnouncement, time + 1 * 60000);

        console.log('[i] scheduler event nextAnnouncement added for ' + next.toISOString());
    }
}

function extractFrequency(textToMatch) {
    var digitsRe = '([0-9]*k|[0-9]* k)';
    var exp = new RegExp(digitsRe);
    var expResult = exp.exec(textToMatch);

    if (expResult !== null) {
      expResult = expResult[0].substring(0, expResult[0].length - 1);
      return expResult;
    }
}

// Based on original events code written by foo (UTwente-Usability/events.js)
function getNextEvent(humanReadable) {
    humanReadable = typeof humanReadable !== 'undefined' ? humanReadable : true;

     var eventToCheck = events[0];
     while (eventToCheck != null && eventToCheck.eventDate < new Date()) {
        events.shift();
        eventToCheck = events[0];
     }

    var nextEvents = [];
    var prevEvent;

    for (i = 0; i < events.length; i++) {
        var thisEvent = events[i];
        if (prevEvent == null) {
            prevEvent = thisEvent;
            nextEvents.push(prevEvent);
            continue;
        }

        if (prevEvent.eventDate.toISOString() == thisEvent.eventDate.toISOString()) {
            nextEvents.push(thisEvent);
        } else {
            break;
        }
    }

    if (events.length < 3) {
        return -1;
    }

    var returnVal = "";

    if (humanReadable) {
        for (var eventId = 0; eventId < nextEvents.length; eventId++) {
        
            if (typeof nextEvents[eventId].frequency !== 'undefined' && nextEvents[eventId].frequency.length > 3) {
  
              var searchStr = nextEvents[eventId].title.toUpperCase();
              if (searchStr.contains("PACIFIC") || searchStr.contains("AMERICA")) {
                  continue;              
              }
              
              if (searchStr.contains("M08A")) {
                  continue;
              }
                
              var next = moment(nextEvents[eventId].eventDate);
              
              var length = 15 * 1000 * 60; // 15min
              var convertedTitle = urlify(nextEvents[eventId].title);
              var freq = nextEvents[eventId].frequency;
              var hi, lo;
              
              if (searchStr.contains("LSB")) {
                lo = -3.7;
                hi = -0.15;
              } else if (searchStr.contains("CW")) {
                lo = 0.3;
                hi = 2.7;
                freq = freq - 1;
              } else {
                lo = 0.15;
                hi = 3.7;
              }

              if (searchStr.contains("RTTY")) {
                freq = freq - 1;
              }

              if (searchStr.contains("F01") || searchStr.contains("F06")) {
                  length = 10 * 1000 * 60; // 10min
              }

              if (searchStr.contains("F11")) {
                  length = 1 * 1000 * 60; // 1min
	      }

              if (searchStr.contains("XPA") || searchStr.contains("XPA2")) {
                  length = 5 * 1000 * 60; // 5min
              }

              if (searchStr.contains("HM01")) {
                  length = 25 * 1000 * 60; // 25min
		  continue;
              }

	      if (searchStr.contains("E11") || searchStr.contains("E11A") || searchStr.contains("S11A")) {
		  length = 13 * 1000 * 60; // 13min
	      }
	      
	      if (searchStr.contains("S06") || searchStr.contains("E07")) {
		  length = 16 * 1000 * 60; // 16min
	      }
	      
	      if (searchStr.contains("E06") || searchStr.contains("G06")) {
		  length = 25 * 1000 * 60; // 25min
	      }
	      
              if (searchStr.contains("E07A")) {
                  length = 10 * 1000 * 60; // 10min
              }
	      
              if (searchStr.contains("M01B")) {
                  length = 20 * 1000 * 60; // 20min
              }

              if (searchStr.contains("S06S") || searchStr.contains("E17Z")) {
                  length = 10 * 1000 * 60; // 10min
              }


              var storageDir = '/opt/recordara/output/' + next.utc().format('YYYY-MM-DD') + '/';

              spawn('mkdir', ['-p', storageDir], {
                detached: true
              });
              
              var uno = spawn('/usr/bin/nodejs', ['/opt/recordara/grab.js', freq, storageDir + next.utc().format('HH-mm') + '-' + convertedTitle, length, lo, hi], {
                detached: true
              });

              var dos = spawn('/usr/bin/nodejs', ['/opt/recordara/grab_finish.js', freq, storageDir + next.utc().format('HH-mm') + '-' + convertedTitle, length, lo, hi], {
                detached: true
              });

uno.on('close', (code) => {
//  console.log(`child process exited with code ${code}`);

});

dos.on('close', (code) => {
//  console.log(`child process exited with code ${code}`);

setTimeout(function() {

try {
filename=next.utc().format('YYYY-MM-DD') + '/' + next.utc().format('HH-mm') + '-' + convertedTitle;
iFilename = storageDir + next.utc().format('HH-mm') + '-' + convertedTitle;

    var duration_sil = parseInt(spawnSync('soxi', ['-D', iFilename + '_sil.wav']).stdout.toString().split(".").slice(0,1));
    var duration_full = parseInt(spawnSync('soxi', ['-D', iFilename + '.wav']).stdout.toString().split(".").slice(0,1));
    var diff = duration_full - duration_sil;
    var duration = duration_full - diff;

    if (duration < 20) {

    fs.unlinkSync(iFilename + '.wav');
    fs.unlinkSync(iFilename + '_sil.wav');

    return false;
}

    if (diff > 10) {
      duration = duration + 10;
    }


    spawnSync('ffmpeg', ['-i', iFilename + '.wav', '-ss', '0', '-t', duration, '-acodec', 'copy', iFilename + '_cut.wav'], {});

    if (duration < 100) {
      duration = 100;
    }


    spawnSync('sox', [iFilename + '_cut.wav', '-r', '16000', iFilename + '_r16_cut.wav'], {});

    spawnSync('fdkaac', ['-p5', '-m1', '-o', iFilename + '.m4a', iFilename + '_r16_cut.wav'], {});

    spawnSync('sox', [iFilename + '_cut.wav', '-n', 'spectrogram', '-o', iFilename + '.png', '-c', 'recordara.hetmer.net', '-t', filename, '-x', duration*5, '-z', '70'], {});

    fs.unlinkSync(iFilename + '.wav');
    fs.unlinkSync(iFilename + '_cut.wav');
    fs.unlinkSync(iFilename + '_sil.wav');
    fs.unlinkSync(iFilename + '_r16_cut.wav');

fs.appendFile('/opt/recordara/synclist', iFilename + '\n', function (err) {
  if (err) throw err;
  console.log('Saved!');
});

}
catch (e) {
  console.log("entering catch block");
  console.log(e);
  console.log("leaving catch block");
}

}, 600000);

});
            
            
            }

        }
    } else {
        // here we assume that only date parsing is needed
        returnVal = nextEvents[0].eventDate;
    }

    return returnVal;
}

main();
