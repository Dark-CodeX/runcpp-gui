function highlighting() {
    var code_blocks = document.getElementsByClassName("code_content");
    for (let i = 0; i < code_blocks.length; i++) {
        let sub_names = code_blocks[i].textContent.split(" ");
        code_blocks[i].innerHTML = "";
        console.log(sub_names);
        sub_names.forEach((txt) => {
            let span = code_blocks[i].appendChild(document.createElement("span"));
            span.textContent = txt + " ";
            if (txt === "]\n[" || txt === "[" || txt === "]") {
                span.classList.add("bracket");
            }
            else {
                if (txt.at(txt.length - 1) === ",") {
                    span.textContent = "";
                    let word_span = span.appendChild(document.createElement("span"));
                    word_span.textContent = txt.substring(0, txt.length - 1);
                    word_span.classList.add("string");

                    let comma_span = span.appendChild(document.createElement("span"));
                    comma_span.textContent = ", ";
                    comma_span.classList.add("commas");
                } else {
                    span.classList.add("string");
                }
            }
        });
    }
}

highlighting(); // must be called only once

var theme_switcher = document.getElementById("switch_theme");
theme_switcher.addEventListener("click", function () {
    if (document.documentElement.style.getPropertyValue("--bg-color") === "#181818") {
        document.documentElement.style.setProperty("--bg-color", "#ffffff"); // light mode
        document.documentElement.style.setProperty("--txt-color", "#000000");
        document.documentElement.style.setProperty("--bg-sec-color", "#fafafa");
        document.documentElement.style.setProperty("--bg-nav-color", "#f0f0f0");

        document.documentElement.style.setProperty("--string-color", "#f2000d");
        document.documentElement.style.setProperty("--bracket-color", "#0046f5");
        document.documentElement.style.setProperty("--comma-color", "#870004");

        document.documentElement.style.setProperty("--select-color", "rgba(200, 200, 200, 0.7)");

        theme_switcher.innerText = "DARK";
    }
    else {
        document.documentElement.style.setProperty("--bg-color", "#181818"); // dark mode
        document.documentElement.style.setProperty("--txt-color", "#ffffff");
        document.documentElement.style.setProperty("--bg-sec-color", "#202020");
        document.documentElement.style.setProperty("--bg-nav-color", "#303030");

        document.documentElement.style.setProperty("--string-color", "#c3e88d");
        document.documentElement.style.setProperty("--bracket-color", "#ffd333");
        document.documentElement.style.setProperty("--comma-color", "#4c9feb");

        document.documentElement.style.setProperty("--select-color", "rgba(80, 80, 80, 0.7)");

        theme_switcher.innerText = "LIGHT";
    }
});