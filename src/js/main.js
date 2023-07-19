const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { join } = require("path");
const fs = require("fs");
const os = require("os");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
    app.quit();
}

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: join(__dirname, "preload.js"),
            spellcheck: true,
            devTools: false,
            zoomFactor: 1.0
        },
        minHeight: 600,
        minWidth: 800
    });
    mainWindow.maximize();

    // and load the index.html of the app.
    mainWindow.loadFile(join(__dirname, "../index.html"));
    mainWindow.setMenu(null);

    ipcMain.on("open-file-dialog", (event) => {
        dialog.showOpenDialog({
            title: "Open RUNCPP File",
            properties: ["openFile"],
            filters: [
                { name: "RUNCPP Files", extensions: ["*"] }
            ]
        }).then(result => {
            if (!result.canceled && result.filePaths.length > 0) {
                const filePath = result.filePaths[0];
                event.reply("selected-file", filePath);
            }
        }).catch(err => {
            console.error(err);
        });
    });
};

app.on("ready", () => {
    /* CHECK IF RUNCPP CLI EXISTS*/
    if (fs.existsSync(os.platform() === "win32" ? process.cwd() + "/runcpp.exe" : process.cwd() + "/runcpp") === false) {
        dialog.showErrorBox("RUNCPP CLI Not Found", "'" + (os.platform() === "win32" ? process.cwd() + "/runcpp.exe" : process.cwd() + "/runcpp") + "' was not found, try visiting https://github.com/Dark-CodeX/runcpp");
        process.exit(1);
    }
    /* CHECK IF RUNCPP CLI EXISTS*/
    createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
