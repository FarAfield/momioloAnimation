function snowflake(id) {
  //requestAnimationFrameのベンダープレフィクス
  const requestAnimatoinFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    };

  //ウィンドウサイズ
  let width = window.innerWidth;
  let height = window.innerHeight;

  //雪が降るスピード
  //レイヤー毎にスピードを変える
  let speed1 = null; //getRandomInt(0, 0.4);
  let speed2 = null; //getRandomInt(0.4, 1);
  let speed3 = null; //getRandomInt(1, 2);

  //雪片のサイズ
  let size1 = Math.min(width, height) / 380;
  let size2 = Math.min(width, height) / 200;
  let size3 = Math.min(width, height) / 100;

  //雪片の座標
  let x = null; //getRandomInt(0, width);
  let y = null; //getRandomInt(0, height * 0.4);

  //雪の集合を含むレイヤーとなる配列
  const snows1 = []; //1層目のレイヤー(一番奥)
  const snows2 = []; //2層目のレイヤー(真ん中)
  const snows3 = []; //3層目のレイヤー(先頭)

  //canvasに関するクラス
  class Canvas {
    constructor() {
      //#canvasの参照
      this.elem = document.getElementById(id);

      //canvasのコンテキストを取得
      this.ctx = this.elem.getContext("2d");

      //ウィンドウサイズをcanvasのサイズとする
      this.elem.width = width;
      this.elem.height = height;
      this.elem.style.backgroundColor = "black";

      //ウィンドウがリサイズされるとresizeメソッドが実行される
      window.addEventListener("resize", () => this.resize());
    }

    //canvasをリサイズ
    resize() {
      //canvasのサイズを更新
      this.elem.width = width = window.innerWidth;
      this.elem.height = height = window.innerHeight;
    }
  }

  //canvasオブジェクトを生成
  const canvas = new Canvas();

  //雪片に関するクラス
  class Snowflake {
    constructor(x, y, size, speed) {
      //雪片の座標
      this.x = x;
      this.y = y;

      //雪片のサイズ
      this.size = size;

      //雪片のスピード
      this.speed = speed;

      //雪片の振り幅
      this.swingWidth = 0.3;
    }

    //雪片を描画するメソッド
    draw() {
      const ctx = canvas.ctx;

      //パスを初期化
      ctx.beginPath();

      //円グラデーションを指定
      //http://www.htmq.com/canvas/createRadialGradient.shtml
      const gradient = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.size
      );
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)"); //中心
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0.1)"); //外側

      //塗りをグラデーションにする
      ctx.fillStyle = gradient;

      //座標(x, y)に半径sizeの円弧を描く
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

      //円弧を塗りつぶす
      ctx.fill();

      //パスを閉じる
      ctx.closePath();
    }

    //雪片を動かすメソッド
    move() {
      //moveメソッドが実行されたときのウィンドウのサイズを取得
      //width = window.innerWidth;
      //height = window.innerHeight;

      //ラジアン
      const rad = (this.y * Math.PI) / 180;

      //雪片をふらふらと左右に揺らしながら降らす
      this.x -= Math.sin(rad * this.speed) * this.swingWidth; ///getRandomInt(0, 0.5)*Math.sin(rad) * this.swingWidth
      this.y += this.speed;

      //雪片が画面下に隠れたら
      if (this.y > height || this.x < 0) {
        //隠れた雪片を先頭に戻す
        this.x = getRandomInt(0, width);
        this.y = 0;
      }

      //雪片を描画する
      this.draw();
    }

    //雪片を再配置・リサイズするメソッド
    resize(size, x, y) {
      //再配置
      this.x = x;
      this.y = y;

      //リサイズ
      this.size = size;
    }
  }

  //全体を初期化する関数
  function init() {
    //レイヤーとなる配列に雪片のオブジェクトをwidth / 8個追加して雪の集合を3つ作る
    for (let i = 0; i < width / 8; i++) {
      snows1.push(
        new Snowflake(
          (x = getRandomInt(0, width)),
          (y = getRandomInt(0, height)),
          size1,
          (speed1 = getRandomInt(0, 0.4))
        )
      );
    }
    for (let i = 0; i < width / 8; i++) {
      snows2.push(
        new Snowflake(
          (x = getRandomInt(0, width)),
          (y = getRandomInt(0, height)),
          size2,
          (speed2 = getRandomInt(0.4, 1))
        )
      );
    }
    for (let i = 0; i < width / 8; i++) {
      snows3.push(
        new Snowflake(
          (x = getRandomInt(0, width)),
          (y = getRandomInt(0, height)),
          size3,
          (speed3 = getRandomInt(1, 2))
        )
      );
    }

    //全レイヤーの雪を降らせる
    run();
  }

  //初期化
  init();

  //全レイヤーの雪を降らせる関数
  function run() {
    //描画されていた内容を全て消去する
    canvas.ctx.clearRect(0, 0, width, height);

    //雪を動かす
    for (let i = 0; i < snows1.length; i++) {
      snows1[i].move();
    }
    for (let i = 0; i < snows2.length; i++) {
      snows2[i].move();
    }
    for (let i = 0; i < snows3.length; i++) {
      snows3[i].move();
    }

    //run関数を繰り返し実行
    requestAnimationFrame(run);
  }

  //雪をリサイズする関数
  function resize() {
    //ウィンドウサイズを更新
    width = window.innerWidth;
    height = window.innerHeight;

    //雪片のサイズを更新
    size1 = Math.min(width, height) / 380;
    size2 = Math.min(width, height) / 200;
    size3 = Math.min(width, height) / 100;

    //全ての雪片を再配置・リサイズ
    for (let i = 0; i < snows1.length; i++) {
      snows1[i].resize(
        size1,
        (x = getRandomInt(0, width)),
        (y = getRandomInt(0, height))
      );
    }
    for (let i = 0; i < snows2.length; i++) {
      snows2[i].resize(
        size2,
        (x = getRandomInt(0, width)),
        (y = getRandomInt(0, height))
      );
    }
    for (let i = 0; i < snows3.length; i++) {
      snows3[i].resize(
        size3,
        (x = getRandomInt(0, width)),
        (y = getRandomInt(0, height))
      );
    }
  }

  //ウィンドウがリサイズされるとresize関数が実行される
  window.addEventListener("resize", () => resize());

  //min~maxのランダムな値を取得する関数
  function getRandomInt(min, max) {
    return Math.random() * (max - min + 1) + min;
  }
}
export default snowflake;
