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
      100 - ease.cubicInOut(Math.min(Math.max(time - 100, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 200, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 0, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 50, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 200, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 300, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 250, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 200, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 150, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 250, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 100, 0) / this.duration, 1)) * 100,
    ];
    return `
      M ${p[0]} 0 C ${p[0]}  5
        ${p[1]}  5 ${p[1]} 10 C ${p[1]} 15
        ${p[2]} 15 ${p[2]} 20 C ${p[2]} 25
        ${p[3]} 25 ${p[3]} 30 C ${p[3]} 35
        ${p[4]} 35 ${p[4]} 40 C ${p[4]} 45
        ${p[5]} 45 ${p[5]} 50 C ${p[5]} 55
        ${p[6]} 55 ${p[6]} 60 C ${p[6]} 65
        ${p[7]} 65 ${p[7]} 70 C ${p[7]} 75
        ${p[8]} 75 ${p[8]} 80 C ${p[8]} 85
        ${p[9]} 85 ${p[9]} 90 C ${p[9]} 95
        ${p[10]} 95 ${p[10]} 100
      H 100
      V 0
    `;
  }
  updatePathClose(time) {
    const p = [
      100 - ease.cubicInOut(Math.min(Math.max(time - 100, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 200, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 0, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 50, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 200, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 300, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 250, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 200, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 150, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 250, 0) / this.duration, 1)) * 100,
      100 - ease.cubicInOut(Math.min(Math.max(time - 100, 0) / this.duration, 1)) * 100,
    ];
    return `
      M 0 0
      H ${p[0]}  C ${p[0]}  5
        ${p[1]}  5 ${p[1]} 10 C ${p[1]} 15
        ${p[2]} 15 ${p[2]} 20 C ${p[2]} 25
        ${p[3]} 25 ${p[3]} 30 C ${p[3]} 35
        ${p[4]} 35 ${p[4]} 40 C ${p[4]} 45
        ${p[5]} 45 ${p[5]} 50 C ${p[5]} 55
        ${p[6]} 55 ${p[6]} 60 C ${p[6]} 65
        ${p[7]} 65 ${p[7]} 70 C ${p[7]} 75
        ${p[8]} 75 ${p[8]} 80 C ${p[8]} 85
        ${p[9]} 85 ${p[9]} 90 C ${p[9]} 95
        ${p[10]} 95 ${p[10]} 100
      H 0
      V 0
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
