// =====================================================
// TIME-BASED MECHANIC: FOUR-SEASON SKY
// =====================================================
// This p5.js animation changes between spring, summer, autumn and winter.
// AI acknowledgement: ChatGPT helped develop and refine the animation code,
// including seasonal timing, colour blending and moving visual elements.
// The design was adjusted through multiple iterations.
// Note for group integration: this standalone version contains setup() and
// draw(); the final group project should have only one shared setup() and draw().

// Horizontal offset used to animate the large clouds.
let cloudMove = 0;

// Set up a 600 x 700 canvas and use degrees for rotations and sine angles.
function setup() {
  createCanvas(600, 700);
  angleMode(DEGREES);
}

// Update the sky and its moving elements once per frame.
function draw() {
  // sin() makes the large clouds drift left and right by up to 20 pixels.
  cloudMove = sin(frameCount * 0.4) * 20;
  // The remainder (%) repeats the four-season sequence every 1500 frames
  // (approximately 25 seconds when the sketch runs at 60 frames per second).
  let seasonFrame = frameCount % 1500;

  // SPRING: show the blue sky and spring clouds at full opacity.
  if (seasonFrame < 225) {
    drawSpringSky();
    drawSpringClouds(255);

  // SPRING TO SUMMER: gradually fade spring clouds out and the sun in.
  } else if (seasonFrame < 375) {
    let amount = (seasonFrame - 225) / 150;

    drawSkyTransition(
      color(55, 125, 190),
      color(145, 195, 225),
      color(65, 150, 220),
      color(170, 225, 245),
      amount
    );

    // Alpha controls transparency: 255 = visible, 0 = invisible.
    let springAlpha = lerp(255, 0, amount);
    drawSpringClouds(springAlpha);

    let sunAlpha = lerp(0, 255, amount);
    drawMovingSun(seasonFrame, sunAlpha);

    let summerAlpha = lerp(0, 255, amount);
    drawSummerClouds(summerAlpha);

  // SUMMER: brighter blue sky, moving sun and a smaller set of clouds.
  } else if (seasonFrame < 600) {
    drawSummerSky();
    drawMovingSun(seasonFrame, 255);
    drawSummerClouds(255);

  // SUMMER TO AUTUMN: blend blue into orange and fade in falling leaves.
  } else if (seasonFrame < 750) {
    let amount = (seasonFrame - 600) / 150;

    drawSkyTransition(
      color(65, 150, 220),
      color(170, 225, 245),
      color(185, 105, 55),
      color(245, 190, 115),
      amount
    );

    let sunAlpha = lerp(255, 0, amount);
    drawMovingSun(seasonFrame, sunAlpha);

    let summerAlpha = lerp(255, 0, amount);
    drawSummerClouds(summerAlpha);

    let autumnAlpha = lerp(0, 255, amount);
    drawAutumnClouds(autumnAlpha);
    drawAutumnLeaves(autumnAlpha);

  // AUTUMN: warm sky, autumn clouds and rotating falling leaves.
  } else if (seasonFrame < 915) {
    drawAutumnSky();
    drawAutumnClouds(255);
    drawAutumnLeaves(255);

  // AUTUMN TO WINTER: gradually replace leaves with snow.
  } else if (seasonFrame < 1125) {
    let amount = (seasonFrame - 915) / 210;
    // Smoothstep easing slows the colour/opacity changes at both ends.
    let smoothAmount = amount * amount * (3 - 2 * amount);

    drawSkyTransition(
      color(185, 105, 55),
      color(245, 190, 115),
      color(90, 115, 145),
      color(180, 195, 210),
      smoothAmount
    );

    let autumnAlpha = lerp(255, 0, smoothAmount);
    drawAutumnClouds(autumnAlpha);
    drawAutumnLeaves(autumnAlpha);

    let winterAlpha = lerp(0, 255, smoothAmount);
    drawWinterClouds(winterAlpha);
    drawSnow(winterAlpha);

  // WINTER: grey-blue sky, darker clouds and falling snow.
  } else if (seasonFrame < 1290) {
    drawWinterSky();
    drawWinterClouds(255);
    drawSnow(255);

  } else {
    // WINTER TO SPRING: smoothly fade snow out and spring clouds in.
    let amount = (seasonFrame - 1290) / 210;
    // Smoothstep easing slows the colour/opacity changes at both ends.
    let smoothAmount = amount * amount * (3 - 2 * amount);

    drawSkyTransition(
      color(90, 115, 145),
      color(180, 195, 210),
      color(55, 125, 190),
      color(145, 195, 225),
      smoothAmount
    );

    let winterAlpha = lerp(255, 0, smoothAmount);
    drawWinterClouds(winterAlpha);
    drawSnow(winterAlpha);

    let springAlpha = lerp(0, 255, smoothAmount);
    drawSpringClouds(springAlpha);
  }
}


// =====================================================
// GRADIENT SKY
// =====================================================

// Draw a vertical gradient one horizontal line at a time.
// lerpColor() blends from the top colour to the bottom colour.
function drawGradientSky(topColor, bottomColor) {
  for (let y = 0; y < height; y++) {
    let amount = map(y, 0, height, 0, 1);
    let skyColor = lerpColor(topColor, bottomColor, amount);

    stroke(skyColor);
    line(0, y, width, y);
  }
}


// =====================================================
// SKY TRANSITION
// =====================================================

// Blend the old season's top/bottom colours into the new season's colours.
// amount goes from 0 (old season) to 1 (new season).
function drawSkyTransition(
  oldTop,
  oldBottom,
  newTop,
  newBottom,
  amount
) {
  let topColor = lerpColor(oldTop, newTop, amount);
  let bottomColor = lerpColor(oldBottom, newBottom, amount);

  drawGradientSky(topColor, bottomColor);
}


// =====================================================
// SPRING SKY
// Darker spring blue
// =====================================================

// Spring uses a deeper blue at the top and a pale blue at the bottom.
function drawSpringSky() {
  let topColor = color(55, 125, 190);
  let bottomColor = color(145, 195, 225);

  drawGradientSky(topColor, bottomColor);
}


// =====================================================
// SUMMER SKY
// =====================================================

// Summer has lighter, brighter blues than spring.
function drawSummerSky() {
  let topColor = color(65, 150, 220);
  let bottomColor = color(170, 225, 245);

  drawGradientSky(topColor, bottomColor);
}


// =====================================================
// AUTUMN SKY
// =====================================================

// Orange and gold tones suggest an autumn atmosphere.
function drawAutumnSky() {
  let topColor = color(185, 105, 55);
  let bottomColor = color(245, 190, 115);

  drawGradientSky(topColor, bottomColor);
}


// =====================================================
// WINTER SKY
// =====================================================

// Desaturated blue-grey colours create a colder winter atmosphere.
function drawWinterSky() {
  let topColor = color(90, 115, 145);
  let bottomColor = color(180, 195, 210);

  drawGradientSky(topColor, bottomColor);
}


// =====================================================
// MOVING SUN
// =====================================================

// Move the sun across the sky during the spring/summer/autumn part of the cycle.
// Its y-position follows a curved path; layered ellipses add a soft glow.
// sunAlpha fades the sun in and out during seasonal transitions.
function drawMovingSun(seasonFrame, sunAlpha) {
  let sunProgress = map(
    seasonFrame,
    225,
    750,
    0,
    1
  );

  sunProgress = constrain(
    sunProgress,
    0,
    1
  );

  let sunX = lerp(
    60,
    540,
    sunProgress
  );

  let sunY =
    200 -
    sin(sunProgress * 180) * 120;

  noStroke();

  fill(
    255,
    220,
    90,
    sunAlpha * 0.15
  );

  ellipse(
    sunX,
    sunY,
    150,
    150
  );

  fill(
    255,
    220,
    80,
    sunAlpha * 0.30
  );

  ellipse(
    sunX,
    sunY,
    110,
    110
  );

  fill(
    255,
    225,
    90,
    sunAlpha
  );

  ellipse(
    sunX,
    sunY,
    68,
    68
  );
}


// =====================================================
// SPRING CLOUDS
// =====================================================

// Arrange the spring clouds at hand-chosen sizes and positions.
// The seven large clouds use cloudMove; medium and small clouds stay in place.
// alphaValue lets this entire cloud layer fade during transitions.
function drawSpringClouds(alphaValue) {
  let bigCloudColor =
    color(250, 248, 240, alphaValue);

  let bigShadowColor =
    color(210, 225, 235, alphaValue);

  let mediumCloudColor =
    color(250, 248, 240, alphaValue);

  let smallCloudColor =
    color(185, 205, 220, alphaValue);


  drawBigCloud1(
    110 + cloudMove,
    150,
    1.00,
    10,
    bigCloudColor,
    bigShadowColor
  );

  drawBigCloud2(
    130 + cloudMove,
    285,
    0.95,
    8,
    bigCloudColor,
    bigShadowColor
  );

  drawBigCloud3(
    165 + cloudMove,
    440,
    0.82,
    12,
    bigCloudColor,
    bigShadowColor
  );

  drawBigCloud4(
    305 + cloudMove,
    230,
    1.05,
    0,
    bigCloudColor,
    bigShadowColor
  );

  drawBigCloud5(
    485 + cloudMove,
    145,
    1.00,
    -10,
    bigCloudColor,
    bigShadowColor
  );

  drawBigCloud6(
    475 + cloudMove,
    315,
    0.88,
    -8,
    bigCloudColor,
    bigShadowColor
  );

  drawBigCloud7(
    440 + cloudMove,
    470,
    0.80,
    -12,
    bigCloudColor,
    bigShadowColor
  );


  drawMediumCloud(
    250,
    95,
    0.50,
    5,
    mediumCloudColor
  );

  drawMediumCloud(
    325,
    115,
    0.42,
    0,
    mediumCloudColor
  );

  drawMediumCloud(
    515,
    95,
    0.45,
    -5,
    mediumCloudColor
  );

  drawMediumCloud(
    80,
    520,
    0.42,
    8,
    mediumCloudColor
  );

  drawMediumCloud(
    330,
    520,
    0.45,
    -4,
    mediumCloudColor
  );

  drawMediumCloud(
    535,
    380,
    0.40,
    -8,
    mediumCloudColor
  );

  drawMediumCloud(
    190,
    80,
    0.36,
    6,
    mediumCloudColor
  );

  drawMediumCloud(
    390,
    78,
    0.34,
    -4,
    mediumCloudColor
  );

  drawMediumCloud(
    555,
    245,
    0.34,
    -8,
    mediumCloudColor
  );

  drawMediumCloud(
    250,
    575,
    0.36,
    4,
    mediumCloudColor
  );

  drawMediumCloud(
    455,
    560,
    0.34,
    -6,
    mediumCloudColor
  );


  drawSmallCloud(
    85,
    70,
    0.28,
    5,
    smallCloudColor
  );

  drawSmallCloud(
    220,
    60,
    0.24,
    2,
    smallCloudColor
  );

  drawSmallCloud(
    470,
    70,
    0.26,
    -4,
    smallCloudColor
  );

  drawSmallCloud(
    560,
    210,
    0.22,
    -8,
    smallCloudColor
  );

  drawSmallCloud(
    70,
    600,
    0.20,
    5,
    smallCloudColor
  );

  drawSmallCloud(
    145,
    55,
    0.18,
    4,
    smallCloudColor
  );

  drawSmallCloud(
    300,
    55,
    0.16,
    0,
    smallCloudColor
  );

  drawSmallCloud(
    520,
    60,
    0.18,
    -4,
    smallCloudColor
  );

  drawSmallCloud(
    275,
    350,
    0.16,
    3,
    smallCloudColor
  );

  drawSmallCloud(
    90,
    360,
    0.17,
    6,
    smallCloudColor
  );

  drawSmallCloud(
    560,
    430,
    0.18,
    -6,
    smallCloudColor
  );

  drawSmallCloud(
    150,
    610,
    0.16,
    4,
    smallCloudColor
  );

  drawSmallCloud(
    520,
    610,
    0.17,
    -4,
    smallCloudColor
  );
}


// =====================================================
// SUMMER CLOUDS
// =====================================================

// Summer keeps fewer bright clouds so more blue sky is visible.
function drawSummerClouds(alphaValue) {
  let summerCloudColor =
    color(255, 253, 245, alphaValue);

  let summerShadowColor =
    color(215, 235, 245, alphaValue);


  drawBigCloud1(
    120 + cloudMove,
    145,
    0.85,
    5,
    summerCloudColor,
    summerShadowColor
  );

  drawBigCloud5(
    480 + cloudMove,
    260,
    0.75,
    -6,
    summerCloudColor,
    summerShadowColor
  );

  drawMediumCloud(
    330,
    90,
    0.45,
    0,
    summerCloudColor
  );

  drawSmallCloud(
    540,
    90,
    0.25,
    -5,
    summerCloudColor
  );

  drawSmallCloud(
    210,
    500,
    0.22,
    4,
    summerCloudColor
  );
}


// =====================================================
// AUTUMN CLOUDS
// =====================================================

// Warm brown cloud colours support the orange autumn sky.
function drawAutumnClouds(alphaValue) {
  let autumnCloudColor =
    color(225, 190, 160, alphaValue);

  let autumnShadowColor =
    color(190, 145, 125, alphaValue);


  drawBigCloud2(
    120 + cloudMove,
    150,
    0.80,
    7,
    autumnCloudColor,
    autumnShadowColor
  );

  drawBigCloud6(
    470 + cloudMove,
    240,
    0.72,
    -7,
    autumnCloudColor,
    autumnShadowColor
  );

  drawMediumCloud(
    310,
    95,
    0.42,
    0,
    autumnCloudColor
  );

  drawMediumCloud(
    510,
    410,
    0.38,
    -5,
    autumnCloudColor
  );

  drawSmallCloud(
    130,
    450,
    0.22,
    5,
    autumnCloudColor
  );
}


// =====================================================
// AUTUMN LEAVES
// =====================================================

// Animate eight falling leaves with different speeds and starting offsets.
// The modulo (%) makes each leaf reappear above the canvas after falling.
// Sine offsets sway the leaves left and right instead of falling straight down.
function drawAutumnLeaves(alphaValue) {
  let y1 =
    (frameCount * 0.50) % 760 - 30;

  let y2 =
    (frameCount * 0.40 + 160) % 760 - 30;

  let y3 =
    (frameCount * 0.60 + 320) % 760 - 30;

  let y4 =
    (frameCount * 0.35 + 480) % 760 - 30;

  let y5 =
    (frameCount * 0.45 + 600) % 760 - 30;

  let y6 =
    (frameCount * 0.55 + 250) % 760 - 30;

  let y7 =
    (frameCount * 0.375 + 420) % 760 - 30;

  let y8 =
    (frameCount * 0.475 + 80) % 760 - 30;


  let sway1 =
    sin(frameCount * 1.0) * 20;

  let sway2 =
    sin(frameCount * 0.85 + 60) * 25;

  let sway3 =
    sin(frameCount * 1.1 + 120) * 18;

  let sway4 =
    sin(frameCount * 0.75 + 180) * 28;

  let sway5 =
    sin(frameCount * 0.95 + 240) * 22;

  let sway6 =
    sin(frameCount * 0.8 + 300) * 20;

  let sway7 =
    sin(frameCount * 1.05 + 100) * 24;

  let sway8 =
    sin(frameCount * 0.9 + 200) * 18;


  drawLeaf(
    80 + sway1,
    y1,
    14,
    frameCount * 1.0,
    color(190, 75, 35, alphaValue)
  );

  drawLeaf(
    170 + sway2,
    y2,
    12,
    frameCount * 0.75,
    color(220, 120, 35, alphaValue)
  );

  drawLeaf(
    260 + sway3,
    y3,
    15,
    frameCount * 1.1,
    color(165, 65, 35, alphaValue)
  );

  drawLeaf(
    350 + sway4,
    y4,
    13,
    frameCount * 0.85,
    color(235, 145, 45, alphaValue)
  );

  drawLeaf(
    450 + sway5,
    y5,
    14,
    frameCount * 1.05,
    color(185, 80, 30, alphaValue)
  );

  drawLeaf(
    540 + sway6,
    y6,
    12,
    frameCount * 0.9,
    color(225, 110, 35, alphaValue)
  );

  drawLeaf(
    210 + sway7,
    y7,
    11,
    frameCount * 1.15,
    color(200, 90, 30, alphaValue)
  );

  drawLeaf(
    410 + sway8,
    y8,
    13,
    frameCount * 0.8,
    color(235, 155, 55, alphaValue)
  );
}


// =====================================================
// ONE AUTUMN LEAF
// =====================================================

// Draw one leaf at a given position, size, rotation and colour.
// push()/pop() keep this rotation from affecting the rest of the scene.
function drawLeaf(
  x,
  y,
  leafSize,
  leafAngle,
  leafColor
) {
  push();

  translate(x, y);
  rotate(leafAngle);

  noStroke();
  fill(leafColor);

  ellipse(
    0,
    0,
    leafSize,
    leafSize * 0.55
  );

  triangle(
    leafSize * 0.35,
    0,
    leafSize * 0.65,
    -3,
    leafSize * 0.65,
    3
  );

  pop();
}


// =====================================================
// WINTER CLOUDS
// =====================================================

// Winter clouds use cooler grey tones and a denser arrangement.
function drawWinterClouds(alphaValue) {
  let winterCloudColor =
    color(195, 205, 215, alphaValue);

  let winterShadowColor =
    color(150, 165, 180, alphaValue);


  drawBigCloud1(
    90 + cloudMove,
    120,
    1.00,
    5,
    winterCloudColor,
    winterShadowColor
  );

  drawBigCloud2(
    300 + cloudMove,
    170,
    0.95,
    0,
    winterCloudColor,
    winterShadowColor
  );

  drawBigCloud3(
    500 + cloudMove,
    110,
    0.90,
    -6,
    winterCloudColor,
    winterShadowColor
  );

  drawBigCloud6(
    450 + cloudMove,
    330,
    0.80,
    -5,
    winterCloudColor,
    winterShadowColor
  );

  drawMediumCloud(
    150,
    300,
    0.48,
    4,
    winterCloudColor
  );

  drawMediumCloud(
    330,
    420,
    0.42,
    -3,
    winterCloudColor
  );

  drawSmallCloud(
    520,
    500,
    0.25,
    -5,
    winterCloudColor
  );
}


// =====================================================
// SNOW
// =====================================================

// Draw snowflakes at different horizontal positions, falling speeds and sizes.
// alphaValue fades all snowflakes in/out as seasons change.
function drawSnow(alphaValue) {
  noStroke();

  fill(
    255,
    255,
    255,
    alphaValue
  );

  drawSnowflake(
    50,
    (frameCount * 0.60) % 720,
    6
  );

  drawSnowflake(
    110,
    (frameCount * 0.40 + 120) % 720,
    4
  );

  drawSnowflake(
    170,
    (frameCount * 0.50 + 250) % 720,
    5
  );

  drawSnowflake(
    230,
    (frameCount * 0.70 + 60) % 720,
    4
  );

  drawSnowflake(
    290,
    (frameCount * 0.45 + 380) % 720,
    6
  );

  drawSnowflake(
    350,
    (frameCount * 0.55 + 180) % 720,
    5
  );

  drawSnowflake(
    410,
    (frameCount * 0.375 + 470) % 720,
    4
  );

  drawSnowflake(
    470,
    (frameCount * 0.65 + 300) % 720,
    6
  );

  drawSnowflake(
    530,
    (frameCount * 0.425 + 520) % 720,
    5
  );

  drawSnowflake(
    580,
    (frameCount * 0.575 + 90) % 720,
    4
  );

  drawSnowflake(
    80,
    (frameCount * 0.45 + 400) % 720,
    3
  );

  drawSnowflake(
    145,
    (frameCount * 0.625 + 550) % 720,
    4
  );

  drawSnowflake(
    205,
    (frameCount * 0.35 + 330) % 720,
    3
  );

  drawSnowflake(
    320,
    (frameCount * 0.50 + 620) % 720,
    4
  );

  drawSnowflake(
    390,
    (frameCount * 0.65 + 40) % 720,
    3
  );

  drawSnowflake(
    500,
    (frameCount * 0.475 + 200) % 720,
    4
  );

  drawSnowflake(
    555,
    (frameCount * 0.40 + 350) % 720,
    3
  );
}


// =====================================================
// ONE SNOWFLAKE
// =====================================================

// Draw one snowflake and use sin() for a small sideways drift.
function drawSnowflake(
  x,
  y,
  snowSize
) {
  let snowX =
    x +
    sin(frameCount * 0.75 + x) * 8;

  ellipse(
    snowX,
    y,
    snowSize,
    snowSize
  );
}


// =====================================================
// REFERENCE CLOUD A
// =====================================================

// Cloud shape A: overlapping ellipses form the cloud and its shaded underside.
// x/y = position, s = scale, angle = rotation.
function drawReferenceCloudA(
  x,
  y,
  s,
  angle,
  mainColor,
  shadowColor
) {
  push();

  translate(x, y);
  rotate(angle);
  noStroke();

  fill(mainColor);

  ellipse(-92 * s, -2 * s, 88 * s, 34 * s);
  ellipse(-36 * s, -16 * s, 108 * s, 44 * s);
  ellipse(38 * s, -12 * s, 126 * s, 46 * s);
  ellipse(108 * s, -4 * s, 92 * s, 36 * s);
  ellipse(15 * s, 8 * s, 255 * s, 42 * s);

  fill(shadowColor);

  ellipse(-78 * s, 16 * s, 72 * s, 24 * s);
  ellipse(-28 * s, 22 * s, 92 * s, 28 * s);
  ellipse(34 * s, 24 * s, 102 * s, 30 * s);
  ellipse(92 * s, 20 * s, 82 * s, 24 * s);
  ellipse(12 * s, 24 * s, 210 * s, 24 * s);

  pop();
}


// =====================================================
// REFERENCE CLOUD B
// =====================================================

// Cloud shape B: a second cloud silhouette built with ellipses.
function drawReferenceCloudB(
  x,
  y,
  s,
  angle,
  mainColor,
  shadowColor
) {
  push();

  translate(x, y);
  rotate(angle);
  noStroke();

  fill(mainColor);

  ellipse(-100 * s, 0 * s, 80 * s, 30 * s);
  ellipse(-52 * s, -14 * s, 96 * s, 40 * s);
  ellipse(10 * s, -16 * s, 118 * s, 44 * s);
  ellipse(82 * s, -10 * s, 100 * s, 40 * s);
  ellipse(148 * s, -1 * s, 70 * s, 28 * s);
  ellipse(24 * s, 7 * s, 250 * s, 40 * s);

  fill(shadowColor);

  ellipse(-82 * s, 14 * s, 62 * s, 21 * s);
  ellipse(-30 * s, 20 * s, 82 * s, 25 * s);
  ellipse(30 * s, 22 * s, 100 * s, 28 * s);
  ellipse(92 * s, 18 * s, 84 * s, 24 * s);
  ellipse(20 * s, 22 * s, 210 * s, 22 * s);

  pop();
}


// =====================================================
// REFERENCE CLOUD C
// =====================================================

// Cloud shape C: a slimmer cloud silhouette with a shadow layer.
function drawReferenceCloudC(
  x,
  y,
  s,
  angle,
  mainColor,
  shadowColor
) {
  push();

  translate(x, y);
  rotate(angle);
  noStroke();

  fill(mainColor);

  ellipse(-84 * s, 2 * s, 72 * s, 26 * s);
  ellipse(-34 * s, -12 * s, 84 * s, 34 * s);
  ellipse(24 * s, -10 * s, 102 * s, 38 * s);
  ellipse(86 * s, -12 * s, 92 * s, 36 * s);
  ellipse(142 * s, -3 * s, 68 * s, 24 * s);
  ellipse(22 * s, 7 * s, 220 * s, 36 * s);

  fill(shadowColor);

  ellipse(-68 * s, 12 * s, 56 * s, 18 * s);
  ellipse(-20 * s, 17 * s, 72 * s, 22 * s);
  ellipse(36 * s, 19 * s, 88 * s, 24 * s);
  ellipse(88 * s, 16 * s, 70 * s, 20 * s);
  ellipse(18 * s, 18 * s, 180 * s, 18 * s);

  pop();
}


// =====================================================
// BIG CLOUD 1
// =====================================================

// Reuse reference cloud A for the first large cloud.
function drawBigCloud1(
  x,
  y,
  s,
  angle,
  mainColor,
  shadowColor
) {
  drawReferenceCloudA(
    x,
    y,
    s,
    angle,
    mainColor,
    shadowColor
  );
}


// =====================================================
// BIG CLOUD 2
// =====================================================

// Reuse reference cloud B for the second large cloud.
function drawBigCloud2(
  x,
  y,
  s,
  angle,
  mainColor,
  shadowColor
) {
  drawReferenceCloudB(
    x,
    y,
    s,
    angle,
    mainColor,
    shadowColor
  );
}


// =====================================================
// BIG CLOUD 3
// =====================================================

// Reuse reference cloud C for the third large cloud.
function drawBigCloud3(
  x,
  y,
  s,
  angle,
  mainColor,
  shadowColor
) {
  drawReferenceCloudC(
    x,
    y,
    s,
    angle,
    mainColor,
    shadowColor
  );
}


// =====================================================
// BIG CLOUD 4
// =====================================================

// Draw an additional large cloud shape with overlapping ellipses.
function drawBigCloud4(
  x,
  y,
  s,
  angle,
  mainColor,
  shadowColor
) {
  push();

  translate(x, y);
  rotate(angle);
  noStroke();

  fill(mainColor);

  ellipse(-108 * s, -2 * s, 78 * s, 28 * s);
  ellipse(-58 * s, -16 * s, 98 * s, 38 * s);
  ellipse(6 * s, -18 * s, 130 * s, 48 * s);
  ellipse(80 * s, -12 * s, 104 * s, 40 * s);
  ellipse(148 * s, -2 * s, 74 * s, 28 * s);
  ellipse(24 * s, 8 * s, 260 * s, 44 * s);

  fill(shadowColor);

  ellipse(-84 * s, 14 * s, 62 * s, 20 * s);
  ellipse(-30 * s, 19 * s, 82 * s, 24 * s);
  ellipse(34 * s, 21 * s, 104 * s, 28 * s);
  ellipse(98 * s, 18 * s, 84 * s, 24 * s);
  ellipse(18 * s, 21 * s, 220 * s, 22 * s);

  pop();
}


// =====================================================
// BIG CLOUD 5
// =====================================================

// Reuse cloud A with a different position, size and rotation.
function drawBigCloud5(
  x,
  y,
  s,
  angle,
  mainColor,
  shadowColor
) {
  drawReferenceCloudA(
    x,
    y,
    s,
    angle,
    mainColor,
    shadowColor
  );
}


// =====================================================
// BIG CLOUD 6
// =====================================================

// Reuse cloud C with a different position, size and rotation.
function drawBigCloud6(
  x,
  y,
  s,
  angle,
  mainColor,
  shadowColor
) {
  drawReferenceCloudC(
    x,
    y,
    s,
    angle,
    mainColor,
    shadowColor
  );
}


// =====================================================
// BIG CLOUD 7
// =====================================================

// Draw a narrower custom cloud silhouette.
function drawBigCloud7(
  x,
  y,
  s,
  angle,
  mainColor,
  shadowColor
) {
  push();

  translate(x, y);
  rotate(angle);
  noStroke();

  fill(mainColor);

  ellipse(-86 * s, 2 * s, 68 * s, 24 * s);
  ellipse(-36 * s, -10 * s, 82 * s, 30 * s);
  ellipse(18 * s, -8 * s, 96 * s, 34 * s);
  ellipse(74 * s, -12 * s, 86 * s, 32 * s);
  ellipse(130 * s, -2 * s, 64 * s, 22 * s);
  ellipse(18 * s, 6 * s, 208 * s, 34 * s);

  fill(shadowColor);

  ellipse(-64 * s, 10 * s, 48 * s, 16 * s);
  ellipse(-20 * s, 14 * s, 66 * s, 20 * s);
  ellipse(30 * s, 16 * s, 80 * s, 22 * s);
  ellipse(76 * s, 13 * s, 66 * s, 18 * s);
  ellipse(14 * s, 15 * s, 170 * s, 16 * s);

  pop();
}


// =====================================================
// MEDIUM CLOUD
// =====================================================

// Medium cloud: five ellipses grouped into a compact silhouette.
function drawMediumCloud(
  x,
  y,
  s,
  angle,
  cloudColor
) {
  push();

  translate(x, y);
  rotate(angle);
  noStroke();
  fill(cloudColor);

  ellipse(-45 * s, 0 * s, 55 * s, 20 * s);
  ellipse(-15 * s, -10 * s, 60 * s, 24 * s);
  ellipse(20 * s, -8 * s, 70 * s, 26 * s);
  ellipse(55 * s, -2 * s, 55 * s, 20 * s);
  ellipse(5 * s, 5 * s, 130 * s, 24 * s);

  pop();
}


// =====================================================
// SMALL CLOUD
// =====================================================

// Small cloud: four overlapping ellipses.
function drawSmallCloud(
  x,
  y,
  s,
  angle,
  cloudColor
) {
  push();

  translate(x, y);
  rotate(angle);
  noStroke();
  fill(cloudColor);

  ellipse(-24 * s, 0, 40 * s, 14 * s);
  ellipse(0, -6 * s, 34 * s, 16 * s);
  ellipse(24 * s, 0 * s, 38 * s, 14 * s);
  ellipse(0, 3 * s, 68 * s, 14 * s);

  pop();
}
