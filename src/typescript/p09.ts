//定義ファイル
/// <reference path="three.d.ts" />
/// <reference path="stats.d.ts" />
/// <reference path="jquery.d.ts" />

class MainApp09 {

    constructor() {

    }


    private update() {

    }

    private render() {

    }

    public animate() {
        requestAnimationFrame((e)=>
                this.animate()
        );
        this.render();
    }
}

window.addEventListener("load", (e) => {
    var main:MainApp09 = new MainApp09();
});
