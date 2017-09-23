class GooeyOverlay {
  constructor(elm) {
    this.elm = elm;
    this.path = [
      elm.querySelector('.js-path-01'),
      elm.querySelector('.js-path-02'),
      elm.querySelector('.js-path-03'),
    ];
    this.numPoints = 18;
    this.duration = 600;
    this.delayPointsArray = [];
    this.delayPoints = 240;
    this.delayPerPath = 60;
    this.timeStart = Date.now();
    this.isOpened = false;
  }
  toggle() {
    for (var i = 0; i < this.numPoints + 1; i++) {
      this.delayPointsArray[i] = Math.random() * this.delayPoints;
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
  updatePathOpen(time) {
    const points = [];
    for (var i = 0; i < this.numPoints + 1; i++) {
      points[i] = ease.quadraticInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1)) * 100
    }

    let str = `M 0 0 V ${points[0]} `;
    for (var i = 0; i < this.numPoints; i++) {
      const p = (i + 1) / this.numPoints * 100;
      const cp = p - (1 / this.numPoints * 100) / 2;
      str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
    }
    str += `V 0 H 0`;
    return str;
  }
  updatePathClose(time) {
    const points = [];
    for (var i = 0; i < this.numPoints + 1; i++) {
      points[i] = ease.quadraticInOut(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1)) * 100
    }

    let str = `M 0 ${points[0]} `;
    for (var i = 0; i < this.numPoints; i++) {
      const p = (i + 1) / this.numPoints * 100;
      const cp = p - (1 / this.numPoints * 100) / 2;
      str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
    }
    str += `V 100 H 0`;
    return str;
  }
  render() {
    if (this.isOpened) {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute('d', this.updatePathOpen(Date.now() - (this.timeStart + this.delayPerPath * i)));
      }
    } else {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute('d', this.updatePathClose(Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - i - 1))));
      }
    }
  }
  renderLoop() {
    this.render();
    if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPoints) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    }
  }
}

(function() {
  const elmHamburger = document.querySelector('.hamburger');
  const elmOverlay = document.querySelector('.gooey-overlay');
  const overlay = new GooeyOverlay(elmOverlay);

  elmHamburger.addEventListener('click', () => {
    overlay.toggle();
    if (overlay.isOpened === true) {
      elmHamburger.classList.add('is-opened-navi');
    } else {
      elmHamburger.classList.remove('is-opened-navi');
    }
  });
}());
