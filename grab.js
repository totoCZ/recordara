// grab.js standalone
// WebSDR Automatic Recorder
// a part of calanderd/recordara

// argv processing
var iFreq, iFilename, iDuration, iLo, iHi, iBand, iMode;

iFreq = process.argv[2];
iFilename = process.argv[3];
iDuration = process.argv[4];
iLo = process.argv[5];
iHi = process.argv[6]; // default 2.7
iBand = 0;
iMode = 0;

// misc

var spawnSync = require('child_process').spawnSync;
var tmp = require('tmp');
var tmpName = tmp.tmpNameSync();

// spoof cookie id (not needed)

var http = require( "http" );
var url = require( "url" );

var urlstring = "http://websdr.ewi.utwente.nl:8901/";
var parsedurl = url.parse( urlstring );
var options = {
  hostname: parsedurl.hostname,
  port: ( parsedurl.port || 80 ), // 80 by default
  method: 'GET',
  path: parsedurl.path,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36'}
};

var cookie = "";

var request = http.request(
  options,
  function ( response ) {
    // display returned cookies in header
    var setcookie = response.headers["set-cookie"];
    if ( setcookie ) {
      setcookie.forEach(
        function ( cookiestr ) {
          var cookies = cookiestr.split(";");
          cookie = cookies[0];
          prep_html5sound();
        }
      );
    }

    var data = "";
    response.on(
      "data",
      function ( chunk ) { data += chunk; }
    );

    response.on(
      "end",
      function () {
      }
    );
  }
);

request.on(
  "error",
  function( err ) {
    console.error( "ERROR:" + err );
  }
);

request.end(); // let request know it is finished sending


// WS & Fake Audio

var WebSocket = require('websocket').w3cwebsocket;

var AudioContext = require('web-audio-api').AudioContext
  , ctx = new AudioContext

var fs = require('fs');
var wstream = fs.createWriteStream(tmpName + '.wav');

var util = require('util');
var stream = require('stream');
var Writable = stream.Writable ||
  require('readable-stream').Writable;

function MyStream(options) {
  Writable.call(this, options);
}
util.inherits(MyStream, Writable);

MyStream.prototype._write = function (chunk, enc, cb) {
 cb();
};

ctx.outStream = new MyStream;

var ct;

// Obfuscated SDR Code

  /**
   * @return {undefined}
   */
  function init() {
    /**
     * @param {number} event
     * @return {undefined}
     */
    function onComplete(event) {
      var resultMat = event.outputBuffer.getChannelData(0);
      var current = event.outputBuffer.length;
      va++;
      /** @type {number} */
      event = 0;
      for (;event < current;event++) {
        var e = events[type];
        /** @type {number} */
        var end = ratio * h / value;
        start += end;
        if (1 <= start) {
          start -= 1;
          /** @type {number} */
          events[type] = 0;
          type++;
          if (type >= d) {
            type -= d;
          }
          var list = events[type];
          if (oa) {
            /** @type {number} */
            e = (start * list + (end - start) * e) / end;
          }
        }
        /** @type {number} */
        resultMat[event] = 2E-5 * e * idet;
      }
      /** @type {number} */
      m1 = (new Date).getTime();
      /** @type {number} */
      event = (new Date).getTime();
      if (_event_end) {
        /** @type {number} */
        current = event - _event_end;
        if (current > computed) {
          /** @type {number} */
          computed = current;
        }
      }
      /** @type {number} */
      _event_end = event;
      if (J) {
        if (0 == resultMat[0]) {
          N++;
        }
      }
    }
    /**
     * @param {(Array|number)} e
     * @return {undefined}
     */
    function stop(e) {
      e = e.inputBuffer.getChannelData(0);
      if (!perm) {
        if (U) {
          U--;
        } else {
          if (0 != e[0]) {
            /** @type {number} */
            N = 5;
          } else {
            N--;
            if (!N) {
              /** @type {number} */
              N = 5;
              /** @type {number} */
              U = 25;
              J++;
              data.disconnect();
              /** @type {null} */
              data.onaudioprocess = callback;
              data = context.createScriptProcessor(x, 1, 1);
              /** @type {function (number): undefined} */
              data.onaudioprocess = onComplete;
              this.p = data;
              data.connect(node);
              data.connect(self);
            }
          }
        }
      }
    }
    /**
     * @param {number} e
     * @return {undefined}
     */
    function click(e) {
      var prevSources = e.inputBuffer.getChannelData(0);
      e = e.inputBuffer.length;
      if (reader) {
        var i;
        /** @type {number} */
        i = 0;
        for (;i < e;i++) {
          if (reader.setInt16(index, prevSources[i] / 2E-5, true), index += 2, index >= size) {
            /** @type {ArrayBuffer} */
            var data = new ArrayBuffer(size);
            /** @type {number} */
            index = 0;
            /** @type {DataView} */
            reader = new DataView(data);
            args.push(data);
          }
        }
      }
    }
    /** @type {string} */
    //document.getElementById("soundappletdiv").innerHTML = '<div onclick="var e=document.getElementById(\'soundappletdebug\'); e.style.display=(e.style.display==\'none\')?\'block\':\'none\';" style="max-width:400px; min-height:50px; border-style:solid; border-color:black; background-color:white; border-width:1px; margin:2px; padding:2px; font-family:sans-serif; font-size:x-small;">WebSDR HTML5 sound - Copyright 2007-2016, P.T. de Boer, pa3fwm@websdr.org<br><span id="soundappletdebug" style="display:none"></span></div><span id="debug2"></span>';
    /** @type {Int16Array} */
    var events = new Int16Array(d);
    /** @type {number} */
    var e = 0;
    /** @type {number} */
    var type = 6144;
    /** @type {number} */
    var start = 0;
    /** @type {number} */
    var h = 8E3;
    /** @type {number} */
    var value = 48E3;
    /** @type {number} */
    var ratio = 1;
    /** @type {number} */
    var idet = 1;
    /** @type {number} */
    var getid = -1;
    var reader;
    /** @type {number} */
    var index = 0;
    /** @type {number} */
    var size = 65536;
    /** @type {Array} */
    var args = [];
    var rule = this;
    /** @type {Array} */
    var tlds = [-5504, -5248, -6016, -5760, -4480, -4224, -4992, -4736, -7552, -7296, -8064, -7808, -6528, -6272, -7040, -6784, -2752, -2624, -3008, -2880, -2240, -2112, -2496, -2368, -3776, -3648, -4032, -3904, -3264, -3136, -3520, -3392, -22016, -20992, -24064, -23040, -17920, -16896, -19968, -18944, -30208, -29184, -32256, -31232, -26112, -25088, -28160, -27136, -11008, -10496, -12032, -11520, -8960, -8448, -9984, -9472, -15104, -14592, -16128, -15616, -13056, -12544, -14080, -13568, -344, -328, 
    -376, -360, -280, -264, -312, -296, -472, -456, -504, -488, -408, -392, -440, -424, -88, -72, -120, -104, -24, -8, -56, -40, -216, -200, -248, -232, -152, -136, -184, -168, -1376, -1312, -1504, -1440, -1120, -1056, -1248, -1184, -1888, -1824, -2016, -1952, -1632, -1568, -1760, -1696, -688, -656, -752, -720, -560, -528, -624, -592, -944, -912, -1008, -976, -816, -784, -880, -848, 5504, 5248, 6016, 5760, 4480, 4224, 4992, 4736, 7552, 7296, 8064, 7808, 6528, 6272, 7040, 6784, 2752, 2624, 3008, 2880, 
    2240, 2112, 2496, 2368, 3776, 3648, 4032, 3904, 3264, 3136, 3520, 3392, 22016, 20992, 24064, 23040, 17920, 16896, 19968, 18944, 30208, 29184, 32256, 31232, 26112, 25088, 28160, 27136, 11008, 10496, 12032, 11520, 8960, 8448, 9984, 9472, 15104, 14592, 16128, 15616, 13056, 12544, 14080, 13568, 344, 328, 376, 360, 280, 264, 312, 296, 472, 456, 504, 488, 408, 392, 440, 424, 88, 72, 120, 104, 24, 8, 56, 40, 216, 200, 248, 232, 152, 136, 184, 168, 1376, 1312, 1504, 1440, 1120, 1056, 1248, 1184, 1888, 
    1824, 2016, 1952, 1632, 1568, 1760, 1696, 688, 656, 752, 720, 560, 528, 624, 592, 944, 912, 1008, 976, 816, 784, 880, 848];
    /** @type {Array} */
    var a = [0.0084619, 3.6183E-4, 2.0264E-4, -4.8621E-5, -3.6771E-4, -7.0991E-4, -0.0010355, -0.0012935, -0.0014506, -0.0014733, -0.0013571, -0.0011019, -7.4253E-4, -3.0836E-4, 1.358E-4, 5.6517E-4, 8.8996E-4, 0.0010664, 0.0010912, 9.2941E-4, 6.0906E-4, 1.5494E-4, -3.7203E-4, -9.1186E-4, -0.001389, -0.0017416, -0.0019133, -0.0018764, -0.0016225, -0.0011768, -5.8255E-4, 9.2361E-5, 7.5528E-4, 0.0013306, 0.0017366, 0.0019135, 0.0018299, 0.0014834, 9.0902E-4, 1.6944E-4, -6.4513E-4, -0.0014333, -0.0020901, 
    -0.002526, -0.0026728, -0.0024998, -0.0020096, -0.0012556, -3.2129E-4, 6.8312E-4, 0.0016291, 0.0023941, 0.0028705, 0.0029846, 0.002705, 0.0020504, 0.0010884, -7.0093E-5, -0.0012848, -0.0024011, -0.0032709, -0.0037692, -0.0038134, -0.0033791, -0.0024966, -0.0012601, 1.8871E-4, 0.0016733, 0.0030042, 0.0040027, 0.0045239, 0.0044775, 0.0038421, 0.0026705, 0.0010869, -7.2511E-4, -0.0025439, -0.0041336, -0.0052788, -0.0058077, -0.0056185, -0.0046979, -0.0031235, -0.0010625, 0.0012472, 0.0035218, 0.005466, 
    0.0068099, 0.0073449, 0.0069525, 0.0056265, 0.0034784, 7.3321E-4, -0.0022942, -0.005233, -0.007697, -0.0093357, -0.0098779, -0.0091724, -0.0072151, -0.0041599, -3.1209E-4, 0.0038988, 0.007962, 0.011341, 0.013538, 0.014156, 0.012956, 0.0099028, 0.0051811, -7.971E-4, -0.0074221, -0.013934, -0.019491, -0.023251, -0.024456, -0.02252, -0.017099, -0.0081382, 0.0040987, 0.019038, 0.035829, 0.053411, 0.070595, 0.086169, 0.098999, 0.10813, 0.11288, 0.11288, 0.10813, 0.098999, 0.086169, 0.070595, 0.053411, 
    0.035829, 0.019038, 0.0040987, -0.0081382, -0.017099, -0.02252, -0.024456, -0.023251, -0.019491, -0.013934, -0.0074221, -7.971E-4, 0.0051811, 0.0099028, 0.012956, 0.014156, 0.013538, 0.011341, 0.007962, 0.0038988, -3.1209E-4, -0.0041599, -0.0072151, -0.0091724, -0.0098779, -0.0093357, -0.007697, -0.005233, -0.0022942, 7.3321E-4, 0.0034784, 0.0056265, 0.0069525, 0.0073449, 0.0068099, 0.005466, 0.0035218, 0.0012472, -0.0010625, -0.0031235, -0.0046979, -0.0056185, -0.0058077, -0.0052788, -0.0041336, 
    -0.0025439, -7.2511E-4, 0.0010869, 0.0026705, 0.0038421, 0.0044775, 0.0045239, 0.0040027, 0.0030042, 0.0016733, 1.8871E-4, -0.0012601, -0.0024966, -0.0033791, -0.0038134, -0.0037692, -0.0032709, -0.0024011, -0.0012848, -7.0093E-5, 0.0010884, 0.0020504, 0.002705, 0.0029846, 0.0028705, 0.0023941, 0.0016291, 6.8312E-4, -3.2129E-4, -0.0012556, -0.0020096, -0.0024998, -0.0026728, -0.002526, 0.0035218, 0.0012472, -0.0010625, -0.0031235, -0.0046979, -0.0056185, -0.0058077, -0.0052788, -0.0041336, -0.0025439, 
    -7.2511E-4, 0.0010869, 0.0026705, 0.0038421, 0.0044775, 0.0045239, 0.0040027, 0.0030042, 0.0016733, 1.8871E-4, -0.0012601, -0.0024966, -0.0033791, -0.0038134, -0.0037692, -0.0032709, -0.0024011, -0.0012848, -7.0093E-5, 0.0010884, 0.0020504, 0.002705, 0.0029846, 0.0028705, 0.0023941, 0.0016291, 6.8312E-4, -3.2129E-4, -0.0012556, -0.0020096, -0.0024998, -0.0026728, -0.002526, -0.0020901, -0.0014333, -6.4513E-4, 1.6944E-4, 9.0902E-4, 0.0014834, 0.0018299, 0.0019135, 0.0017366, 0.0013306, 7.5528E-4, 
    9.2361E-5, -5.8255E-4, -0.0011768, -0.0016225, -0.0018764, -0.0019133, -0.0017416, -0.001389, -9.1186E-4, -3.7203E-4, 1.5494E-4, 6.0906E-4, 9.2941E-4, 0.0010912, 0.0010664, 8.8996E-4, 5.6517E-4, 1.358E-4, -3.0836E-4, -7.4253E-4, -0.0011019, -0.0013571, -0.0014733, -0.0014506, -0.0012935, -0.0010355, -7.0991E-4, -3.6771E-4, -4.8621E-5, 2.0264E-4, 3.6183E-4, 0.0084619];
    /** @type {Array} */
    var i = [-6.0729E-4, 0.005547, 0.0012025, 5.5133E-4, 1.6992E-4, -2.3195E-4, -5.9426E-4, -8.2206E-4, -8.4752E-4, -6.5061E-4, -2.6977E-4, 2.0642E-4, 6.5721E-4, 9.6247E-4, 0.001032, 8.3416E-4, 4.0395E-4, -1.5769E-4, -7.1117E-4, -0.0011087, -0.0012377, -0.0010475, -5.7139E-4, 8.2522E-5, 7.5058E-4, 0.001259, 0.001464, 0.0012963, 7.7829E-4, 2.8808E-5, -7.6962E-4, -0.0014083, -0.001713, -0.0015833, -0.001033, -1.8129E-4, 7.6089E-4, 0.0015551, 0.0019797, 0.0019098, 0.0013313, 3.7702E-4, -7.2555E-4, -0.0016986, 
    -0.0022625, -0.0022768, -0.0016922, -6.3215E-4, 6.491E-4, 0.0018212, 0.002576, 0.0026933, 0.0021119, 9.4722E-4, -5.2351E-4, -0.0019315, -0.0029037, -0.0031646, -0.002609, -0.0013427, 3.3954E-4, 0.0020171, 0.0032517, 0.0036965, 0.003196, 0.0018324, -8.0558E-5, -0.0020711, -0.0036212, -0.004303, -0.0038921, -0.0024398, -2.7089E-4, 0.0020837, 0.0040178, 0.0050015, 0.0047273, 0.003197, 7.4395E-4, -0.0020419, -0.0044463, -0.0058212, -0.0057441, -0.0041549, -0.0013781, 0.0019266, 0.004923, 0.0068105, 
    0.0070197, 0.0053925, 0.0022394, -0.00171, -0.0054734, -0.0080484, -0.0086754, -0.0070524, -0.0034446, 0.001345, 0.0061452, 0.0096921, 0.010951, 0.009402, 0.0052149, -7.3621E-4, -0.0070399, -0.012063, -0.014353, -0.013025, -0.0080465, -3.2853E-4, 0.0084029, 0.015957, 0.020176, 0.019477, 0.013318, 0.0024682, -0.010997, -0.023996, -0.032993, -0.034705, -0.026822, -0.0085825, 0.018925, 0.052806, 0.088761, 0.12179, 0.14705, 0.16074, 0.16074, 0.14705, 0.12179, 0.088761, 0.052806, 0.018925, -0.0085825, 
    -0.026822, -0.034705, -0.032993, -0.023996, -0.010997, 0.0024682, 0.013318, 0.019477, 0.020176, 0.015957, 0.0084029, -3.2853E-4, -0.0080465, -0.013025, -0.014353, -0.012063, -0.0070399, -7.3621E-4, 0.0052149, 0.009402, 0.010951, 0.0096921, 0.0061452, 0.001345, -0.0034446, -0.0070524, -0.0086754, -0.0080484, -0.0054734, -0.00171, 0.0022394, 0.0053925, 0.0070197, 0.0068105, 0.004923, 0.0019266, -0.0013781, -0.0041549, -0.0057441, -0.0058212, -0.0044463, -0.0020419, 7.4395E-4, 0.003197, 0.0047273, 
    0.0050015, 0.0040178, 0.0020837, -2.7089E-4, -0.0024398, -0.0038921, -0.004303, -0.0036212, -0.0020711, -8.0558E-5, 0.0018324, 0.003196, 0.0036965, 0.0032517, 0.0020171, 3.3954E-4, -0.0013427, -0.002609, -0.0031646, -0.0029037, -0.0019315, -5.2351E-4, 9.4722E-4, 0.0021119, 0.0026933, 0.002576, 0.0018212, 6.491E-4, -6.3215E-4, -0.0016922, -0.0022768, -0.0022625, -0.0016986, -7.2555E-4, 3.7702E-4, 0.0013313, 0.0019098, 0.0019797, 0.0015551, 7.6089E-4, -1.8129E-4, -0.001033, -0.0015833, -0.001713, 
    -0.0014083, -7.6962E-4, 2.8808E-5, 7.7829E-4, 0.0012963, 0.001464, 0.001259, 7.5058E-4, 8.2522E-5, -5.7139E-4, -0.0010475, -0.0012377, -0.0011087, -7.1117E-4, -1.5769E-4, 4.0395E-4, 8.3416E-4, 0.001032, 9.6247E-4, 6.5721E-4, 2.0642E-4, -2.6977E-4, -6.5061E-4, -8.4752E-4, -8.2206E-4, -5.9426E-4, -2.3195E-4, 1.6992E-4, 5.5133E-4, 0.0012025, 0.005547, -6.0729E-4];
    /** @type {Array} */
    var codeSegments = [-0.0057279, -3.55E-4, -3.4657E-4, -3.2265E-4, -2.8568E-4, -2.3281E-4, -1.673E-4, -8.6773E-5, 4.4005E-6, 1.0817E-4, 2.1895E-4, 3.3872E-4, 4.6081E-4, 5.89E-4, 7.1566E-4, 8.5449E-4, 9.6872E-4, 0.0010826, 0.0011887, 0.0012785, 0.0013539, 0.0014097, 0.0014451, 0.0014572, 0.0014449, 0.0014071, 0.0013429, 0.001253, 0.0011363, 9.944E-4, 8.2476E-4, 6.3679E-4, 4.284E-4, 2.0073E-4, -3.878E-5, -2.8944E-4, -5.4502E-4, -8.0225E-4, -0.0010553, -0.0012998, -0.0015302, -0.001742, -0.00193, 
    -0.0020897, -0.0022163, -0.0023046, -0.0023534, -0.0023594, -0.0023179, -0.0022306, -0.0020944, -0.0019112, -0.0016809, -0.0014065, -0.0010903, -7.3703E-4, -3.507E-4, 6.2545E-5, 4.9677E-4, 9.4413E-4, 0.0013968, 0.001847, 0.0022869, 0.0027056, 0.0030964, 0.003449, 0.0037558, 0.0040081, 0.0041989, 0.0043211, 0.0043693, 0.0043381, 0.0042245, 0.0040256, 0.0037411, 0.0033716, 0.0029193, 0.002387, 0.0017819, 0.0011093, 3.7879E-4, -4.0024E-4, -0.0012159, -0.002056, -0.0029064, -0.0037527, -0.0045791, 
    -0.0053699, -0.0061082, -0.006778, -0.007363, -0.0078475, -0.0082153, -0.0084535, -0.0085479, -0.0084873, -0.0082614, -0.007862, -0.0072826, -0.0065194, -0.00557, -0.0044354, -0.0031181, -0.0016241, 3.9188E-5, 0.0018614, 0.00383, 0.0059296, 0.008144, 0.010454, 0.012839, 0.015277, 0.017745, 0.020218, 0.022673, 0.025085, 0.027427, 0.029676, 0.031808, 0.0338, 0.035631, 0.037279, 0.038728, 0.039961, 0.040964, 0.041727, 0.04224, 0.042498, 0.042498, 0.04224, 0.041727, 0.040964, 0.039961, 0.038728, 
    0.037279, 0.035631, 0.0338, 0.031808, 0.029676, 0.027427, 0.025085, 0.022673, 0.020218, 0.017745, 0.015277, 0.012839, 0.010454, 0.008144, 0.0059296, 0.00383, 0.0018614, 3.9188E-5, -0.0016241, -0.0031181, -0.0044354, -0.00557, -0.0065194, -0.0072826, -0.007862, -0.0082614, -0.0084873, -0.0085479, -0.0084535, -0.0082153, -0.0078475, -0.007363, -0.006778, -0.0061082, -0.0053699, -0.0045791, -0.0037527, -0.0029064, -0.002056, -0.0012159, -4.0024E-4, 3.7879E-4, 0.0011093, 0.0017819, 0.002387, 0.0029193, 
    0.0033716, 0.0037411, 0.0040256, 0.0042245, 0.0043381, 0.0043693, 0.0043211, 0.0041989, 0.0040081, 0.0037558, 0.003449, 0.0030964, 0.0027056, 0.0022869, 0.001847, 0.0013968, 9.4413E-4, 4.9677E-4, 6.2545E-5, -3.507E-4, -7.3703E-4, -0.0010903, -0.0014065, -0.0016809, -0.0019112, -0.0020944, -0.0022306, -0.0023179, -0.0023594, -0.0023534, -0.0023046, -0.0022163, -0.0020897, -0.00193, -0.001742, -0.0015302, -0.0012998, -0.0010553, -8.0225E-4, -5.4502E-4, -2.8944E-4, -3.878E-5, 2.0073E-4, 4.284E-4, 
    6.3679E-4, 8.2476E-4, 9.944E-4, 0.0011363, 0.001253, 0.0013429, 0.0014071, 0.0014449, 0.0014572, 0.0014451, 0.0014097, 0.0013539, 0.0012785, 0.0011887, 0.0010826, 9.6872E-4, 8.5449E-4, 7.1566E-4, 5.89E-4, 4.6081E-4, 3.3872E-4, 2.1895E-4, 1.0817E-4, 4.4005E-6, -8.6773E-5, -1.673E-4, -2.3281E-4, -2.8568E-4, -3.2265E-4, -3.4657E-4, -3.55E-4, -0.0057279];
    /** @type {Array} */
    var b = [1.4796E-5, 5.4604E-4, 1.0129E-4, -1.1334E-6, -1.3189E-4, -1.9395E-4, -1.3571E-4, 2.1337E-5, 1.8632E-4, 2.5029E-4, 1.5699E-4, -5.2509E-5, -2.543E-4, -3.138E-4, -1.739E-4, 9.7403E-5, 3.3704E-4, 3.8346E-4, 1.8391E-4, -1.5855E-4, -4.3525E-4, -4.5776E-4, -1.8388E-4, 2.3889E-4, 5.5005E-4, 5.3497E-4, 1.7021E-4, -3.4174E-4, -6.8209E-4, -6.1268E-4, -1.3912E-4, 4.6928E-4, 8.3027E-4, 6.8693E-4, 8.6099E-5, -6.2455E-4, -9.9487E-4, -7.5513E-4, -6.7519E-6, 8.1051E-4, 0.0011744, 8.1167E-4, -1.0417E-4, 
    -0.0010287, -0.001367, -8.5273E-4, 2.5207E-4, 0.0012819, 0.0015701, 8.7113E-4, -4.4169E-4, -0.0015723, -0.0017801, -8.6101E-4, 6.801E-4, 0.0019007, 0.0019933, 8.1468E-4, -9.7311E-4, -0.0022683, -0.0022045, -7.237E-4, 0.0013276, 0.0026763, 0.002408, 5.7881E-4, -0.0017511, -0.0031255, -0.0025968, -3.6912E-4, 0.0022518, 0.0036165, 0.0027634, 8.2343E-5, -0.0028398, -0.0041506, -0.0028982, 2.9666E-4, 0.0035272, 0.0047294, 0.0029905, -7.8603E-4, -0.0043296, -0.0053562, -0.0030274, 0.0014094, 0.0052683, 
    0.0060364, 0.0029929, -0.0021982, -0.0063734, -0.0067797, -0.0028658, 0.003197, 0.0076896, 0.0076028, 0.0026174, -0.0044718, -0.0092868, -0.008534, -0.0022054, 0.0061279, 0.01128, 0.0096244, 0.0015614, -0.0083444, -0.013874, -0.010969, -5.6468E-4, 0.011455, 0.017461, 0.01276, -0.0010262, -0.016164, -0.022908, -0.015444, 0.0037854, 0.024249, 0.03255, 0.020318, -0.0095077, -0.041874, -0.055528, -0.033308, 0.02819, 0.11468, 0.19857, 0.25007, 0.25007, 0.19857, 0.11468, 0.02819, -0.033308, -0.055528, 
    -0.041874, -0.0095077, 0.020318, 0.03255, 0.024249, 0.0037854, -0.015444, -0.022908, -0.016164, -0.0010262, 0.01276, 0.017461, 0.011455, -5.6468E-4, -0.010969, -0.013874, -0.0083444, 0.0015614, 0.0096244, 0.01128, 0.0061279, -0.0022054, -0.008534, -0.0092868, -0.0044718, 0.0026174, 0.0076028, 0.0076896, 0.003197, -0.0028658, -0.0067797, -0.0063734, -0.0021982, 0.0029929, 0.0060364, 0.0052683, 0.0014094, -0.0030274, -0.0053562, -0.0043296, -7.8603E-4, 0.0029905, 0.0047294, 0.0035272, 2.9666E-4, 
    -0.0028982, -0.0041506, -0.0028398, 8.2343E-5, 0.0027634, 0.0036165, 0.0022518, -3.6912E-4, -0.0025968, -0.0031255, -0.0017511, 5.7881E-4, 0.002408, 0.0026763, 0.0013276, -7.237E-4, -0.0022045, -0.0022683, -9.7311E-4, 8.1468E-4, 0.0019933, 0.0019007, 6.801E-4, -8.6101E-4, -0.0017801, -0.0015723, -4.4169E-4, 8.7113E-4, 0.0015701, 0.0012819, 2.5207E-4, -8.5273E-4, -0.001367, -0.0010287, -1.0417E-4, 8.1167E-4, 0.0011744, 8.1051E-4, -6.7519E-6, -7.5513E-4, -9.9487E-4, -6.2455E-4, 8.6099E-5, 6.8693E-4, 
    8.3027E-4, 4.6928E-4, -1.3912E-4, -6.1268E-4, -6.8209E-4, -3.4174E-4, 1.7021E-4, 5.3497E-4, 5.5005E-4, 2.3889E-4, -1.8388E-4, -4.5776E-4, -4.3525E-4, -1.5855E-4, 1.8391E-4, 3.8346E-4, 3.3704E-4, 9.7403E-5, -1.739E-4, -3.138E-4, -2.543E-4, -5.2509E-5, 1.5699E-4, 2.5029E-4, 1.8632E-4, 2.1337E-5, -1.3571E-4, -1.9395E-4, -1.3189E-4, -1.1334E-6, 1.0129E-4, 5.4604E-4, 1.4796E-5];
    /** @type {Array} */
    var c = [0.0065862, -0.0022838, -0.0059202, -0.0112239, -0.0169697, -0.0214685, -0.022742, -0.0189184, -0.0086407, 0.0084932, 0.0316914, 0.0588926, 0.0870663, 0.1126093, 0.1320398, 0.1425063, 0.1425063, 0.1320398, 0.1126093, 0.0870663, 0.0588926, 0.0316914, 0.0084932, -0.0086407, -0.0189184, -0.022742, -0.0214685, -0.0169697, -0.0112239, -0.0059202, -0.0022838, 0.0065862];
    /** @type {Array} */
    var el = [-0.0086492, -0.0044524, -0.0043664, -0.0030946, -3.094E-4, 0.0042348, 0.010627, 0.018809, 0.028525, 0.039333, 0.050605, 0.061655, 0.071697, 0.079997, 0.085925, 0.089013, 0.089013, 0.085925, 0.079997, 0.071697, 0.061655, 0.050605, 0.039333, 0.028525, 0.018809, 0.010627, 0.0042348, -3.094E-4, -0.0030946, -0.0043664, -0.0044524, -0.0086492];
    /** @type {Array} */
    var attributes = [0.0080236, 0.001488, -0.0074204, -0.0175495, -0.0195816, -0.0075536, 0.0136434, 0.0283156, 0.020311, -0.0121801, -0.0489419, -0.0561146, -0.0078976, 0.0922184, 0.2069483, 0.2833355, 0.2833355, 0.2069483, 0.0922184, -0.0078976, -0.0561146, -0.0489419, -0.0121801, 0.020311, 0.0283156, 0.0136434, -0.0075536, -0.0195816, -0.0175495, -0.0074204, 0.001488, 0.0080236];
    /** @type {boolean} */
    var oa = true;
    /** @type {number} */
    var min = 1E3;
    /** @type {boolean} */
    var perm = false;
    /** @type {number} */
    var m1 = 0;
    /** @type {number} */
    var _event_end = 0;
    /** @type {number} */
    var computed = 0;
    /** @type {number} */
    var va = 0;
    /** @type {number} */
    var N = 5;
    /** @type {number} */
    var U = 25;
    var context;
    var data;
    var node;
    /** @type {Array} */
    var buffer = [];
    /** @type {number} */
    var J = 0;
    var self;
    var audio;
    /** @type {number} */
    var olen = 0;
    /** @type {number} */
    var err = 0;
    /** @type {number} */
    var error = 0;
    /** @type {number} */
    var next = 0;
    /** @type {number} */
    var last = 0;
    /** @type {number} */
    var resp = 0;
    /** @type {number} */
    var response = 0;
    if (context = ct) {
      /** @type {(Array.<string>|null)} */
      var sa = /firefox\/([0-9]+)/i.exec(navigator.userAgent);
      if (sa) {
        if (41 > sa[1]) {
          /** @type {number} */
          J = 1;
        }
      }
      /** @type {number} */
      context.sampleRate = value;
      /** @type {number} */
      value = context.sampleRate;
      /** @type {number} */
      var x = 2048;
      /** @type {number} */
      x = 2 * x;
      try {
        data = context.createScriptProcessor(x, 0, 1);
      } catch (Aa) {
        data = context.createJavaScriptNode(x, 1, 1);
      }
      /** @type {function (number): undefined} */
      data.onaudioprocess = onComplete;
      this.p = data;
      node = context.createConvolver();
      data.connect(node);
      node.connect(context.destination);
      var consolee;
      if (true ||sup_android) {
        a = context.createBuffer(1, 32, value);
        consolee = a.getChannelData(0);
        consolee.set(c);
        buffer[0] = a;
        a = context.createBuffer(1, 32, value);
        consolee = a.getChannelData(0);
        consolee.set(c);
        buffer[1] = a;
        a = context.createBuffer(1, 32, value);
        consolee = a.getChannelData(0);
        consolee.set(el);
        buffer[2] = a;
        a = context.createBuffer(1, 32, value);
        consolee = a.getChannelData(0);
        consolee.set(attributes);
        buffer[3] = a;
      } else {
        /** @type {number} */
        c = Math.round(value / 48E3);
        if (1 > c) {
          /** @type {number} */
          c = 1;
        }
        /** @type {number} */
        el = 512 * c;
        /** @type {Array} */
        codeSegments = [i, a, codeSegments, b];
        /** @type {number} */
        i = 0;
        for (;i < codeSegments.length;i++) {
          attributes = codeSegments[i];
          /** @type {Array} */
          var obj = [];
          /** @type {number} */
          a = 0;
          for (;a < attributes.length;a++) {
            /** @type {number} */
            b = 0;
            for (;b < c;b++) {
              obj[a * c + b] = attributes[a];
            }
          }
          a = context.createBuffer(1, el, value);
          console = a.getChannelData(0);
          console.set(obj);
          buffer[i] = a;
        }
      }
      /** @type {boolean} */
      node.normalize = false;
      node.buffer = buffer[0];
      if (J) {
        self = context.createScriptProcessor(x, 1, 1);
        data.connect(self);
        /** @type {function ((Array|number)): undefined} */
        self.onaudioprocess = stop;
      }
      if (t) {
        self = context.createScriptProcessor(x, 1, 1);
        node.connect(self);
        /** @type {function (number): undefined} */
        self.onaudioprocess = click;
      }
    } else {
      if (false) {
        audio.mozSetup(1, value);
      } else {
        /** @type {null} */
        audio = callback;
        if (false) {
          //window.browsersupporterror();
        }
      }
    }
    /** @type {number} */
    var middle = 0;
    /** @type {number} */
    var left = 0.3 * value;
    var key;
    /**
     * @return {undefined}
     */
    doe = function() {
      if (audio) {
        var i = audio.mozCurrentSampleOffset();
        /** @type {number} */
        var padLength = Math.round(left - (olen - i));
        if (0 == middle) {
          if (0 == i) {
            /** @type {number} */
            padLength = Math.round(0.05 * value);
          } else {
            middle = olen;
            left = middle + Math.round(0.05 * value);
            if (left < 0.25 * value) {
              /** @type {number} */
              left = Math.round(0.25 * value);
            }
          }
        }
        /** @type {Array} */
        var tail = [];
        /** @type {number} */
        i = 0;
        for (;i < padLength;i++) {
          var e = events[type];
          /** @type {number} */
          var end = ratio * h / value;
          start += end;
          if (1 <= start) {
            start -= 1;
            /** @type {number} */
            events[type] = 0;
            type++;
            if (type >= d) {
              type -= d;
            }
            var list = events[type];
            if (oa) {
              /** @type {number} */
              e = (start * list + (end - start) * e) / end;
            }
          }
          if (perm) {
            /** @type {number} */
            e = 0;
          }
          if (!(e = 2E-5 * e * idet)) {
            /** @type {number} */
            e = 0;
          }
          /** @type {number} */
          end = 0.044 * e + 0.088 * err + 0.044 * error - -1.354 * next - 0.53 * last;
          /** @type {number} */
          list = 0.044 * end + 0.088 * next + 0.044 * last - -1.354 * resp - 0.53 * response;
          /** @type {number} */
          error = err;
          /** @type {number} */
          err = e;
          /** @type {number} */
          last = next;
          /** @type {number} */
          next = end;
          /** @type {number} */
          response = resp;
          /** @type {number} */
          resp = list;
          /** @type {number} */
          tail[i] = list;
          if (3 == key) {
            /** @type {number} */
            tail[i] = e;
          }
        }
        /** @type {number} */
        m1 = (new Date).getTime();
        padLength = audio.mozWriteAudio(tail);
        olen += padLength;
      }
    };
    var YY_START;
    var offset;
    var buff;
    /** @type {Array} */
    obj = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {Array} */
    var arg = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    /** @type {number} */
    var R = 0;
    /** @type {WebSocket} */
    var ws = new WebSocket("ws://websdr.ewi.utwente.nl:8901/~~stream?v=11", undefined, undefined, {'Origin': 'http://websdr.ewi.utwente.nl:8901', 'Cookie': cookie+"; view=2", 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36'});
    /** @type {string} */
    ws.binaryType = "arraybuffer";
    /** @type {number} */
    var max = 500;
    /**
     * @param {number} a
     * @return {undefined}
     */
    ws.onmessage = function(a) {
      if (!context) {
        doe();
      }
      /** @type {number} */
      var data = (2 * d + e - type - ((new Date).getTime() - m1) * h / 1E3) % d;
      max += 0.01 * (data - max);
      if (max > 2 * min) {
        /** @type {number} */
        type = (d + e - min) % d;
        data = max = min;
      }
      /** @type {number} */
      ratio = 1 + 1E-5 * (max - min);
      if (1.002 < ratio) {
        /** @type {number} */
        ratio = 1.002;
      }
      if (0.998 > ratio) {
        /** @type {number} */
        ratio = 0.998;
      }
      /** @type {string} */
      data = Math.round(data) + " " + Math.round(min) + " " + Math.round(max) + " " + Math.round(1E6 * (ratio - 1)) + "<br>" + Math.round(h) + " " + key + " " + Math.round(value);
      data += context ? " WebAudio" : audio ? " MozAudio" : " none";
      data += "<br>";
      if (J) {
        data += " FFbug " + (J - 1) + "(" + N + "," + U + ")";
      }
      /** @type {string} */
      //document.getElementById("soundappletdebug").innerHTML = data;
      /** @type {Uint8Array} */
      data = new Uint8Array(a.data);
      var i;
      a = e;
      /** @type {number} */
      lastlen = data.length;
      /** @type {number} */
      i = 0;
      for (;i < data.length;i++) {
        /** @type {number} */
        var f = 0;
        /** @type {number} */
        var bytesin = 0;
        if (240 == (data[i] & 240)) {
          smeter = 256 * (data[i] & 15) + data[i + 1];
          if (rule.smetercallback) {
            rule.smetercallback(10 * smeter);
          }
          i++;
        } else {
          if (128 == data[i]) {
            var len;
            /** @type {number} */
            len = 0;
            for (;128 > len;len++) {
              events[e + len] = tlds[data[i + 1 + len]];
            }
            e += 128;
            if (e >= d) {
              e -= d;
            }
            i += 128;
            var val;
            /** @type {number} */
            val = 0;
            for (;20 > val;val++) {
              /** @type {number} */
              obj[val] = arg[val] = 0;
            }
            /** @type {number} */
            R = 0;
          } else {
            if (144 <= data[i] && 223 >= data[i]) {
              /** @type {number} */
              bytesin = 4;
              /** @type {number} */
              f = 2;
              /** @type {number} */
              offset = 14 - (data[i] >> 4);
            } else {
              if (128 != (data[i] & 128)) {
                /** @type {number} */
                bytesin = 1;
                /** @type {number} */
                f = 2;
              } else {
                if (129 == data[i]) {
                  h = 256 * data[i + 1] + data[i + 2];
                  if (0 < h) {
                    /** @type {number} */
                    getid = 1;
                  } else {
                    /** @type {number} */
                    getid = 0;
                    stopall();
                  }
                  i += 2;
                } else {
                  if (130 == data[i]) {
                    YY_START = 256 * data[i + 1] + data[i + 2];
                    i += 2;
                  } else {
                    if (131 == data[i]) {
                      buff = data[i + 1];
                      /** @type {number} */
                      val = data[i + 1] & 15;
                      if (val != key) {
                        /** @type {number} */
                        key = val;
                        if (node) {
                          node.buffer = buffer[key];
                        }
                      }
                      i++;
                    } else {
                      if (132 == data[i]) {
                        /** @type {number} */
                        len = 0;
                        for (;128 > len;len++) {
                          /** @type {number} */
                          events[e + len] = 0;
                        }
                        e += 128;
                        if (e >= d) {
                          e -= d;
                        }
                        /** @type {number} */
                        val = 0;
                        for (;20 > val;val++) {
                          /** @type {number} */
                          obj[val] = arg[val] = 0;
                        }
                        /** @type {number} */
                        R = 0;
                      } else {
                        if (133 == data[i]) {
                          var paths = 16777216 * (((data[i + 1] & 15) << 16) + (data[i + 2] << 8) + data[i + 3]) + (data[i + 4] << 16) + (data[i + 5] << 8) + data[i + 6];
                          /** @type {number} */
                          len = data[i + 1] >> 4;
                          if (rule.truefreqcallback) {
                            rule.truefreqcallback(paths, len);
                          }
                          i += 6;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (2 == f) {
          /** @type {number} */
          f = 0;
          /** @type {number} */
          val = 16 == (buff & 16) ? 12 : 14;
          for (;128 > f;) {
            /** @type {number} */
            paths = data[i + 3] & 255 | (data[i + 2] & 255) << 8 | (data[i + 1] & 255) << 16 | (data[i + 0] & 255) << 24;
            paths <<= bytesin;
            /** @type {number} */
            len = 0;
            var end;
            /** @type {number} */
            end = 15 - offset;
            var YYSTATE = YY_START;
            /** @type {Array} */
            var dataCopy = [999, 999, 8, 4, 2, 1, 99, 99];
            if (0 != paths) {
              for (;0 == (paths & 2147483648) && len < end;) {
                paths <<= 1;
                len++;
              }
            }
            if (len < end) {
              /** @type {number} */
              end = len;
              len++;
              paths <<= 1;
            } else {
              /** @type {number} */
              end = paths >> 24 & 255;
              len += 8;
              paths <<= 8;
            }
            /** @type {number} */
            var start = 0;
            if (end >= dataCopy[offset]) {
              start++;
            }
            if (end >= dataCopy[offset - 1]) {
              start++;
            }
            if (start > offset - 1) {
              /** @type {number} */
              start = offset - 1;
            }
            /** @type {number} */
            dataCopy = (paths >> 16 & 65535) >> 17 - offset & -1 << start;
            dataCopy += end << offset - 1;
            if (0 != (paths & 1 << 32 - offset + start)) {
              dataCopy |= (1 << start) - 1;
              /** @type {number} */
              dataCopy = ~dataCopy;
            }
            bytesin += len + offset - start;
            for (;8 <= bytesin;) {
              i++;
              bytesin -= 8;
            }
            /** @type {number} */
            len = paths = 0;
            for (;20 > len;len++) {
              paths += obj[len] * arg[len];
            }
            paths |= 0;
            /** @type {number} */
            paths = 0 <= paths ? paths >> 12 : paths + 4095 >> 12;
            /** @type {number} */
            YYSTATE = dataCopy * YYSTATE + YYSTATE / 2;
            /** @type {number} */
            dataCopy = YYSTATE >> 4;
            /** @type {number} */
            len = 19;
            for (;0 <= len;len--) {
              obj[len] += -(obj[len] >> 7) + (arg[len] * dataCopy >> val);
              if (0 == len) {
                break;
              }
              arg[len] = arg[len - 1];
            }
            /** @type {number} */
            arg[0] = paths + YYSTATE;
            len = arg[0] + (R >> 4);
            /** @type {number} */
            R = 16 == (buff & 16) ? 0 : R + (arg[0] << 4 >> 3);
            events[e++] = len;
            if (e >= d) {
              e -= d;
            }
            f++;
          }
          if (0 == bytesin) {
            i--;
          }
        }
      }
      if (t & 2) {
        /** @type {number} */
        i = a;
        for (;i != e;) {
          /** @type {number} */
          events[i] = 0;
          i++;
          if (i >= d) {
            i -= d;
          }
        }
        /** @type {number} */
        events[a] = 32E3;
      }
      if (reader && !t) {
        for (;a != e;) {
          if (1E4 > h || a & 1) {
            reader.setInt16(index, events[a], true);
            index += 2;
            if (index >= size) {
              /** @type {ArrayBuffer} */
              data = new ArrayBuffer(size);
              /** @type {number} */
              index = 0;
              /** @type {DataView} */
              reader = new DataView(data);
              args.push(data);
            }
          }
          a++;
          if (a >= d) {
            a -= d;
          }
        }
      }
    };
    ws.onerror = function(err) {
    };
    /**
     * @return {undefined}
     */
    ws.onopen = function() {
      //soundappletstarted();
		setparam("f="+iFreq+"&band="+iBand+"&lo="+iLo+"&hi="+iHi+"&mode="+iMode+"&name=");
		setparam("mute=0");
		setparam("squelch=0");
		setparam("autonotch=0");
    };
    /**
     * @return {undefined}
     */
    ws.onclose = function() {
      /** @type {number} */
      var e = 0;
      for (;e < d;e++) {
        /** @type {number} */
        events[e] = 0;
      }
      /** @type {null} */
      ws.onclose = callback;
      /** @type {null} */
      ws = ws.onmessage = callback;
    };
    /**
     * @param {string} i
     * @return {undefined}
     */
    setparam = function(i) {
      ws.send("GET /~~param?" + i);
    };
    /**
     * @return {?}
     */
    smeter = function() {
      return 10 * smeter;
    };
    /**
     * @return {?}
     */
    getid = function() {
      return getid;
    };
    /**
     * @return {undefined}
     */
    mute = function() {
      /** @type {boolean} */
      perm = !perm;
    };
    /**
     * @param {number} dataAndEvents
     * @return {undefined}
     */
    setvolume = function(dataAndEvents) {
      /** @type {number} */
      idet = dataAndEvents;
    };
    /**
     * @param {number} v
     * @return {undefined}
     */
    this.setdelay1 = function(v) {
      max = min = v;
      /** @type {number} */
      type = (d + e - min) % d;
    };
    /**
     * @return {undefined}
     */
    stopall = function() {
      if (context) {
        ws.close();
        /** @type {null} */
        data.onaudioprocess = callback;
        data.disconnect();
        /** @type {null} */
        data.destination = callback;
        if (J) {
          /** @type {null} */
          self.onaudioprocess = callback;
          self.disconnect(self);
          /** @type {null} */
          self.destination = callback;
        }
        /** @type {null} */
        console = buffer = this.p = context = node = data = callback;
      } else {
        ws.close();
        /** @type {null} */
        audio = callback;
      }
    };
    /**
     * @return {undefined}
     */
    restartaudio = function() {
      stopall();
      ct = new restartaudio;
      prep_html5sound();
    };
    /**
     * @return {undefined}
     */
    destroy = function() {
      stopall();
      /** @type {null} */
      soundapplet = callback;
    };
    /**
     * @return {undefined}
     */
    rec_start = function() {
      /** @type {number} */
      index = 0;
      /** @type {ArrayBuffer} */
      var data = new ArrayBuffer(size);
      /** @type {DataView} */
      reader = new DataView(data);
      /** @type {Array} */
      args = [data];
    };
    /**
     * @return {?}
     */
    rec_finish = function() {
      args[args.length - 1] = args[args.length - 1].slice(0, index);
      /** @type {null} */
      reader = callback;
      var child = {};
      child.wavdata = args;
      child.len = (args.length - 1) * size + index;
      if (t) {
        child.sr = value;
      } else {
        child.sr = h;
        if (1E4 <= child.sr) {
          child.sr /= 2;
        }
      }
      return child;
    };
    /**
     * @return {?}
     */
    rec_length_kB = function() {
      return((args.length - 1) * size + index) / 1024;
    };
  }
  /** @type {null} */
  var callback = null;
  var restartaudio = AudioContext || window.webkitAudioContext;
  if (restartaudio) {
    if (!ct) {
      ct = new restartaudio;
    }
    var createConvolver;
    try {
      createConvolver = ct.createConvolver;
    } catch (ua) {
    }
    if (!createConvolver) {
      /** @type {null} */
      ct = callback;
      /** @type {boolean} */
      sup_webaudio = false;
    }
  }
  /** @type {number} */
  var t = 0;
  /** @type {number} */
  var d = 32768;
  /**
   * @return {undefined}
   */
  prep_html5sound = function() {
    console.log("You've got one job.");
    soundapplet = new init;
    rec_start();
    setTimeout(function () {
      record_stop();
    }, iDuration);
  };

function record_stop()
{
   var res = rec_finish();

   var wavhead = new ArrayBuffer(44);
   var dv=new DataView(wavhead);
   var i=0;
   var sr=Math.round(res.sr);
   dv.setUint8(i++,82);  dv.setUint8(i++,73); dv.setUint8(i++,70); dv.setUint8(i++,70); // RIFF  (is there really no less verbose way to initialize this thing?)
   dv.setUint32(i,res.len+44,true); i+=4;  // total length; WAV files are little-endian
   dv.setUint8(i++,87);  dv.setUint8(i++,65); dv.setUint8(i++,86); dv.setUint8(i++,69); // WAVE
   dv.setUint8(i++,102);  dv.setUint8(i++,109); dv.setUint8(i++,116); dv.setUint8(i++,32); // fmt
     dv.setUint32(i,16,true);   i+=4;   // length of fmt
     dv.setUint16(i,1,true);    i+=2;   // PCM
     dv.setUint16(i,1,true);    i+=2;   // mono
     dv.setUint32(i,sr,true);   i+=4;   // samplerate
     dv.setUint32(i,2*sr,true); i+=4;   // 2*samplerate
     dv.setUint16(i,2,true);    i+=2;   // bytes per sample
     dv.setUint16(i,16,true);   i+=2;   // bits per sample
   dv.setUint8(i++,100);  dv.setUint8(i++,97); dv.setUint8(i++,116); dv.setUint8(i++,97); // data
     dv.setUint32(i,res.len,true);  // length of data

   var wavdata = res.wavdata;
   wavdata.unshift(wavhead);
   wavdata.forEach(function(entry) {
      wstream.write(toBuffer(entry));
   });
   wstream.end();
   wstream.on('finish', function () {

    var filename = iFilename.split("/").pop(-1);

    spawnSync('sox', [tmpName + '.wav', '−−norm', tmpName + '_norm.wav'], {});
    spawnSync('ffmpeg', ['-i', tmpName + '.wav', '-codec:a', 'libmp3lame', '-qscale:a', '9', iFilename + '.mp3'], {});
    spawnSync('sox', [tmpName + '.wav', '-n', 'spectrogram', '-o', iFilename + '.png', '-c', '"recordara.hetmer.net"', '-t', filename, '-z', '70'], {});

    fs.unlink(tmpName + '.wav');
    fs.unlink(tmpName + '_norm.wav');

    process.exit();

  });
}

function toBuffer(ab) {
    var buf = new Buffer(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}
