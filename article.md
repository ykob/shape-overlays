# Gooey Overlay

今回はSVGと曲線を用いた、CSSだけでは表現することのできない、ユニークな画面効果の実装方法をご紹介します。  
曲線を描くpath要素の各制御座標をアニメーションさせて、ぐにょぐにょした動きをする矩形（オーバーレイ）を作るというものです。  
この演出のアニメーションには、よく知られたイージング関数を利用します。  
曲線の制御点の数、スピード、遅延値、イージング関数などを工夫することで様々な見た目のオーバーレイを作ることができるので、  
これを画面遷移などのウェブページ上のインタラクションに用いることでUIをより印象的なものにすることができます。

## HTML / CSS of SVG

今回の演出に使用する基礎的なHTMLとCSSは以下のとおりです。  
アニメーションさせる`path`要素を可変する`svg`要素のサイズに適宜対応させるために、`svg`要素には`preserveAspectRatio`属性を指定し、その値は`none`とします。

    <svg class="gooey-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path class="gooey-overlay__path"></path>
      <path class="gooey-overlay__path"></path>
      <path class="gooey-overlay__path"></path>
    </svg>

また、`svg`要素には以下のようにCSSを指定して、`svg`要素自体もブラウザウィンドウのサイズと一致させます。

    .gooey-overlay {
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0; left: 0;
    }

`path`要素はオーバーレイの各レイヤーに該当します。  
それぞれの色をCSSで指定しておきます。  
最後の`path`要素がオーバーレイ展開後の背景色に該当します。

    .gooey-overlay path:nth-of-type(1) { fill: #c4dbea; }
    .gooey-overlay path:nth-of-type(2) { fill: #4c688b; }
    .gooey-overlay path:nth-of-type(3) { fill: #2e496a; }

## JavaScript GooeyOverlay class

今回のデモ用にオーバーレイの制御用クラスを作成しています。
このクラスの持つプロパティは以下のとおりです。これらのプロパティでは制御点の数やアニメーションの長さ、遅延の最大値などを決めることが出来、これらを変更することでオーバーレイの見た目を様々に変化させることができます。

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

オーバーレイの見た目を決めるさらなる要素が、`GooeyOverlay.toggle()`メソッドと`GooeyOverlay.updatePath()`メソッドです。

`GooeyOverlay.toggle()`メソッドはそのオーバーレイを開閉する機能を持ちますが、同時に各制御点の遅延値を開閉時に都度設定する役割も持っています。  
これは一定の値を持ち続けるのでもよいのですが、毎回多少の変化を与えてあげることで演出にメリハリが生まれるでしょう。

`GooeyOverlay.updatePath()`メソッドは`requestAnimationFrame`によって、アニメーションが開始されてから終了するまで毎フレーム実行されます。
引数`time`には0から1までの値が入力されるようになっており、それをイージング関数に用いることで制御点ごとのアニメーションを制御しています。  
この箇所の計算方法はあなたが任意に設定することが出来ます。

demo1ではすべての制御点に同じイージング関数を用い、且つ三角関数を用いて遅延値を細かい波のように設定することで、画面が「溶ける」ような見た目を演出しています。

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

今回作成したデモではオーバーレイを、ハンバーガーボタンによって開閉するフルスクリーンのグローバルメニューの背景として利用していますが、例えばページ遷移やスクロールの演出に利用することも可能です。  
このような演出はユーザーの体験をより楽しげなものにし、ウェブのデザインがユーザーに与える印象をより強いものにしてくれるでしょう。

## Credits

- [glsl-easings](https://github.com/glslify/glsl-easings) by glslify. Easing functions that use to demos are based on the code of glsl-easing module.
