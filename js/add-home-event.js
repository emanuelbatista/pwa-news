var deferredPrompt;
var installBotton = document.getElementById('install-botton');
var btnFullScreen = document.getElementById('btn-fullscreen');

window.addEventListener('beforeinstallprompt', function (e) {
  console.log('beforeinstallprompt Event fired');
  e.preventDefault();

  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  installBotton.style.display = "inline-block";

  return false;
});

installBotton.addEventListener('click', function (e) {
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function (choiceResult) {

      console.log(choiceResult.outcome);

      if (choiceResult.outcome == 'dismissed') {
        console.log('User cancelled home screen install');
      }
      else {
        console.log('User added to home screen');
      }
      installBotton.style.display = 'none';
      deferredPrompt = null;
    });
  }
});

(function () {
  var batteryPromise;
  if ('getBattery' in navigator) {
    batteryPromise = navigator.getBattery();
  } else if ('battery' in navigator) {
    batteryPromise = Promise.resolve(navigator.battery);
  } else {
    return;
  }

  batteryPromise.then(function (battery) {
    var baterryElement = document.getElementsByClassName('native-resources-container')[0].children[0];
    checkBattery();
    battery.addEventListener('levelchange', function () {
      checkBattery();
    });

    function checkBattery(){
      if (battery.level <= 0.1) {
        baterryElement.classList.remove('oi-battery-full');
        baterryElement.classList.add('oi-battery-empty');
      } else {
        baterryElement.classList.remove('oi-battery-empty');
        baterryElement.classList.add('oi-battery-full');
      }
    }
  });
}());

var networkElement = document.getElementsByClassName('native-resources-container')[0].children[1];
if(navigator.onLine){
  networkElement.classList.add('oi-signal');
  networkElement.classList.remove('oi-minus');
} else {
  networkElement.classList.remove('oi-signal');
  networkElement.classList.add('oi-minus');
}

window.addEventListener('online', function(){
  networkElement.classList.add('oi-signal');
  networkElement.classList.remove('oi-minus');
});

window.addEventListener('offline', function(){
  networkElement.classList.remove('oi-signal');
  networkElement.classList.add('oi-minus');
});


document.addEventListener("DOMContentLoaded", function() {
  
});
