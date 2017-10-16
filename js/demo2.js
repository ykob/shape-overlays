class ShapeOverlays {
  constructor(elm) {
    this.elm = elm;
    this.path = elm.querySelectorAll('path');
    this.numPoints = 4;
    this.duration = 800;
    this.delayPointsArray = [];
    this.delayPointsMax = 180;
    this.delayPerPath = 70;
    this.timeStart = Date.now();
    this.isOpened = false;
    this.isAnimating = false;
  }
  toggle() {
    this.isAnimating = true;
    const range = Math.random() * Math.PI * 2;
    for (var i = 0; i < this.numPoints; i++) {
      const radian = (i / (this.numPoints - 1)) * Math.PI * 2;
      this.delayPointsArray[i] = (Math.sin(radian + range) + 1) / 2 * this.delayPointsMax;
    }
    if (this.isOpened === false) {
      this.open();
    } else {
      this.close();
    }
  }
  open() {
    this.isOpened = true;
    this.elm.classList.add('is-opened');
    this.timeStart = Date.now();
    this.renderLoop();
  }
  close() {
    this.isOpened = false;
    this.elm.classList.remove('is-opened');
    this.timeStart = Date.now();
    this.renderLoop();
  }
  updatePath(time) {
    const points = [];
    for (var i = 0; i < this.numPoints; i++) {
      points[i] = ease.cubicInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1)) * 100
    }

    let str = '';
    str += (this.isOpened) ? `M 0 0 V ${points[0]} ` : `M 0 ${points[0]} `;
    for (var i = 0; i < this.numPoints - 1; i++) {
      const p = (i + 1) / (this.numPoints - 1) * 100;
      const cp = p - (1 / (this.numPoints - 1) * 100) / 2;
      str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
    }
    str += (this.isOpened) ? `V 0 H 0` : `V 100 H 0`;
    return str;
  }
  render() {
    if (this.isOpened) {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * i)));
      }
    } else {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - i - 1))));
      }
    }
  }
  renderLoop() {
    this.render();
    if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    }
    else {
      this.isAnimating = false;
    }
  }
}

(function() {
  const elmHamburger = document.querySelector('.hamburger');
  const gNavItems = document.querySelectorAll('.global-menu__item');
  const elmOverlay = document.querySelector('.shape-overlays');
  const overlay = new ShapeOverlays(elmOverlay);

  elmHamburger.addEventListener('click', () => {
    if (overlay.isAnimating) {
      return false;
    }
    overlay.toggle();
    if (overlay.isOpened === true) {
      elmHamburger.classList.add('is-opened-navi');
      for (var i = 0; i < gNavItems.length; i++) {
        gNavItems[i].classList.add('is-opened');
      }
    } else {
      elmHamburger.classList.remove('is-opened-navi');
      for (var i = 0; i < gNavItems.length; i++) {
        gNavItems[i].classList.remove('is-opened');
      }
    }
  });
}());
