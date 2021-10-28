const Store = require('./store.js');

const store = new Store({
   // We'll call our data file 'user-preferences'
   configName: 'user-preferences',
   defaults: {
      matchIDKey: "",
      savePathKey: "G:/DB/KHLParser/parseKHL.json",
      updateIntervalKey: "5",
   }
});

let matchIDTextField;

window.addEventListener('DOMContentLoaded', () => {
   let updateInterval = document.getElementById('updateInterval');
   let savePath = document.getElementById('savePath');
   matchIDTextField = document.getElementById("matchID");

   matchIDTextField.value = store.get("matchIDKey");
   updateInterval.value = store.get("updateIntervalKey");
   savePath.innerHTML = store.get("savePathKey");


   matchIDTextField.addEventListener('change', function (e) {
      store.set('matchIDKey', e.target.value);
   });
   updateInterval.addEventListener('change', function (e) {
      store.set('updateIntervalKey', e.target.value);
   });

});

module.exports.store = store;