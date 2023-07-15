const os = require("os");
const ipcR = require("electron").ipcRenderer;
const spawn = require("child_process").spawn;
const Convert = require("ansi-to-html");

var file_location = null;

var open_button = document.getElementById("open_file_button");
open_button.addEventListener("click", function () {
    ipcR.send("open-file-dialog");
});

ipcR.on("selected-file", (event, filePath) => {
    file_location = filePath;
    if (file_location !== null) {
        //  var runcpp = spawn(os.platform() === "win32" ? "runcpp.exe" : "runcpp", ["--serialize", file_location, "-o", file_location + ".runcpp.bin"],
        var runcpp = spawn((os.platform() === "win32" ? "runcpp.exe" : "runcpp"), [],
            {
                env: process.env,
                cwd: file_location.substring(0, file_location.lastIndexOf(os.platform() === "win32" ? "\\" : "/")),
                shell: false,
                stdio: ["overlapped", "overlapped", "overlapped"]
            }
        );

        var ansi_c = new Convert();

        runcpp.stderr.on("data", function (data) {
            var error_panel = document.getElementById("error_panel");
            error_panel.style.setProperty("display", "flex");

            error_panel.children[0].innerHTML = ansi_c.toHtml(data.toString()); // sets to pre
        });

        runcpp.stdout.on("data", function (data) {
            var result_content = document.getElementById("result-content");
            result_content.innerHTML = ansi_c.toHtml(data.toString()); // sets to pre
        });
    }
});