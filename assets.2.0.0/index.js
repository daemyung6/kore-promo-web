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
    const imageIds = [
        '1-fb2373e5-8a24-454c-911b-1eddb566261e',
        '2-cbddc6c9-a8d8-466f-88b9-df595bd6ae85',
        '3-fe61606f-26e2-4b75-afa0-c374aa9dbb83',
        '4-b408a749-827f-4e1a-8098-3b150f09f2b2',
        '5-018fc28d-4fdd-4729-9c67-41c0e5e8d7bf',
        '6-bbef33bb-4fb7-4799-ae8b-37609f18a926',
        '7-b4d66bc6-8cbc-4994-8976-372b52b54fea',
        '8-9a482a9f-fecc-4447-a5c5-30183bedf4dc',
        '9-1989ba21-9f23-495f-99af-b1aef7f27a39',
        '10-d5e51337-4ea4-4fc3-ae9b-21261418056a',
        '11-c7d9b45d-d473-4f19-848c-7165fe748d29',
        '12-ac3b0037-293b-4c67-9b73-0f6a71a44f5e',
        '13-04dd4d86-3d76-44c9-936c-ef5ed5a0116a',
        '14-cfc8ba2d-cc26-451f-aa9a-6e33760d03c3',
    ]

    let host = 'https://raw.githubusercontent.com/daemyung6/kore-promo-web/main'

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

        changeURL('')
    })



    const imgBoxs = document.getElementsByClassName('img-box')
    let previewImgBoxList = {}
    for (let i = 0; i < imgBoxs.length; i++) {
        let width = Number(imgBoxs[i].getAttribute('data-width'));
        let height = Number(imgBoxs[i].getAttribute('data-height'));

        imgBoxs[i].style.width = `calc(${width}px * var(--ratio))`
        imgBoxs[i].style.height = `calc(${height}px * var(--ratio))`

        previewImgBoxList[imageIds[i]] = imgBoxs[i]

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
            img.src = `${host}/images/preview/${imageIds[id]}.jpg`
            imgBoxs[id].addEventListener('click', () => {
                viewFullImage(imageIds[id])
            })
        }
        checkView()
        window.addEventListener('scroll', checkView)
    }

    function viewFullImage(imgId) {
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
        img.src = `${host}/images/full/${imgId}.jpg`

        const params = new URLSearchParams()
        params.set('picture', imgId)
        changeURL(params)
    }

    

    function readURL() {
        if(window.location.hash.length === 0) { return }

        const params = new URLSearchParams(
            window.location.hash.slice(
                1, 
                window.location.hash.length
            )
        )

        let pictureId = params.get('picture')

        if(pictureId === null) { return }
        if(typeof previewImgBoxList[pictureId] === 'undefined') {
            viewPageActive()
            imgBox.innerText = 'not found image'
            return
        }

        let top = previewImgBoxList[pictureId].offsetTop
        window.scrollTo({
            top: top - (window.innerHeight / 3),
            behavior: 'smooth'
        })

        viewFullImage(pictureId)
    }
    readURL()

    /**
     * 
     * @param {string} url 
     */
    function changeURL(url) {
        if(url.length === 0) {
            window.history.pushState({}, '', `${window.location.origin}`);
            return
        }
        window.history.pushState({}, '', `${window.location.origin}/#${url}`);
    }
})