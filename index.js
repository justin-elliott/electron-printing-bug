'use strict';

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const PRINT_SCALING = 300 / 72;

function init() {
  const pageCountInput = document.getElementById('page-count');
  pageCountInput.addEventListener('input', renderPreview);

  const printButton = document.getElementById('print');
  printButton.addEventListener('click', printPages);

  renderPreview();
}

function renderPreview() {
  const canvas = document.getElementById('page');
  renderPage(canvas, pageCount(), 1);
}

function renderPage(canvas, pageNumber, scale) {
  const context = canvas.getContext('2d');
  context.scale(scale, scale);

  const width = canvas.width / scale;
  const height = canvas.height / scale;

  context.fillStyle = 'white';
  context.fillRect(0, 0, width, height);

  context.fillStyle = 'black';
  context.font = '48px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(pageNumber, width / 2, height / 2);
}

function pageCount() {
  const pageCountInput = document.getElementById('page-count');
  const min = pageCountInput.min|0;
  const max = pageCountInput.max|0;
  const value = pageCountInput.value|0;
  return value < min ? min : (value > max ? max : value);
}

async function printPages() {
  const pages = document.getElementById('pages');
  const progress = document.getElementById('render-progress');

  for (let i = 1, count = pageCount(); i <= count; i++) {
    await addPage(pages, i);
    progress.value = i / count;
  }

  window.print();
    
  // clear all pages
  const emptyPages = pages.cloneNode(false);
  pages.parentNode.replaceChild(emptyPages, pages);
}

function addPage(pages, pageNumber) {
  return new Promise(resolve => {
    const canvas = createPage(pageNumber);
    canvas.toBlob(blob => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(blob);
      img.width = PAGE_WIDTH;
      img.height = PAGE_HEIGHT;
      img.onload = event => {
        URL.revokeObjectURL(event.target.src);
        resolve();
      };
      pages.appendChild(img);
    });
  });
}

function createPage(pageNumber) {
  const canvas = document.createElement('canvas');

  // canvas dimensions @ 300dpi
  canvas.width = PAGE_WIDTH * PRINT_SCALING;
  canvas.height = PAGE_HEIGHT * PRINT_SCALING;

  renderPage(canvas, pageNumber, PRINT_SCALING);
  return canvas;
}

window.addEventListener('load', init);