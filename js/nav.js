const navBtn = document.querySelector('.navBtn')
const nav = document.querySelector('nav')

navBtn.addEventListener('click', (e) => {
    navBtn.classList.toggle('active')
    nav.classList.toggle('active')    
})