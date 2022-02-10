/// <reference path="../../node_modules/typescript/lib/lib.dom.d.ts"/>
/// <reference path="../../node_modules/typescript/lib/lib.dom.iterable.d.ts"/>


let currentPage = 0;

function prepare(): void {
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "Backspace") {
      setPage(currentPage - 1);
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      setPage(currentPage + 1);
    }
  });
  let match = location.hash.match(/#(\d+)/);
  if (match !== null) {
    let page = parseInt(match[1]);
    setPage(page);
  }
  console.info("[ZenmlSlide] Ready");
}

function setPage(nextPage: number): void {
  let slideElements = document.querySelectorAll<HTMLElement>(".slide");
  let maxPage = slideElements.length - 1;
  currentPage = nextPage;
  if (currentPage < 0) {
    currentPage = 0;
  }
  if (currentPage > maxPage) {
    currentPage = maxPage;
  }
  location.hash = currentPage.toString();
  slideElements.forEach((slideElement) => {
    let page = parseInt(slideElement.getAttribute("data-page") ?? "");
    if (page === currentPage) {
      slideElement.style.display = "block";
    } else {
      slideElement.style.display = "none";
    }
  });
}

window.onload = prepare;