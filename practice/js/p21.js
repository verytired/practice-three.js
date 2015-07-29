var MainApp21 = (function () {
    function MainApp21() {
        var _this = this;
        this.view = new BasicView();
        this.view.addListener('update', function (e) {
            _this.update();
        });
        this.view.setAxis(true);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(0, 100, 30);
        directionalLight.castShadow = true;
        this.view.add(directionalLight);
        var geometry = new THREE.BoxGeometry(40, 40, 40);
        var material = new THREE.MeshPhongMaterial({ 'color': 0xff0000 });
        var cube = new THREE.Mesh(geometry, material);
        this.view.add(cube);
        this.view.animate();
    }
    MainApp21.prototype.update = function () {
    };
    return MainApp21;
})();
window.addEventListener("load", function (e) {
    var main = new MainApp21();
});
