const os = require("os");
const ipcR = require("electron").ipcRenderer;
const spawn = require("child_process").spawn;
const Convert = require("ansi-to-html");
import { highlighting } from "./theme_switch.js";

var file_location = null;
var ansi_c = new Convert();
export var target_names = [];

function generate_html_for_data(t_name, t_hash, c_cont) {
    return `<div class="data_container" id="` + t_name + `">
    <ul>
        <li>
            <div class="start_button" id="start.button_` + t_name + `">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="green"
                    class="bi bi-play-fill" viewBox="0 0 16 16">
                    <path
                        d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                </svg>
            </div>
        </li>
        <li>
            <p class="target_name">` + t_name + `<span class="target_hash">` + t_hash + `</span></p>
        </li>
    </ul>
    <div class="code">
        <details>
            <summary>Code</summary>
            <pre class="code-content">` + c_cont + `</pre>
        </details>
    </div>
    <div class="result-window">
    <details>
        <summary>Result</summary>
        <details>
            <summary>STDOUT</summary>
            <pre id="result-content_stdout.` + t_name + `"></pre>
        </details>
        <details>
            <summary>STDERR</summary>
            <pre id="result-content_stderr.` + t_name + `"></pre>
        </details>
        <details>
            <summary>STDIN</summary>
            <pre id="result-content_stdin.` + t_name + `"></pre>
        </details>
</div>
</div>`;
}

document.getElementById("open_file_button").addEventListener("click", function () {
    ipcR.send("open-file-dialog");
});

ipcR.on("selected-file", (event, filePath) => {
    file_location = filePath;
    document.title = "RUNCPP: " + filePath;
    if (file_location !== null) {
        target_names = []; // empty the vector
        document.getElementById("data").innerHTML = `<div style="display: none;" id="search_error_parent"><h2>No target found matching <span style="color: #ff5555;" id="search_error"></span></h2></div>`;
        var runcpp = spawn((os.platform() === "win32" ? "runcpp.exe" : "runcpp"), ["--serialize", file_location, "-o", file_location + ".runcpp.bin", "--print-gui-client"],
            {
                env: process.env,
                cwd: file_location.substring(0, file_location.lastIndexOf(os.platform() === "win32" ? "\\" : "/")),
                shell: false,
                stdio: ["overlapped", "overlapped", "overlapped"]
            }
        );

        var has_error_occur = false;
        var info_panel = document.getElementById("info_panel");
        info_panel.style.setProperty("display", "none");
        info_panel.children[0].innerHTML = null;

        runcpp.stderr.on("data", function (data) {
            has_error_occur = true;

            document.documentElement.style.setProperty("--shadow-info-box", "0px 0px 4px 4px #ff5555");

            info_panel.children[0].innerHTML = ansi_c.toHtml(data.toString()); // sets to pre
            info_panel.style.setProperty("display", "flex");
        });

        runcpp.stdout.on("data", function (data) {

            if (has_error_occur === false) {
                info_panel.style.setProperty("display", "flex");
                document.documentElement.style.setProperty("--shadow-info-box", "0px 0px 4px 4px #55ff55");

                var content_strs = data.toString().split("\n");
                let i = 0;
                for (; content_strs[i].startsWith("Found dependency") === true; i++) {
                    info_panel.children[0].innerHTML += ansi_c.toHtml(content_strs[i] + "\n");
                }
                if (i == 0) {
                    info_panel.style.setProperty("display", "none");
                }

                var data_number = 0;
                for (let j = i; j < content_strs.length - 1; j++) if (content_strs[j].length === 0) data_number++;

                for (let x = 0; x < data_number; x++) {
                    var t_name = "", t_hash = "", c_cont = "";
                    while (content_strs[i].length !== 0) {
                        if (content_strs[i].startsWith("[ ") === true) {
                            c_cont += content_strs[i] + "\n";
                        }
                        else {
                            var name_hash_temp = content_strs[i].split(" ");
                            t_name = name_hash_temp[0];
                            t_hash = name_hash_temp[1];
                        }
                        i++;
                    }
                    c_cont = c_cont.substring(0, c_cont.length - 1); // removes extra new line character from the end
                    document.getElementById("data").innerHTML += generate_html_for_data(t_name, t_hash, c_cont);
                    target_names.push(t_name);
                    i++;
                }

                var start_buttons = document.getElementsByClassName("start_button");

                for (let q = 0; q < start_buttons.length; q++) {
                    start_buttons[q].addEventListener("click", () => {
                        var target_name = start_buttons[q].id.substring(start_buttons[q].id.indexOf("_") + 1, start_buttons[q].id.length);
                        document.getElementById("result-content_stderr." + target_name).innerHTML = ""; // clear content every time button is clicked
                        document.getElementById("result-content_stdout." + target_name).innerHTML = ""; // clear content every time button is clicked
                        document.getElementById("result-content_stdin." + target_name).innerHTML = ""; // clear content every time button is clicked
                        var rc_runner = spawn((os.platform() === "win32" ? "runcpp.exe" : "runcpp"), ["--deserialize", file_location + ".runcpp.bin", target_name],
                            {
                                env: process.env,
                                cwd: file_location.substring(0, file_location.lastIndexOf(os.platform() === "win32" ? "\\" : "/")),
                                shell: false,
                                stdio: ["overlapped", "overlapped", "overlapped"]
                            }
                        );

                        rc_runner.stderr.on("data", function (data) {
                            document.getElementById("result-content_stderr." + target_name).innerHTML += ansi_c.toHtml(data.toString()); // sets to pre
                        });

                        rc_runner.stdout.on("data", function (data) {
                            document.getElementById("result-content_stdout." + target_name).innerHTML += ansi_c.toHtml(data.toString()); // sets to pre
                        });
                    });
                }
                highlighting();
            }
        });
    }
});