const canvas = document.getElementById("babcanv");
const engine = new BABYLON.Engine(canvas, true);
var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;
    scene.enablePhysics(new BABYLON.Vector3(0,-9.81, 0), new BABYLON.AmmoJSPlugin);
    
    // var camera = new BABYLON.ArcRotateCamera("Camera", 0, 10, 30, new BABYLON.Vector3(0, 0, 0), scene);
    // camera.setPosition(new BABYLON.Vector3(0, 20, -30));
    // camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 30, height: 30}, scene);
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.MeshImpostor, {mass:0, restitution:0.3}, scene);
    var wallz = [15, 0, 0, -15];
    var wallrot = [0, 1, 1, 0];
    var wallx = [null, -15, 15, null];
    for (i=0;i<4;i++) {
        var wall = BABYLON.MeshBuilder.CreatePlane("wall", {width:30, height:2}, scene);
        wall.physicsImpostor = new BABYLON.PhysicsImpostor(wall, BABYLON.PhysicsImpostor.MeshImpostor, {mass:0, restitution: 0.9}, scene);
        wall.position.y = 1;
        wall.position.z = wallz[i];
        if (wallrot[i] == 1) {
            wall.rotate(new BABYLON.Vector3(0, 1, 0), Math.PI/2, BABYLON.Space.LOCAL);
        }
        if  (!(wallx[i] == null)) {
            wall.position.x = wallx[i];
        }
    }

    mazerunner = BABYLON.MeshBuilder.CreateBox("mazerunner", {height:3, width:3, depth:3}, scene);
    mazerunner.position.y = 2;
    mazerunner.physicsImpostor = new BABYLON.PhysicsImpostor(mazerunner, BABYLON.PhysicsImpostor.BoxImpostor, {mass:1, restitution:0.3}, scene);
    var greenmat = new BABYLON.StandardMaterial("greenmat", scene);
    greenmat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    mazerunner.material = greenmat;

    var camera = new BABYLON.FollowCamera("Camera", new BABYLON.Vector3(0, 5, -10));
    camera.attachControl(canvas, true);
    camera.parent = mazerunner;

    fronttarg = BABYLON.Mesh.CreateBox("fronttarg", 1, scene);
    fronttarg.position.z = 3;
    fronttarg.visibility = 0;
    fronttarg.parent = mazerunner;

    lefttarg = BABYLON.Mesh.CreateBox("lefttarg", 1, scene);
    lefttarg.position.x = -3;
    lefttarg.visibility = 0;
    lefttarg.parent = mazerunner;

    righttarg = BABYLON.Mesh.CreateBox("rightarg", 1, scene);
    righttarg.position.x = 3;
    righttarg.visibility = 0;
    righttarg.parent = mazerunner;

    backtarg = BABYLON.Mesh.CreateBox("backtarg", 1, scene);
    backtarg.position.z = -3;
    backtarg.visibility = 0;
    backtarg.parent = mazerunner;
    return scene;
};

window.onkeydown = function(event) {
    if (event.keyCode == "87") {
        mazerunner.physicsImpostor.applyImpulse(fronttarg.getAbsolutePosition().subtract(mazerunner.getAbsolutePosition()).scale(0.1), mazerunner.getAbsolutePosition());
    }
    if (event.keyCode == "65") {
        mazerunner.physicsImpostor.applyImpulse(lefttarg.getAbsolutePosition().subtract(mazerunner.getAbsolutePosition()).scale(0.1), mazerunner.getAbsolutePosition());
    }
    if (event.keyCode == "83") {
        mazerunner.physicsImpostor.applyImpulse(backtarg.getAbsolutePosition().subtract(mazerunner.getAbsolutePosition()).scale(0.1), mazerunner.getAbsolutePosition());
    }
    if (event.keyCode == "68") {
        mazerunner.physicsImpostor.applyImpulse(righttarg.getAbsolutePosition().subtract(mazerunner.getAbsolutePosition()).scale(0.1), mazerunner.getAbsolutePosition());
    }
    if (event.keyCode == "32") {
        var bullet = BABYLON.MeshBuilder.CreateSphere("bullet", {diameter:1, segments:32}, scene);
        bullet.parent = mazerunner;
        bullet.position.z = 1;
        mazerunner.removeChild(bullet);
        bullet.physicsImpostor = new BABYLON.PhysicsImpostor(bullet, BABYLON.PhysicsImpostor.SphereImpostor, {mass:1, restitution:0.3}, scene);
        bullet.physicsImpostor.applyImpulse(fronttarg.getAbsolutePosition().subtract(bullet.getAbsolutePosition()).scale(10), bullet.getAbsolutePosition());
    }
}

const scene = createScene();

engine.runRenderLoop(function () {
  scene.render();
});

window.addEventListener("resize", function () {
  engine.resize();
});
