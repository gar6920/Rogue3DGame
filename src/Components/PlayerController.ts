import * as RE from 'rogue-engine';
import * as THREE from 'three';

export default class PlayerController extends RE.Component {
  @RE.props.num() speed = 5; // Movement speed, adjustable in the editor

  private moveDirection = new THREE.Vector3();
  // Get object's local forward and right directions in the update loop
  private forward = new THREE.Vector3(); 
  private right = new THREE.Vector3(); 

  update() {
    // Get object's current world direction vectors
    this.object3d.getWorldDirection(this.forward);
    // Calculate the right vector based on world up and object's forward
    // Assumes standard world up (0, 1, 0). Adjust if your up-axis is different.
    this.right.crossVectors(new THREE.Vector3(0, 1, 0), this.forward).normalize(); 

    this.moveDirection.set(0, 0, 0); // Reset movement vector each frame

    // --- Keyboard Input --- 
    let inputX = 0;
    let inputZ = 0;

    if (RE.Input.keyboard.getKey("KeyW")) {
      inputZ = 1;
    }
    if (RE.Input.keyboard.getKey("KeyS")) {
      inputZ = -1;
    }
    if (RE.Input.keyboard.getKey("KeyA")) {
      inputX = -1;
    }
    if (RE.Input.keyboard.getKey("KeyD")) {
      inputX = 1;
    }

    // Add movement relative to the object's orientation
    if (inputZ !== 0) {
        this.moveDirection.addScaledVector(this.forward, inputZ);
    }
    if (inputX !== 0) {
        this.moveDirection.addScaledVector(this.right, inputX);
    }

    // --- Apply Movement --- 
    if (this.moveDirection.lengthSq() > 0) { // Check if there is movement input
      this.moveDirection.normalize(); // Ensure consistent speed regardless of direction
      this.object3d.position.addScaledVector(this.moveDirection, this.speed * RE.Runtime.deltaTime);
    }

    // --- Mouse Look --- 
    const mouseDelta = RE.Input.mouse.delta;
    // Only rotate if the mouse has moved and a button (e.g., left) is down
    if (RE.Input.mouse.isLeftButtonDown && (mouseDelta.x !== 0 || mouseDelta.y !== 0)) { 
      // Rotate the character object around the world Y-axis for horizontal look
      this.object3d.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -mouseDelta.x * 0.002);

      // --- Optional: Vertical Look (usually applied to a camera child object) ---
      // If you want vertical look tied directly to this object, you'd rotate around its local X-axis:
      // this.object3d.rotateX(-mouseDelta.y * 0.002);
      // However, it's more common to have a separate camera object parented to the player
      // and apply the vertical rotation (rotateX) to the camera component/object instead,
      // often clamping the rotation to prevent flipping upside down.
    }
  }
}

RE.registerComponent(PlayerController);
