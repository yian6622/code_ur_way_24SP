let t = 0; // A time variable to move the objects along the curves.
let groupColors = []; // Array to store current colors of each group
let targetColors = []; // Array to store target colors for smooth transition

let totalZGroups = 25; // Total number of groups along the z-axis
let objectsPerGroup = 35; // Total number of objects in each group
let detailX; // Slider for detail level

function setup() {
  createCanvas(windowWidth, windowHeight-50, WEBGL);
  detailX = createSlider(3, 24, 10);
  detailX.position(10, height + 5);
  detailX.style('width', '80px');

  // Initialize colors and target colors for each group
  for (let i = 0; i < totalZGroups; i++) {
    groupColors[i] = [random(255), random(255), random(255)];
    targetColors[i] = [random(255), random(255), random(255)];
  }
}

function draw() {
  background(250);
  orbitControl();
  noStroke();

  let zSpacing = 20; // Spacing between groups along the z-axis

  // Loop through each group
  for (let zGroup = 0; zGroup < totalZGroups; zGroup++) {
    let z = (zGroup - totalZGroups / 2) * zSpacing;
    // Smoothly transition the color towards the target color
    for (let c = 0; c < 3; c++) {
      groupColors[zGroup][c] = lerp(groupColors[zGroup][c], targetColors[zGroup][c], 0.01);
      if (abs(groupColors[zGroup][c] - targetColors[zGroup][c]) < 1) {
        // Close enough to target, choose a new target color
        targetColors[zGroup][c] = random(255);
      }
    }

    // Loop through each object in the group
    for (let objIndex = 0; objIndex < objectsPerGroup; objIndex++) {
      let angle = map(objIndex, 0, objectsPerGroup, 0, TWO_PI);
      let x = cos(angle) * 200;
      let y = sin(angle) * 200;
      let timeAdjustedX = x + cos(t + zGroup) * 50;
      let timeAdjustedY = y + sin(t + zGroup) * 50;

      push();
      translate(timeAdjustedX, timeAdjustedY, z);
      fill(groupColors[zGroup]); // Apply interpolated color
      // Choose shape based on object index for variety
      if (objIndex % 5 === 0) torus(10, 5, detailX.value(), 8);
      else if (objIndex % 5 === 1) sphere(10, detailX.value(), 8);
      else if (objIndex % 5 === 2) cone(10, 20, detailX.value(), 8);
      else if (objIndex % 5 === 3) box(15, 15, 15);
      else if (objIndex % 5 === 4) ellipsoid(10, 15, 20, detailX.value(), 8);
      pop();
    }
  }

  t += 0.01; // Update time variable
}
