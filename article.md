# Gooey Overlay

This time we will show you how to implement a unique screen effect that can not be expressed with CSS alone, using SVG and curves. Drawing a curved line It animates each control coordinates of path elements and creates a rectangle (overlay) that have a gooey motion. We use well-known easing function for this animation. Various apparent overlays can be created by devising the number of control points of the curve, speed, delay value, easing function, and so on, You can make UI more impressive by using this as an interaction on a web page such as screen transition.

## HTML / CSS of SVG

The basic HTML and CSS used for this production are as follows. For match the size of `path` elements to the size of `svg` element, set the `preserveAspectRatio` attribute to `svg` element and set its value to `none`.

    <svg class="gooey-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path class="gooey-overlay__path"></path>
      <path class="gooey-overlay__path"></path>
      <path class="gooey-overlay__path"></path>
    </svg>

Also, specify the CSS for `svg` element as follows and make `svg` element itself match the size of the browser window.

    .gooey-overlay {
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0; left: 0;
    }

`path` elements corresponds to each layer of the overlay. Specify each color with CSS. The last `path` element corresponds to the background color after the overlay expansion.  

    .gooey-overlay path:nth-of-type(1) { fill: #c4dbea; }
    .gooey-overlay path:nth-of-type(2) { fill: #4c688b; }
    .gooey-overlay path:nth-of-type(3) { fill: #2e496a; }

## JavaScript GooeyOverlay class

We are creating overlay control classes for this demonstration. The properties of this class are as follows. With these properties you can decide the number of control points, animation length, maximum delay, etc. You can change the appearance of the overlay variously by changing each properties.

    class GooeyOverlay {
      constructor(elm) {
        this.elm = elm; // Parent SVG element.
        this.path = elm.querySelectorAll('path'); // Path elements in parent SVG. These are layers of Overlay.
        this.numPoints = 18; // Number of Control points for Bezier Curve.
        this.duration = 600; // Animation duration of one path element.
        this.delayPointsArray = []; //
        this.delayPointsMax = 300; // Max of delay value in all control points.
        this.delayPerPath = 60; // Delay value per pass.
        this.timeStart = Date.now();
        this.isOpened = false;
      }
      ...
    }
    const elmOverlay = document.querySelector('.gooey-overlay');
    const overlay = new GooeyOverlay(elmOverlay);

Further elements that determine the appearance of the overlay are `GooeyOverlay.toggle()` method and `GooeyOverlay.updatePath()` method.

`GooeyOverlay.toggle()` method has the function of opening and closing the overlay, but at the same time it also has the role of setting the delay value of each control point each time it opens and closes. It is not necessary to set the delay value every time, but by giving a little change every time, it will produce sharpness in the production.  

`GooeyOverlay.updatePath()` method is executed by `requestAnimationFrame` every frame from when the animation starts until it ends. A value from 0 to 1 is input to the argument `time`, and by using it as an easing function, animation for each control point is controlled. You can set the calculation method of this part arbitrarily.

In demo 1, the same easing function is used for all control points, and the delay value is set like a fine wave using trigonometric functions, so that the screen is "melted" appearance.

    toggle() {
      const range = 4 * Math.random() + 6;
      for (var i = 0; i < this.numPoints; i++) {
        const radian = i / (this.numPoints - 1) * Math.PI;
        this.delayPointsArray[i] = (Math.sin(-radian) + Math.sin(-radian * range) + 2) / 4 * this.delayPointsMax;
      }
      ...
    }

    updatePath(time) {
      const points = [];
      for (var i = 0; i < this.numPoints; i++) {
        points[i] = ease.cubicInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1)) * 100
      }
      ...
    }

In the demo created this time, we use overlay as the background of full screen global menu which opens and closes with hamburger buttons, but it can also be used for page transition and scroll effect, for example. Such a production will make the user's experience more enjoyable and will make the impression that the web design gives users more strongly.

## Credits

- [glsl-easings](https://github.com/glslify/glsl-easings) by glslify. Easing functions that use to demos are based on the code of glsl-easing module.
