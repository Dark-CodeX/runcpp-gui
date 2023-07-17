import { target_names } from "./generate_ui.js";

var search_box = document.getElementById("search_box");

search_box.addEventListener("input", (e) => {
    if (search_box.value.length === 0) {
        if (document.getElementById("search_error_parent") !== null) {
            document.getElementById("search_error_parent").style.setProperty("display", "none");
            document.getElementById("search_error").innerText = "";
        }
        for (let i = 0; i < target_names.length; i++) {
            if (document.getElementById(target_names[i]).style.getPropertyValue("display") === "none") {
                document.getElementById(target_names[i]).style.setProperty("display", "block");
            }
        }
    } else {
        let hidden_count = 0;
        if (e.data === null) {
            // got backspaces
            let x = 0;
            for (let i = 0; i < target_names.length; i++) {
                if (document.getElementById(target_names[i]).style.getPropertyValue("display") === "none") {
                    document.getElementById(target_names[i]).style.setProperty("display", "block");
                    x++;
                }
            }
            if (x !== 0) {
                if (document.getElementById("search_error_parent") !== null) {
                    document.getElementById("search_error_parent").style.setProperty("display", "none");
                    document.getElementById("search_error").innerText = "";
                }
            }
        }
        for (let i = 0; i < target_names.length; i++) {
            if (target_names[i].search(search_box.value) === -1) {
                document.getElementById(target_names[i]).style.setProperty("display", "none");
                hidden_count++;
            }
        }

        if (hidden_count === target_names.length) {
            // every target is hidden now, no match found
            if (document.getElementById("search_error_parent") !== null) {
                document.getElementById("search_error_parent").style.setProperty("display", "inline-block");
                document.getElementById("search_error").innerText = search_box.value;
            }
        }
    }
});