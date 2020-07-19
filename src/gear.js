// こちらにおいておこうかと。なんていうかあれですね・・
// 短いですね。まあ当然か。歯車置いてかみ合わせてるだけなんだから。背景もうちょっと工夫したかったわね。んー。
// 思いつかなかったんだよ。だってさ、よく見えないじゃん、なんかやってても。
// 大変だったけど一次方程式立てて解くだけみたいな感じだったかな、まあそこまで難しくなかった。
// 次行きたいからこれはもう、ああ、そうね、自由にパターン作れたらいいわね。
// ギアグループを自作して、色は全部一緒で、グループの重ね合わせとかそういうのも選べるようにして、あとはそうね、
// 動画として録画するとか？それは無理か。まあ、saveくらいかなぁ。うん。GIFとして保存とかできたらいいのに。

// Qiitaにコード全文載せることになったので文面を整えてくださいという指示が来ました。はい。分かりました。

// ばかばかしくなってきたな

// そうだね
// モチベがあのGIFでしたとか書かない方がいいのかもね
// なんかさ、自分、何でも正直に書かないと気が済まないたちでさ。嘘ついて辻褄合わせるのマジ無理なんだわ
// だからさ、それ伏せちゃったら「じゃあ何で歯車を？？」って自分の中でなっちゃうのよね
// だってさ、ケモノが好きでoborさんに惹かれてPixiv漁ってそれで歯車に出会って、っていうのが正式な嘘偽りない経緯なわけでしょ、
// それ書いちゃいけないのおかしいでしょ。正直に書いて何が悪いわけ。マジイミフ。
// まあ、いいけどね。
// ケモノの何が悪いんだよって
// ふざけんなよ

let bg;
let gearGroupArray = [];
let loopFlag = true;

// 背景工夫しようと思ったけど思いつかなかった
function createBackground(){
	bg = createGraphics(width, height);
	bg.background(64);
}

// utility.
function f(t, s){ return cos(t) - s * sin(t); }
function g(t, s){ return sin(t) + s * cos(t); }
function inv(a){ return tan(a) - a; } // インボリュート関数


// 穴作成関数群
// 基本型
function createNormalHole(gr, r, gearColor){
	gr.erase();
	gr.circle(0, 0, r * 1.6);
	gr.noErase();
	gr.stroke(gearColor);
	gr.strokeWeight(r * 0.2);
	gr.circle(0, 0, r * 0.4);
	let angle = random() * 2 * PI;
	for(let k = 0; k < 3; k++){
		gr.line(0, 0, r * 0.82 * cos(angle), r * 0.82 * sin(angle));
		angle += PI * 2 / 3;
	}
}

// 複数の円
function createMultiCircleHole(gr, r, num = 3){
	gr.erase();
	let angle = random() * 2 * PI;
	let diam = r * 0.5 * sin(PI / num) * 1.5;
	for(let k = 0; k < num; k++){
		gr.circle(r * 0.5 * cos(angle), r * 0.5 * sin(angle), diam);
		angle += PI * 2 / num;
	}
}

// 星型
function createStarHole(gr, r){
	// ratioは内側の頂点の内外比
  const ratio = sin(PI * 0.3) - (sqrt(5) - 1) * sin(PI * 0.2) * cos(PI * 0.3); // 0.381966くらい
	gr.erase();
	let angle = random() * 2 * PI;
	let points = [];
	for(let k = 0; k < 5; k++){
		points.push({x:r * 0.8 * cos(angle), y:r * 0.8 * sin(angle)});
		angle += PI * 2 / 5;
	}
	points.push({x:-r * 0.8 * ratio * cos(angle), y:-r * 0.8 * ratio * sin(angle)});
	gr.triangle(points[1].x, points[1].y, points[4].x, points[4].y, points[5].x, points[5].y);
	gr.quad(points[0].x, points[0].y, points[2].x, points[2].y, points[5].x, points[5].y, points[3].x, points[3].y);
}

// 六角形っぽいイメージで
function createHexaLineHole(gr, r, gearColor){
	gr.erase();
	gr.circle(0, 0, r * 1.6);
	gr.noErase();
	gr.stroke(gearColor);
	gr.strokeWeight(r * 0.1);
	let angle = 0;
	for(let k = 0; k < 3; k++){
		gr.line(r * 0.85 * cos(angle), r * 0.85 * sin(angle), -r * 0.85 * cos(angle), -r * 0.85 * sin(angle));
		angle += PI * 2 / 3;
	}
	gr.noFill();
	gr.arc(0, 0, r, r, 0, 2 * PI);
}

// 単純に穴を開ける感じ
function createSimpleHole(gr, r){
	gr.erase();
	gr.circle(0, 0, r * 1.85);
}

// 月型
function createMoonHole(gr, r){
	gr.noStroke();
	gr.erase();
	gr.circle(0, 0, r * 1.4);
	gr.noErase();
	gr.circle(0, r * 0.4, r);
}

function createHole(gr, r, gearColor, typeName){
	// grは歯車の画像で、grは既に中心が(0, 0)になっているから、普通にrの範囲で描画してOK.
	switch(typeName){
		case "normal":
			// 中央に小さく円、3つの扇形状の穴を開ける感じね。
			createNormalHole(gr, r, gearColor); break;
		case "tricircle":
			// 3つの穴を開ける、最初につくったやつ。
			createMultiCircleHole(gr, r, 3); break;
		case "pentacircle":
			// 5つバージョン
			createMultiCircleHole(gr, r, 5); break;
		case "star":
			// 星型の穴
			createStarHole(gr, r); break;
		case "hexaline":
			// 真ん中あたりに円弧、そして棒を6本突き出す。
			createHexaLineHole(gr, r, gearColor); break;
		case "simple":
			// 普通に穴開けるだけ
			createSimpleHole(gr, r); break;
		case "moon":
			// 月
			createMoonHole(gr, r); break;
	}
}

// alpha（圧力角）はPI/9（要するに20°）が一般的ってあった。全部そうしてある。でもまあ一応変数にしておくか。
function drawGearImage(gr, size, alpha, z, m, gearColor, holeTypeName = "normal"){
	let r = z * m * 0.5; // ピッチ円の半径。
	let rb = r * cos(alpha); // 基礎円の半径。インボリュート曲線の根元。
	let ra = r + m; // 歯の先が描く円の半径。これでいいらしい。
	let ri = min(rb, r - 1.25 * m); // 歯底円の半径。基礎円より大きくなる場合は基礎円と同じとする。ここ雑なんですけどまあいいやって感じで。
	let beta = acos(r * cos(alpha) / ra); // 歯の先における法線と円の接点からその点までの角変位
	let psi = tan(beta); // thetaが0からpsiまで動く間に描く軌跡が側面になる
	let phi = Math.PI / (2 * z) + inv(alpha); // インボリュートのスタートまでの角度

	let points = []; // ひとつながりにする。
	let phase, theta, radius;

	gr.translate(size, size);
	gr.applyMatrix(1, 0, 0, -1, 0, 0);
	gr.fill(gearColor);
	gr.stroke(0);
	gr.strokeWeight(0.3);

	// まずphase-PI/zから初めて歯底円上をPI/2z-inv(a)だけ進み、そこから基礎円まで行き、
	// 基礎円上をinv(b)だけ進んで曲線描画、
	// 先っちょから円弧をたどって反対側、
	// また曲線描いて反対側、戻る。
	for(let k = 0; k < z; k++){
		phase = PI * 2 * k / z;
		points.push({x:ri * cos(phase - PI / z), y:ri * sin(phase - PI / z)});
    // 歯底円上をスタートまで円弧
	  for(let i = 0; i <= 10; i++){
			theta = phase - PI / z + (PI / (2 * z) - inv(alpha)) * (i / 10);
			points.push({x:ri * cos(theta), y:ri * sin(theta)});
		}
		// 歯底円から基礎円まで浮上
	  for(let i = 0; i <= 10; i++){
			radius = ri + (rb - ri) * (i / 10);
			theta = phase - PI / (2 * z) - inv(alpha);
			points.push({x:radius * cos(theta), y:radius * sin(theta)});
		}
		// 基礎円からインボリュートで外へ
	  for(let i = 0; i <= 40; i++){
		  theta = psi * i / 40;
		  points.push({x:rb * f(phase - phi + theta, -theta), y:rb * g(phase - phi + theta, -theta)});
	  }
		// 歯先円。
    for(let i = 0; i <= 10; i++){
			theta = phase + (phi - inv(beta)) * (-1 + 0.2 * i);
			points.push({x:ra * cos(theta), y:ra * sin(theta)});
		}
		// 逆インボリュートで再び基礎円へ
		for(let i = 0; i <= 40; i++){
		  theta = psi * (40 - i) / 40;
		  points.push({x:rb * f(phase + phi - theta, theta), y:rb * g(phase + phi - theta, theta)});
	  }
		// 基礎円から歯底円へ
	  for(let i = 0; i <= 10; i++){
			radius = ri + (rb - ri) * ((10 - i) / 10);
			theta = phase + PI / (2 * z) + inv(alpha);
			points.push({x:radius * cos(theta), y:radius * sin(theta)});
		}
		// 歯底円上をふたたびたどりフィニッシュ
	  for(let i = 0; i <= 10; i++){
			theta = phase + PI / z - (PI / (2 * z) - inv(alpha)) * ((10 - i) / 10);
			points.push({x:ri * cos(theta), y:ri * sin(theta)});
		}
	}

  // まとめてcurveVertexで描画
  gr.beginShape();
  for(let p of points){ gr.curveVertex(p.x, p.y); }
  gr.endShape();

  // 穴を開けておめかし
	createHole(gr, ri, gearColor, holeTypeName);
}

// 歯車クラス
class Gear{
	constructor(x, y, alpha, z, m, gearColor, holeTypeName, angularVelocity, initialPhase = 0){
		this.size = (z + 1) * m; // 2倍が(z+2)*mより小さくなるように取った。キャンバスサイズの半分。
		this.img = createGraphics(this.size * 2, this.size * 2);
		drawGearImage(this.img, this.size, alpha, z, m, gearColor, holeTypeName); // 歯車画像の貼り付け
		this.position = createVector(x, y); // 中心位置
		this.alpha = alpha; // 圧力角
		this.teethNum = z; // 歯の数
		this.module = m; // モジュール、要は歯の大きさ
		this.gearColor = gearColor; // 歯車のボディカラー
		this.angularVelocity = angularVelocity; // 回転速度。かみ合う方の歯車はこれを元に自動的に決まる。
		this.radius = z * m * 0.5; // ピッチ円の半径はかみ合わせる際の配置で使う
		this.initialPhase = initialPhase; // 初期位相。かみ合わせる際に参照される。
		this.phase = initialPhase; // 位相。0のとき一つの歯の先っぽがまっすぐ右を向く感じ。その先っぽが向いている方向。
	}
	update(){
		// 回転させる
		this.phase += this.angularVelocity;
	}
	draw(){
		// GearGroupの方でtranslateして中心がもう(0, 0)になっているのでその上でrotateして回転を表現する感じですね。
		// push/popを多用したくないのでそこは工夫してやってます。
		rotate(this.phase);
		image(this.img, -this.size, -this.size);
		rotate(-this.phase);
	}
}

// 互いにかみ合う歯車の集合体。一つ用意して、あとはそれと、それにかみ合うものにかみ合わせていく。
class GearGroup{
	constructor(initialGearData){
		this.gearArray = [];
		const {x, y, alpha, z, m, gearColor, holeTypeName, angularVelocity} = initialGearData;
		const initialGear = new Gear(x, y, alpha, z, m, gearColor, holeTypeName, angularVelocity);
		this.gearArray.push(initialGear);
	}
	connectGear(additionalGearData){
		// 新しい歯車のalpha(圧力角)とモジュールは同じだし速度も決まってしまう（かみ合い前提）ので歯の数と色だけが問題。
		// あとはどの歯車にくっつくか（これはindexで決める）と方向(0～2*PI)があれば追加できるようになる。
		// 位置も半径と方向から決まってしまうからあらかじめ決めておく必要ない。
		// 最後にinitialPhaseの計算、これも一次方程式を解くだけ。簡単です。
		const {index, z, gearColor, holeTypeName, direction} = additionalGearData;
		// index:どの歯車に付くか。z:歯の数。gearColor:色。direction:歯車のくっつく方向。
		// やるべきこと：x, y, alpha, m, angularVelocity, initialPhaseを計算し新しい歯車を追加する。
		const target = this.gearArray[index]; // ターゲットギア。
		const alpha = target.alpha;
		const m = target.module;
		const r = z * m * 0.5; // くっつける歯車の基礎円の半径. これとtarget.radiusの和が中心間の距離になる。そこからx, yを割り出す。
		const x = target.position.x + (target.radius + r) * cos(direction);
		const y = target.position.y + (target.radius + r) * sin(direction);
		const angV = target.angularVelocity * (target.teethNum / z); // 角速度は歯の数に反比例する。かみ合うとはそういうこと。
		// initialPhaseの計算。
		// 何をしているかというとtargetGearがdirection方向に歯の先を向けるタイミングとadditionalGearがマイナスのdirection方向に
		// 歯の間を向けるタイミングを等置して一次方程式を作りそれを解くことでフェイズを算出している。
		// その際任意整数が出てくるがどれかひとつのタイミングで合えばいいので（それで残り全部一致する）勝手に決めて構わない。
		// 回転方向が互逆なのでそれを考慮しないといけないところが難しい。
	  const k = (direction - target.initialPhase) / target.angularVelocity - PI / (z * angV);
		const iniP = direction + PI + angV * k;
		const additionalGear = new Gear(x, y, alpha, z, m, gearColor, holeTypeName, -angV, iniP); // angVを逆にしないとかみ合わないので要注意
		// 接続、というかグループに追加するだけ。これのインデックスを使えばさらにくっつけてくっつけて・・といくらでも。
		this.gearArray.push(additionalGear);
	}
	update(){
		for(let _gear of this.gearArray){ _gear.update(); }
	}
	draw(){
		push();
		// それぞれのかみあいはもう考慮済みなのでtranslateで引き算しながら次々描画していくだけ。
		let prevX = 0;
		let prevY = 0;
		for(let _gear of this.gearArray){
			translate(_gear.position.x - prevX, _gear.position.y - prevY);
			_gear.draw();
			prevX = _gear.position.x;
			prevY = _gear.position.y;
		}
		pop();
	}
}

function setup(){
	createCanvas(640, 480);
	createBackground();
	colorMode(HSB, 100);
	// 一応、歯の数はすべて素数を採用している。

	let gg1 = new GearGroup({x:160, y:130, alpha:PI/9, z:37, m:10, gearColor:color(78, 40, 40), angularVelocity:0.01});
	gg1.connectGear({index:0, z:41, gearColor:color(78, 40, 40), direction:atan(0.75)});
	gearGroupArray.push(gg1);

	let gg2 = new GearGroup({x:120, y:360, alpha:PI/9, z:43, m:8, gearColor:color(67, 60, 60), holeTypeName:"hexaline", angularVelocity:0.02});
	gg2.connectGear({index:0, z:31, gearColor:color(67, 60, 60), holeTypeName:"hexaline", direction:-PI/4});
	gg2.connectGear({index:1, z:23, gearColor:color(67, 60, 60), holeTypeName:"hexaline", direction:PI/4});
	gearGroupArray.push(gg2);

	let gg3 = new GearGroup({x:320, y:240, alpha:PI/9, z:59, m:6, gearColor:color(55, 80, 80), holeTypeName:"simple", angularVelocity:0.01});
	gg3.connectGear({index:0, z:31, gearColor:color(55, 80, 80), holeTypeName:"star", direction:PI / 6});
	gg3.connectGear({index:0, z:31, gearColor:color(55, 80, 80), holeTypeName:"star", direction:PI * 7 / 6});
	gg3.connectGear({index:0, z:31, gearColor:color(55, 80, 80), holeTypeName:"star", direction:-PI / 6});
	gg3.connectGear({index:0, z:31, gearColor:color(55, 80, 80), holeTypeName:"star", direction:-PI * 7 / 6});
	gg3.connectGear({index:0, z:31, gearColor:color(55, 80, 80), holeTypeName:"star", direction:PI / 2});
	gg3.connectGear({index:0, z:31, gearColor:color(55, 80, 80), holeTypeName:"star", direction:-PI / 2});
	gearGroupArray.push(gg3);

	let gg4 = new GearGroup({x:-160, y:560, alpha:PI/9, z:113, m:6, gearColor:color(45, 100, 100), holeTypeName:"simple", angularVelocity:0.005});
	gg4.connectGear({index:0, z:41, gearColor:color(45, 100, 100), holeTypeName:"tricircle", direction:-PI/4});
	gg4.connectGear({index:1, z:31, gearColor:color(45, 100, 100), holeTypeName:"pentacircle", direction:PI/4});
	gg4.connectGear({index:2, z:17, gearColor:color(45, 100, 100), holeTypeName:"simple", direction:-PI/4});
	gg4.connectGear({index:3, z:29, gearColor:color(45, 100, 100), holeTypeName:"hexaline", direction:PI/7});
	gg4.connectGear({index:3, z:53, gearColor:color(45, 100, 100), direction:-PI/2});
	gg4.connectGear({index:1, z:89, gearColor:color(45, 100, 100), holeTypeName:"simple", direction:-PI * 3 / 4});
	gg4.connectGear({index:2, z:11, gearColor:color(45, 100, 100), holeTypeName:"star", direction:PI/4});
	gearGroupArray.push(gg4);
}

// 描画部分はこれだけ。
function draw(){
	image(bg, 0, 0);
	for(let gg of gearGroupArray){ gg.update(); }
	for(let gg of gearGroupArray){ gg.draw(); }
}

// スペースキーで動かしたり止めたり
function keyTyped(){
	if(keyCode === 32){ if(loopFlag){ noLoop(); loopFlag = false; }else{ loop(); loopFlag = true; } }
}
