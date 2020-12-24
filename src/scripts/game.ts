import "@babylonjs/loaders/glTF";
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader";
import "@babylonjs/core/Helpers/sceneHelpers";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/ArcRotateCamera";
import { CubeTexture } from "@babylonjs/core/Materials/Textures/cubeTexture";
import { AssetsManager, CubeTextureAssetTask } from "@babylonjs/core/Misc/assetsManager";

import { ILoadingScreen } from "@babylonjs/core/Loading";
class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: ArcRotateCamera | undefined;
    private _hdrTexture: CubeTexture | undefined;
    constructor(canvasElement: string) {
        this._canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new Engine(this._canvas, true);
        this._engine.loadingScreen = new MyLoadingScreen();
        this._engine.enableOfflineSupport = false;
        this._scene = new Scene(this._engine);
    }

    init(): void {
        let scope = this;
        //this._scene.clearColor = new Color4(0.0, 0.0, 0.0, 0);
        this._scene.imageProcessingConfiguration.contrast = 1.0;
        this._scene.imageProcessingConfiguration.exposure = 1.0;
        this._scene.imageProcessingConfiguration.toneMappingEnabled = true;

        let assetsManager: AssetsManager = new AssetsManager(this._scene);
        assetsManager.addCubeTextureTask("env", "textures/environment.env");
        assetsManager.addMeshTask("model", "", "models/", "scene.gltf");

        assetsManager.onFinish = () => {
            this.setupScene();
        };

        assetsManager.onTaskSuccessObservable.add((task) => {
            if (task.name == "env") {
                this._hdrTexture = (task as CubeTextureAssetTask).texture;
            }
        });

        assetsManager.onProgress = function (remainingCount, totalCount) {
            var text = "Loading..." + ((100 * (totalCount - remainingCount)) / totalCount).toFixed() + "%";
            (scope._engine.loadingScreen as MyLoadingScreen).loadingUIText = text;
        };
        assetsManager.load();
    }

    setupScene(): void {
        this._scene.environmentTexture = this._hdrTexture;
        this._scene.createDefaultCameraOrLight(true);
        // Create a FreeCamera, and set its position to (x:0, y:5, z:-10).
        this._camera = this._scene.activeCamera as ArcRotateCamera;
        this._camera.useFramingBehavior = true;
        let framingBehavior: any = this._scene.activeCamera.getBehaviorByName("Framing");
        framingBehavior.framingTime = 0;
        framingBehavior.elevationReturnTime = -1;

        if (this._scene.meshes.length) {
            var worldExtends = this._scene.getWorldExtends();
            this._camera.lowerRadiusLimit = null;
            framingBehavior.zoomOnBoundingInfo(worldExtends.min, worldExtends.max);
        }

        this._camera.radius *= 1.5;
        this._camera.alpha += Math.PI;
        this._camera.pinchPrecision = 1000 / this._camera.radius;
        this._camera.upperRadiusLimit = 50 * this._camera.radius;
        this._camera.lowerRadiusLimit = 0.1 * this._camera.radius;
        this._camera.wheelDeltaPercentage = 0.001;
        this._camera.pinchDeltaPercentage = 0.0005;

        // Attach the camera to the canvas.
        this._camera.attachControl(this._canvas, false);

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

class MyLoadingScreen implements ILoadingScreen {
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
