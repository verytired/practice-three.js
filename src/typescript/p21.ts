/// <reference path="common/BasicView.ts"/>

/**
 * p21
 * Generic Class for three.js
 */
class MainApp21 {

  private view: BasicView

  constructor() {
    this.view = new BasicView();
    this.view.addListener('update', (e) => {
      this.update()
    })
    this.view.setAxis(true);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 100, 30);
    directionalLight.castShadow = true;
    this.view.add(directionalLight);

    var geometry = new THREE.BoxGeometry(40, 40, 40);
    var material = new THREE.MeshPhongMaterial({'color': 0xff0000});
    var cube = new THREE.Mesh(geometry, material);
    this.view.add(cube);

    this.view.animate();
  }

  public update() {
    /*console.log("view Update main");*/
  }
}

window.addEventListener("load", (e) => {
  var main: MainApp21 = new MainApp21();
});
