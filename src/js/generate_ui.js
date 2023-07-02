const fs = require("fs");
const ipcR = require("electron").ipcRenderer;

var file_location = null;

var open_button = document.getElementById("open_file_button");
open_button.addEventListener("click", function () {
    ipcR.send('open-file-dialog');
});

ipcR.on('selected-file', (event, filePath) => {
    file_location = filePath;
});
