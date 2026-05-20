import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "assets/console");
const tmpDir = resolve(root, "assets/console/.tmp");
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

mkdirSync(outDir, { recursive: true });
mkdirSync(tmpDir, { recursive: true });

function render(name, width, height, body, extraStyle = "") {
	const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=${width}, initial-scale=1" />
<style>
* { box-sizing: border-box; }
html, body {
  width: ${width}px;
  height: ${height}px;
  margin: 0;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard", "Segoe UI", sans-serif;
  color: #191f28;
}
.canvas {
  width: ${width}px;
  height: ${height}px;
  position: relative;
  overflow: hidden;
  background: #fff;
}
.phone {
  width: 390px;
  min-height: 760px;
  border-radius: 36px;
  background: #fff;
  box-shadow: 0 28px 80px rgba(25, 31, 40, 0.18);
  border: 1px solid rgba(25, 31, 40, 0.08);
  padding: 28px 22px;
}
.t4 { font-size: 32px; line-height: 40px; font-weight: 800; letter-spacing: 0; }
.t5 { font-size: 24px; line-height: 32px; font-weight: 800; letter-spacing: 0; }
.t6 { font-size: 19px; line-height: 28px; font-weight: 700; letter-spacing: 0; }
.t7 { font-size: 16px; line-height: 24px; color: #6b7684; letter-spacing: 0; }
.button {
  height: 56px;
  border-radius: 16px;
  background: #3182f6;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 17px;
}
.card {
  border-radius: 28px;
  padding: 28px;
  border: 1px solid #f2f4f6;
}
.metric {
  border-radius: 20px;
  padding: 20px;
  background: #f9fafb;
  border: 1px solid #f2f4f6;
}
.chip {
  border-radius: 999px;
  border: 1px solid #e5e8eb;
  padding: 10px 14px;
  font-size: 15px;
  font-weight: 800;
  color: #4e5968;
  background: #fff;
  display: inline-flex;
}
.badge {
  border-radius: 999px;
  padding: 7px 13px;
  background: #fff;
  color: #e11d48;
  border: 1px solid rgba(25,31,40,.08);
  font-weight: 900;
  font-size: 15px;
}
${extraStyle}
</style>
</head>
<body>${body}</body>
</html>`;
	const htmlPath = resolve(tmpDir, `${name}.html`);
	const pngPath = resolve(outDir, `${name}.png`);
	writeFileSync(htmlPath, html);
	execFileSync(chrome, [
		"--headless=new",
		"--disable-gpu",
		"--no-sandbox",
		`--window-size=${width},${height}`,
		"--hide-scrollbars",
		"--force-device-scale-factor=1",
		`--screenshot=${pngPath}`,
		`file://${htmlPath}`,
	]);
	console.log(pngPath);
}

function logo({ name, dark = false }) {
	render(
		name,
		600,
		600,
		`<div class="canvas logo">
  <div class="mark">
    <div class="cardlet c1">?</div>
    <div class="cardlet c2">SR</div>
    <div class="spark s1"></div>
    <div class="spark s2"></div>
  </div>
</div>`,
		`
.logo { background: ${dark ? "#111827" : "#3182f6"}; display:flex; align-items:center; justify-content:center; }
.mark { width: 360px; height: 360px; position: relative; }
.cardlet {
  position: absolute;
  width: 220px;
  height: 270px;
  border-radius: 46px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight: 950;
  box-shadow: 0 28px 70px rgba(0,0,0,.22);
}
.c1 { left: 42px; top: 52px; background: #fff; color: #3182f6; font-size: 126px; transform: rotate(-12deg); }
.c2 { right: 20px; bottom: 30px; background: #feecef; color: #e11d48; font-size: 72px; transform: rotate(10deg); border: 8px solid #fff; }
.spark { position:absolute; border-radius:999px; background:#fff; opacity:.95; }
.s1 { width: 34px; height: 34px; right: 30px; top: 38px; }
.s2 { width: 20px; height: 20px; left: 20px; bottom: 40px; opacity:.72; }
`,
	);
}

function homeScreen(name, width, height) {
	render(
		name,
		width,
		height,
		`<div class="canvas screen">
  <div class="page">
    <div class="t4">인생선택</div>
    <div class="t7 mt12">하고 싶은 선택을 입력하면 미래 루트를 뽑아드립니다.</div>
    <div class="chips">
      <span class="chip">퇴사하면?</span><span class="chip">고백하면?</span><span class="chip">코인 사면?</span><span class="chip">여행 가면?</span>
    </div>
    <div class="button mt24">오늘의 루트 뽑기</div>
    <div class="card empty mt28">
      <div class="t6">오늘의 가챠가 아직 열려 있어요.</div>
      <div class="t7 mt8">하루에 한 번만 결과가 저장됩니다. 질문은 짧을수록 밈처럼 잘 나와요.</div>
    </div>
    <div class="grid mt24">
      <div class="metric"><div class="t7">연속 출석</div><div class="t5 mt8">3일</div></div>
      <div class="metric"><div class="t7">엔딩 수집</div><div class="t5 mt8">7개</div></div>
    </div>
  </div>
</div>`,
		screenCss(width, height),
	);
}

function inputScreen(name, width, height) {
	render(
		name,
		width,
		height,
		`<div class="canvas screen">
  <div class="page">
    <div class="top"><div><div class="t4">질문 입력</div><div class="t7 mt8">오늘 딱 한 번, 미래 시뮬레이션을 돌립니다.</div></div><div class="homeBtn">홈</div></div>
    <div class="card mt28">
      <div class="t6">무엇을 하면 어떻게 될까요?</div>
      <div class="textarea">퇴사하면?</div>
      <div class="t7 mt12">5/40 · 결과는 이 기기에 저장됩니다.</div>
      <div class="grid mt20">
        <div class="smallBtn">퇴사하면?</div><div class="smallBtn">고백하면?</div><div class="smallBtn">코인 사면?</div><div class="smallBtn">집 사면?</div>
      </div>
      <div class="button mt28">미래 뽑기</div>
    </div>
  </div>
</div>`,
		screenCss(width, height),
	);
}

function resultScreen(name, width, height, horizontal = false) {
	const layout = horizontal
		? `<div class="wide">
      <div class="phone compact">${resultContent()}</div>
      <div class="side">
        <div class="t4">공유하고 싶은<br/>미래 카드</div>
        <div class="t7 mt16">성공확률, 위험도, 희귀 엔딩까지 한 장으로 저장됩니다.</div>
        <div class="sideCard mt32"><span class="badge">SSR</span><div class="t6 mt16">레전드 타임라인</div><div class="t7 mt8">친구에게 보내기 좋은 밈형 결과</div></div>
      </div>
    </div>`
		: `<div class="page resultPage">${resultContent()}</div>`;
	render(
		name,
		width,
		height,
		`<div class="canvas screen resultBg">${layout}</div>`,
		screenCss(width, height) +
			`
.resultBg { background: linear-gradient(180deg,#fff 0%,#f9fafb 100%); }
.resultCard { background:#feecef; }
.symbol { width:76px;height:76px;border-radius:24px;background:#e11d48;color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:950;box-shadow:0 14px 34px rgba(225,29,72,.24); }
.meterGrid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-top:20px; }
.meter { background:rgba(255,255,255,.72); border-radius:18px; padding:16px; }
.locked { border-radius:24px; padding:22px; background:#fff; border:1px solid #e5e8eb; box-shadow:0 8px 24px rgba(15,23,42,.06); }
.wide { width:100%;height:100%;display:flex;align-items:center;justify-content:center;gap:92px;padding:64px; }
.compact { transform:scale(.86); transform-origin:center; }
.side { width:520px; }
.sideCard { border-radius:28px; background:#fff; padding:32px; box-shadow:0 24px 80px rgba(25,31,40,.12); }
`,
	);
}

function resultContent() {
	return `<div class="t4">미래 시뮬레이션</div>
  <div class="t7 mt8">오늘의 결과가 저장됐어요.</div>
  <div class="card resultCard mt24">
    <div class="row"><div class="t7">5월 18일 시뮬레이션</div><span class="badge">SSR</span></div>
    <div class="symbol mt18">SSR</div>
    <div class="t5 mt20">퇴사하면?</div>
    <div class="t6 mt8">레전드 타임라인</div>
    <div class="t7 mt12">희귀 변수가 터지는 레전드 루트</div>
    <div class="meterGrid">
      <div class="meter"><div class="t7">성공확률</div><div class="t5 mt4">91%</div></div>
      <div class="meter"><div class="t7">위험도</div><div class="t5 mt4">58%</div></div>
    </div>
  </div>
  <div class="locked mt20">
    <div class="row"><div class="t6">광고 보고 다른 타임라인</div><span class="badge">AD</span></div>
    <div class="t7 mt8">반전 루트와 최악의 루트를 한 번 더 열 수 있어요.</div>
  </div>`;
}

function archiveScreen(name, width, height) {
	render(
		name,
		width,
		height,
		`<div class="canvas screen">
  <div class="page">
    <div class="t4">엔딩 도감</div>
    <div class="t7 mt8">뽑은 결과와 아직 못 본 희귀 엔딩을 확인해요.</div>
    <div class="lockedSsr mt24"><div class="t6">SSR 엔딩이 아직 잠겨 있어요</div><div class="t7 mt8">광고 시청으로 한 번 더 도전할 수 있어요.</div></div>
    <div class="endingGrid mt24">
      <div class="ending"><span class="badge n">N</span><div class="t7 mt12">조용한 승리</div></div>
      <div class="ending"><span class="badge r">R</span><div class="t7 mt12">갑자기 분위기 반전</div></div>
      <div class="ending"><span class="badge sr">SR</span><div class="t7 mt12">주인공 보정 발동</div></div>
      <div class="ending"><span class="badge">SSR</span><div class="t7 mt12">???</div></div>
    </div>
    <div class="card mt24"><div class="t6">퇴사하면?</div><div class="t7 mt8">SR · 주인공 보정 발동</div></div>
  </div>
</div>`,
		screenCss(width, height) +
			`
.lockedSsr { border:1px solid #feecef; border-radius:28px; padding:24px; background:#fff7f8; }
.endingGrid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
.ending { border:1px solid #f2f4f6; border-radius:20px; padding:18px; background:#f9fafb; }
.n { color:#6b7684; } .r { color:#3182f6; } .sr { color:#f97316; }
`,
	);
}

function thumbnail() {
	render(
		"thumbnail-1932x828",
		1932,
		828,
		`<div class="canvas thumb">
  <div class="copy">
    <div class="eyebrow">AI 미래 시뮬레이터</div>
    <div class="headline">오늘의<br/>인생 선택지</div>
    <div class="sub">퇴사하면? 고백하면? 코인 사면?<br/>선택의 미래를 카드로 뽑아보세요.</div>
  </div>
  <div class="phone p1">${resultContent()}</div>
  <div class="miniCard"><span class="badge">SSR</span><div class="t6 mt16">희귀 엔딩 발견</div><div class="t7 mt8">공유하고 싶은 결과 카드</div></div>
</div>`,
		`
.thumb { background: radial-gradient(circle at 76% 20%, #feecef 0, #fff 34%, #eef6ff 100%); }
.copy { position:absolute; left:130px; top:128px; width:620px; }
.eyebrow { color:#3182f6; font-size:32px; line-height:40px; font-weight:900; }
.headline { margin-top:18px; font-size:92px; line-height:104px; font-weight:950; letter-spacing:0; }
.sub { margin-top:28px; font-size:30px; line-height:44px; color:#4e5968; font-weight:700; }
.p1 { position:absolute; right:410px; top:40px; transform:scale(.88); transform-origin:top right; }
.miniCard { position:absolute; right:120px; bottom:118px; width:360px; border-radius:32px; background:#fff; padding:32px; box-shadow:0 24px 90px rgba(25,31,40,.16); }
.resultCard { background:#feecef; }
.symbol { width:76px;height:76px;border-radius:24px;background:#e11d48;color:#fff;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:950;box-shadow:0 14px 34px rgba(225,29,72,.24); }
.meterGrid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-top:20px; }
.meter { background:rgba(255,255,255,.72); border-radius:18px; padding:16px; }
.locked { display:none; }
`,
	);
}

function screenCss(width) {
	return `
.screen { background:#fff; }
.page { width:100%; height:100%; padding:${width < 700 ? 34 : 56}px ${width < 700 ? 28 : 48}px; }
.mt4 { margin-top:4px; }.mt8 { margin-top:8px; }.mt12 { margin-top:12px; }.mt16 { margin-top:16px; }.mt18 { margin-top:18px; }.mt20 { margin-top:20px; }.mt24 { margin-top:24px; }.mt28 { margin-top:28px; }.mt32 { margin-top:32px; }
.chips { display:flex; flex-wrap:wrap; gap:8px; margin-top:22px; }
.grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
.row { display:flex; align-items:center; justify-content:space-between; gap:12px; }
.textarea { margin-top:20px; min-height:160px; border-radius:24px; border:1px solid #e5e8eb; background:#fff; padding:22px; font-size:24px; line-height:34px; font-weight:800; }
.smallBtn { height:44px; border-radius:14px; background:#f2f4f6; color:#4e5968; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:15px; }
.top { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; }
.homeBtn { border-radius:14px; background:#f2f4f6; color:#4e5968; padding:10px 14px; font-weight:800; }
`;
}

logo({ name: "app-logo-600" });
logo({ name: "app-logo-dark-600", dark: true });
thumbnail();
homeScreen("screenshot-vertical-01-home-636x1048", 636, 1048);
inputScreen("screenshot-vertical-02-input-636x1048", 636, 1048);
resultScreen("screenshot-vertical-03-result-636x1048", 636, 1048);
archiveScreen("screenshot-vertical-04-archive-636x1048", 636, 1048);
resultScreen("screenshot-horizontal-01-result-1504x741", 1504, 741, true);
