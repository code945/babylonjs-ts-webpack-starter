import "pepjs";
import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders";
import { AbstractMesh } from "@babylonjs/core";

class Game {
  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.VirtualJoysticksCamera;
  private _light: BABYLON.Light;
  private _hdrTexture: BABYLON.CubeTexture;
  constructor(canvasElement: string) {
    // Create canvas and engine.
    this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
    this._engine = new BABYLON.Engine(this._canvas, true);
    //Set the loading screen in the engine to replace the default one
    this._engine.loadingScreen = new MyLoadingScreen();
    this._engine.enableOfflineSupport = false;
  }

  init(): void {
    // Create a basic BJS Scene object.
    let scope = this;
    this._scene = new BABYLON.Scene(this._engine);
    this._scene.clearColor = new BABYLON.Color4(0.0, 0.0, 0.0, 0);
    this._scene.imageProcessingConfiguration.contrast = 1.6;
    this._scene.imageProcessingConfiguration.exposure = 0.6;
    this._scene.imageProcessingConfiguration.toneMappingEnabled = true;

    this._hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
      "assets/textures/environment.env",
      this._scene
    );
    this._hdrTexture.gammaSpace = false;

    let assetsManager: BABYLON.AssetsManager = new BABYLON.AssetsManager(
      this._scene
    );
    assetsManager.addMeshTask("model", "", "assets/models/", "model.gltf");
    assetsManager.onFinish = function (tasks) {
      scope.setupScene();
      (document.querySelector(".loadingContainer") as HTMLElement).style.display = "none"
    };

    assetsManager.onTaskSuccessObservable.add(function (task) {});

    assetsManager.onProgress = function (
      remainingCount,
      totalCount,
      lastFinishedTask
    ) {
      var text =
        "Loading..." +
        ((100 * (totalCount - remainingCount)) / totalCount).toFixed() +
        "%";
      (scope._engine.loadingScreen as MyLoadingScreen).loadingUIText = text;
    };
    assetsManager.load();
  }

  setupScene(): void {
    

    var VJC = new BABYLON.VirtualJoysticksCamera(
      "VJC",
      new BABYLON.Vector3(-12, 2.007949602593635, -1),
      this._scene
    );
    VJC.setTarget(new BABYLON.Vector3(0.1, 1, -0.1))
    VJC.minZ = 0.1;
    VJC.speed = 0.1;
    VJC.angularSensibility = 500;
    VJC.ellipsoid = new BABYLON.Vector3(1, 1,1);
    VJC.checkCollisions = true;
    VJC.applyGravity = true; 

    this._scene.activeCamera = VJC;
    this._scene.activeCamera.attachControl(this._canvas); 

    (VJC.inputs.attached["virtualJoystick"] as BABYLON.FreeCameraVirtualJoystickInput).getRightJoystick().setJoystickSensibility(0.01); 

    this._scene.environmentTexture = this._hdrTexture;
    var pbr = new BABYLON.PBRMetallicRoughnessMaterial("pbr", this._scene);
    pbr.baseColor = BABYLON.Color3.FromHexString("#444444");
    pbr.metallic = 0.15;
    pbr.roughness = 0.1;
    pbr.alpha = 0.3;
    pbr.environmentTexture = this._hdrTexture;
    pbr.backFaceCulling = false;
    (this._scene.getMeshByID("Object003") as AbstractMesh).material = pbr;

    this._scene.gravity = new BABYLON.Vector3(0, -9.81, 0); 
    this._scene.collisionsEnabled = true;  
    this._scene.getMeshByID("Plane003").checkCollisions = true;
    this._scene.getMeshByID("Object004").checkCollisions = true;
    this._scene.getMeshByID("Object007").checkCollisions = true;
    this._scene.getMeshByID("Object008").checkCollisions = true;
    this.doRender();
  }

  doRender(): void {
    // Run the render loop.
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });

    // The canvas/window resize event handler.
    window.addEventListener("resize", () => {
      this._engine.resize();
    });
  }
}

class MyLoadingScreen implements BABYLON.ILoadingScreen {
  private _text: string;
  public loadingUIText: string;
  public loadingUIBackgroundColor: any;
  constructor() {
    this.loadingUIText = "Loading...";
  }

  displayLoadingUI() {
    document.querySelector(".loadingText").innerHTML = this.loadingUIText;
  }

  hideLoadingUI() {}
}

export default Game;
