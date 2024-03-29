/// <reference path="../../node_modules/typescript/lib/lib.dom.d.ts"/>
/// <reference path="../../node_modules/typescript/lib/lib.dom.iterable.d.ts"/>


let currentPage = 1;

function prepare(): void {
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "Backspace") {
      setPage(currentPage - 1);
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      setPage(currentPage + 1);
    }
  });
  const match = location.hash.match(/#(\d+)/);
  const page = (match !== null) ? parseInt(match[1]) : 1;
  setPage(page);
  console.info("[ZenmlSlide] Ready");
}

function setPage(nextPage: number): void {
  const slideElements = document.querySelectorAll<HTMLElement>(".slide");
  const maxPage = slideElements.length;
  currentPage = nextPage;
  if (currentPage < 1) {
    currentPage = 1;
  }
  if (currentPage > maxPage) {
    currentPage = maxPage;
  }
  location.hash = currentPage.toString();
  slideElements.forEach((slideElement) => {
    const page = parseInt(slideElement.getAttribute("data-page") ?? "");
    if (page === currentPage) {
      slideElement.style.display = "block";
    } else {
      slideElement.style.display = "none";
    }
  });
}

window.onload = prepare;