const ipcR = require("electron").ipcRenderer;
const FitAddon = require("xterm-addon-fit");
const { Terminal } = require("xterm");

let term = new Terminal();
const fitAddon = new FitAddon.FitAddon();

term.loadAddon(fitAddon);

term.open(document.getElementById('terminal-content'));
fitAddon.fit();
term.onData(e => {
    ipcR.send("terminal.toTerm", e);
});

ipcR.on("terminal.incData", function (event, data) {
    term.write(data);
});
