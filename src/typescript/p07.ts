/// <reference path="three.d.ts" />
/// <reference path="jquery.d.ts" />

class MainApp {
    constructor(){
        console.log("main app constructor")
    }
}

window.addEventListener("load", (e) => {
    console.log("loaded");
    var main:MainApp = new MainApp();
//    main.init()
});
