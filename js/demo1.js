class GooeyOverlay {
  constructor(elm) {
    this.path1 = elm.querySelector('.js-path-01');
    this.path2 = elm.querySelector('.js-path-02');
    this.duration = 500;
    this.delay = 200;
    this.timeStart = Date.now();
    this.isOpened = false;
  }
  toggle() {
    if (this.isOpened === false) {
      this.open();
    } else {
      this.close();
    }
  }
  open() {
    this.isOpened = true;
    this.timeStart = Date.now();
    this.renderLoop();
  }
  close() {
    this.isOpened = false;
    this.timeStart = Date.now();
    this.renderLoop();
  }
  updatePathOpen(time) {
    const p = [
      ease.cubicInOut(Math.min(Math.max(time - 100, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 200, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 0, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 50, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 200, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 300, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 250, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 200, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 150, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 250, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 100, 0) / this.duration, 1)) * 100,
    ];
    return `
      M  0 0
      V ${p[0]}
      C  5 ${p[0]}  5 ${p[1]} 10 ${p[1]}
      C 15 ${p[1]} 15 ${p[2]} 20 ${p[2]}
      C 25 ${p[2]} 25 ${p[3]} 30 ${p[3]}
      C 35 ${p[3]} 35 ${p[4]} 40 ${p[4]}
      C 45 ${p[4]} 45 ${p[5]} 50 ${p[5]}
      C 55 ${p[5]} 55 ${p[6]} 60 ${p[6]}
      C 65 ${p[6]} 65 ${p[7]} 70 ${p[7]}
      C 75 ${p[7]} 75 ${p[8]} 80 ${p[8]}
      C 85 ${p[8]} 85 ${p[9]} 90 ${p[9]}
      C 95 ${p[9]} 95 ${p[10]} 100 ${p[10]}
      V 0
      H 0
    `;
  }
  updatePathClose(time) {
    const p = [
      ease.cubicInOut(Math.min(Math.max(time - 100, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 200, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 0, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 50, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 200, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 300, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 250, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 200, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 150, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 250, 0) / this.duration, 1)) * 100,
      ease.cubicInOut(Math.min(Math.max(time - 100, 0) / this.duration, 1)) * 100,
    ];
    return `
      M  0 ${p[0]}
      C  5 ${p[0]}  5 ${p[1]} 10 ${p[1]}
      C 15 ${p[1]} 15 ${p[2]} 20 ${p[2]}
      C 25 ${p[2]} 25 ${p[3]} 30 ${p[3]}
      C 35 ${p[3]} 35 ${p[4]} 40 ${p[4]}
      C 45 ${p[4]} 45 ${p[5]} 50 ${p[5]}
      C 55 ${p[5]} 55 ${p[6]} 60 ${p[6]}
      C 65 ${p[6]} 65 ${p[7]} 70 ${p[7]}
      C 75 ${p[7]} 75 ${p[8]} 80 ${p[8]}
      C 85 ${p[8]} 85 ${p[9]} 90 ${p[9]}
      C 95 ${p[9]} 95 ${p[10]} 100 ${p[10]}
      V 100
      H 0
    `;
  }
  render() {
    if (this.isOpened) {
      this.path1.setAttribute('d', this.updatePathOpen(Date.now() - this.timeStart));
      this.path2.setAttribute('d', this.updatePathOpen(Date.now() - (this.timeStart + this.delay)));
    } else {
      this.path1.setAttribute('d', this.updatePathClose(Date.now() - (this.timeStart + this.delay)));
      this.path2.setAttribute('d', this.updatePathClose(Date.now() - this.timeStart));
    }
  }
  renderLoop() {
    this.render();
    if (Date.now() - this.timeStart < this.duration + this.delay + 300) {
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
