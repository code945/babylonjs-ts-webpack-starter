import * as BABYLON from '@babylonjs/core'
import '@babylonjs/loaders';

class Game {
  private _canvas: HTMLCanvasElement;
  private _engine: BABYLON.Engine;
  private _scene: BABYLON.Scene;
  private _camera: BABYLON.ArcRotateCamera;
  private _light: BABYLON.Light;  
  private _hdrTexture:BABYLON.CubeTexture; 
  constructor(canvasElement : string) {
      // Create canvas and engine.
      this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
      this._engine = new BABYLON.Engine(this._canvas, true);
      //Set the loading screen in the engine to replace the default one
      this._engine.loadingScreen = new MyLoadingScreen();
      this._engine.enableOfflineSupport = false;
  }

  init() : void {
      // Create a basic BJS Scene object.
      let scope = this;
      this._scene = new BABYLON.Scene(this._engine);
      this._scene.clearColor = new BABYLON.Color4(0.0, 0.0, 0.0, 0);
      this._scene.imageProcessingConfiguration.contrast = 1.6;
      this._scene.imageProcessingConfiguration.exposure = 0.6;
      this._scene.imageProcessingConfiguration.toneMappingEnabled = true;

      this._hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("assets/textures/environment.dds", this._scene);
      this._hdrTexture.gammaSpace = false; 


      let assetsManager:BABYLON.AssetsManager = new BABYLON.AssetsManager(this._scene);
      assetsManager.addMeshTask("model", "", "assets/models/", "scene.gltf");  
      assetsManager.onFinish = function (tasks) { 
        scope.setupScene();
      };
  
      assetsManager.onTaskSuccessObservable.add(function (task) { 
           
      });
  
      assetsManager.onProgress = function (remainingCount, totalCount, lastFinishedTask) {
          var text = "Loading..." + (100 * (totalCount - remainingCount) / totalCount).toFixed() +"%";
          (scope._engine.loadingScreen as MyLoadingScreen).loadingUIText = text;
      };
      assetsManager.load();   
  }

  setupScene():void{
    this._scene.createDefaultCameraOrLight(true); 
    // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
    this._camera = this._scene.activeCamera as BABYLON.ArcRotateCamera;  
    this._camera.useFramingBehavior = true;
    let framingBehavior:any =  this._scene.activeCamera.getBehaviorByName("Framing");
    framingBehavior.framingTime = 0;
    framingBehavior.elevationReturnTime = -1;

    if ( this._scene.meshes.length) {
        var worldExtends =  this._scene.getWorldExtends();
        this._camera.lowerRadiusLimit = null;
        framingBehavior.zoomOnBoundingInfo(worldExtends.min, worldExtends.max);
    } 

    this._camera.radius *= 1.5 
    this._camera.alpha += Math.PI; 
    this._camera.pinchPrecision = 1000 / this._camera.radius;
    this._camera.upperRadiusLimit =50 * this._camera.radius;
    this._camera.lowerRadiusLimit = 0.1 * this._camera.radius; 
    this._camera.wheelDeltaPercentage = 0.001;
    this._camera.pinchDeltaPercentage = 0.0005;   
 
    // Attach the camera to the canvas.
    this._camera.attachControl(this._canvas, false);

    let currentSkybox:any = this._scene.createDefaultSkybox(this._hdrTexture, true, (this._scene.activeCamera.maxZ - this._scene.activeCamera.minZ) / 2, 0.3);
    
    this.doRender();
    
  }

  doRender() : void {
      // Run the render loop.
      this._engine.runRenderLoop(() => {
          this._scene.render();
      });

      // The canvas/window resize event handler.
      window.addEventListener('resize', () => {
          this._engine.resize();
      });
  }
} 

class MyLoadingScreen implements BABYLON.ILoadingScreen{
  private _text:string;
  public loadingUIText:string;
  public loadingUIBackgroundColor:any;
  constructor(){ 
    this.loadingUIText = "Loading...";
  }

  displayLoadingUI(){
      document.querySelector(".loadingText").innerHTML = this.loadingUIText;
  };

  hideLoadingUI() {
     
  };
} 


export default Game;