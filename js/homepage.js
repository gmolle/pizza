const homePageJumbotronDivs = document.querySelectorAll('.container div');
homePageJumbotronDivs.forEach(div => {
  div.addEventListener('animationend', () => {
    div.style.opacity = '1';
  })
});
