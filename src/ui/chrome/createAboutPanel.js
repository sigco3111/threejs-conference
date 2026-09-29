import "./aboutPanel.css";
import { isMobileLayout, onMobileLayoutChange } from "../../platform/deviceLayout.js";
import { SOURCE_CODE_URL } from "../core/externalLinks.js";

const CLOSE_ICON = `
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      stroke-width="2.25"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
`;

export function createAboutPanel({ state } = {}) {
  const root = document.createElement("div");
  root.className = "about-overlay";
  root.hidden = true;
  root.innerHTML = `
    <button type="button" class="close-button-panel" aria-label="닫기">
      ${CLOSE_ICON}
    </button>

    <div class="about-content">
      <div class="about-body">
        <div class="about-brand">
          <p class="about-brand-title">THREEJS 펑크</p>
          <small class="about-brand-subtitle">Anderson Mancini &amp; Sunag 제작</small>
        </div>
        <div class="about-copy">
          <div class="about-copy-col">
            <p class="about-lead">
              Threejs-Punk는 블레이드 러너 촬영장과 부팅 시퀀스 사이 어딘가의
              빗속 골목으로 당신을 안내합니다. 네온 간판, 젖은 아스팔트,
              도시의 불빛이 꺼지지 않는 밤.
            </p>
            <p class="about-lead">
              눈에 보이는 모든 반사, 빗방울, 빛은 모두 Three.js WebGPU와 TSL로
              실시간 렌더링됩니다. 미리 만들어진 효과 없이, 셰이더가 모든 것을
              실시간으로 처리합니다.
            </p>
          </div>
          <div class="about-copy-col">
            <p class="about-lead">
              구석에 깜빡이는 표시는 분위기를 위한 소품입니다. 레트로 미래 미감을
              차용한 가짜 바이탈 HUD로, 밤거리를 조금 더 살아 있게 만들기 위함입니다.
            </p>
            <p class="about-lead">
              처음에는 Three.js 컨퍼런스를 위해 만들어졌으며, 빗소리 속에서
              거리를 거닐고, 하늘을 올려다보며 이야기를 들을 수 있는 작은 초대입니다.
            </p>
          </div>
        </div>
      </div>

      <div class="about-footer">
        <div class="about-buttons">
          <button type="button" class="refresh-button-panel about-link-anderson">
            Anderson Mancini
          </button>
          <button type="button" class="refresh-button-panel about-link-sunag">
            Sunag
          </button>
          <button type="button" class="refresh-button-panel about-link-source">
            소스 코드
          </button>
        </div>
        <p class="about-model-credits">
          Anderson Mancini &amp; Sunag 제작
        </p>
        <p class="about-recommended about-recommended--desktop">
          <span class="about-recommended-title">권장 사양</span>
          GPU 성능과 RAM 16GB가 가장 중요합니다. Mac: M2 이상. PC: 외장 GPU, RAM 16GB.
          Chrome 또는 Edge (최신) · WebGPU 필수 · 1080p 풀스크린 (4K는 자동으로 축소).
          WASD + Shift 달리기 · 클릭으로 둘러보기 · 설정에서 룩 변경 · 헤드폰 권장.
        </p>
        <p class="about-recommended about-recommended--mobile">
          <span class="about-recommended-title">권장 사양</span>
          iPhone 15 이상 · Android: 2023년 플래그십 이상 (Snapdragon 8 Gen 2 / 동급, RAM 8GB).
          Chrome (최신) · WebGPU 필수 · 가로 화면.
          온스크린 조이스틱 · 설정에서 룩 변경 · 헤드폰 권장.
        </p>
      </div>
    </div>
  `;

  const closeButton = root.querySelector(".close-button-panel");
  const andersonButton = root.querySelector(".about-link-anderson");
  const sunagButton = root.querySelector(".about-link-sunag");
  const sourceButton = root.querySelector(".about-link-source");
  const desktopRecommended = root.querySelector(".about-recommended--desktop");
  const mobileRecommended = root.querySelector(".about-recommended--mobile");

  function syncRecommendedVisibility() {
    const mobile = isMobileLayout();
    desktopRecommended.hidden = mobile;
    mobileRecommended.hidden = !mobile;
  }

  syncRecommendedVisibility();
  const unsubscribeLayout = onMobileLayoutChange(syncRecommendedVisibility);

  function open() {
    root.classList.remove("about-overlay--force-hidden");
    syncRecommendedVisibility();
    root.hidden = false;
  }

  function close() {
    root.hidden = true;
    state?.closePanel();
  }

  closeButton.addEventListener("click", close);

  andersonButton.addEventListener("click", () => {
    window.open("https://andersonmancini.dev", "_blank", "noopener,noreferrer");
  });

  sunagButton.addEventListener("click", () => {
    window.open("https://x.com/sea3dformat", "_blank", "noopener,noreferrer");
  });

  sourceButton.addEventListener("click", () => {
    window.open(SOURCE_CODE_URL, "_blank", "noopener,noreferrer");
  });

  function onKeyDown(event) {
    if (event.key === "Escape" && !root.hidden) {
      close();
    }
  }

  document.addEventListener("keydown", onKeyDown);

  state?.subscribe(({ openedPanel }) => {
    if (openedPanel === "about") {
      open();
    } else if (!root.hidden) {
      root.hidden = true;
    }
  });

  function setForceHidden(hidden) {
    if (hidden && !root.hidden) {
      return;
    }

    root.classList.toggle("about-overlay--force-hidden", hidden);
  }

  document.body.appendChild(root);

  return {
    root,
    open,
    close,
    setForceHidden,
    destroy() {
      unsubscribeLayout?.();
      document.removeEventListener("keydown", onKeyDown);
      root.remove();
    },
  };
}
