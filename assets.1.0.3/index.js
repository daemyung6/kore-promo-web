window.addEventListener('DOMContentLoaded', function () {
    let style = document.createElement('style');
    document.head.appendChild(style);

    function update() {
        let width = document.getElementsByTagName('body')[0].offsetWidth;
        let ratio = width / 800;

        if (ratio > 1) { ratio = 1 }
        style.innerText = `:root { --ratio: ${ratio}; }`;
    }
    update();

    window.addEventListener('resize', function () {
        update();
    })
})
window.addEventListener('DOMContentLoaded', function () {
    const viewPage = this.document.getElementById('viewPage')
    let isViewPageActive = false;
    let imgSizeZoom = 100;
    let isLoad = false;

    function loadingDiv() {
        let loader = document.createElement('div')
        loader.classList.add('loader')

        let wheel = document.createElement('div')
        wheel.classList.add('loader-wheel')

        loader.appendChild(wheel)

        return loader
    }

    function viewPageActive() {
        imgBox.innerHTML = null
        viewPage.classList.add('active')
        isViewPageActive = true;
        isLoad = false;
        document.body.style.overflow = 'hidden'
    }

    const closebt = this.document.getElementById('close-bt')
    const imgBox = this.document.getElementById('img-box')

    closebt.addEventListener('click', () => {
        viewPage.classList.remove('active')
        isViewPageActive = false;
        document.body.style.overflow = 'unset'
    })



    const imgBoxs = document.getElementsByClassName('img-box')
    for (let i = 0; i < imgBoxs.length; i++) {
        let width = Number(imgBoxs[i].getAttribute('data-width'));
        let height = Number(imgBoxs[i].getAttribute('data-height'));

        imgBoxs[i].style.width = `calc(${width}px * var(--ratio))`
        imgBoxs[i].style.height = `calc(${height}px * var(--ratio))`

        let isView = false;
        function checkView() {
            const id = i;
            if (
                (imgBoxs[id].offsetTop > this.scrollY + (window.innerHeight * (7 / 8)))
            ) { return }
            if (isView) { return }

            isView = true;

            window.removeEventListener('scroll', checkView, false)

            imgBoxs[id].appendChild( loadingDiv() )

            const img = document.createElement('img')
            img.addEventListener('load', () => {
                imgBoxs[id].innerHTML = null
                imgBoxs[id].appendChild(img)
                setTimeout(() => { img.style.opacity = 1 }, 50)

            })
            img.addEventListener('error', () => {
                imgBoxs[id].innerText = 'not found'
            })
            img.src = `https://cdn.jsdelivr.net/gh/daemyung6/kore-promo-web/assets.2.0.0/images/preview/${id + 1}.jpg`
            imgBoxs[id].addEventListener('click', () => {
                viewPageActive()
                imgBox.appendChild( loadingDiv() )

                const img = document.createElement('img')
                img.addEventListener('load', () => {
                    imgBox.innerHTML = null
                    imgBox.appendChild(img)
                    setTimeout(() => {
                        isLoad = true;
                        img.style.opacity = 1;
                    }, 50)
                })
                img.addEventListener('error', () => {
                    imgBox.innerText = 'not found'
                })
                img.src = `https://cdn.jsdelivr.net/gh/daemyung6/kore-promo-web/assets.2.0.0/images/full/${id + 1}.jpg`
            })
        }
        checkView()
        window.addEventListener('scroll', checkView)
    }
})

