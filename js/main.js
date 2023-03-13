const wrapper = document.querySelector('.wrapper')

class soundItem {
    constructor(settings) {
        this.min = settings.min
        this.max = settings.max
        this.default = settings.default
        this.name = settings.name
        this.imgPath = settings.imgPath
        this.currentTimeDelay = settings.default
        this.audioPath = settings.audioPath
        this.audio = new Audio(this.audioPath)
        
        this.soundItemWrapper = document.querySelector('.soundItem.innactive').cloneNode(1)
        this.title = this.soundItemWrapper.querySelector('h1')
        this.delayInput = this.soundItemWrapper.querySelector('.rangeInput')
        this.delayLabel = this.soundItemWrapper.querySelector('.timeInputLabel')
        this.delayLabelValue = this.soundItemWrapper.querySelector('.timeInputLabelValue')
        this.playBtn = this.soundItemWrapper.querySelector('button')
        this.img = this.soundItemWrapper.querySelector('img')


        
        this.delayInput.min = this.min
        this.delayInput.max = this.max
        this.delayInput.value = this.default
        this.delayLabelValue.innerText = `${this.default}s`
        this.title.innerText = this.name
        this.soundItemWrapper.classList.remove('innactive')
        this.img.src = this.imgPath
        this.img.alt = this.name

        this.delayInput.addEventListener('change', (e) => {
            this.changeInputValue(e)
        })

        this.playBtn.addEventListener('click', (e) => {
            this.playSound()
        })

        wrapper.appendChild(this.soundItemWrapper)
        // console.log(this)
    }

    changeInputValue(e) {
        this.currentTimeDelay = this.delayInput.value
        this.delayLabelValue.innerText = `${this.currentTimeDelay}s`
    }

    playSound() {
        // when there's no delay
        if (this.delayInput.value < 1) {
            this.audio.cloneNode(true).play()
            return
        }

        // instantly drops the value
        this.delayInput.value -= 1
        this.changeInputValue()

        // decrements until the value is 0
        let tmp = setInterval(() => {
            this.delayInput.value -= 1
            this.changeInputValue()

            if (this.delayInput.value < 1) {
                clearInterval(tmp)
                this.audio.cloneNode(true).play()
            }
        }, 1000);
    }
}



let appleNoti = new soundItem({
    'min': 0,
    'max': 60,
    'default': 0,
    'name': 'Apple Notification',
    'imgPath': './production/images/apple.png',
    'audioPath': '../production/sounds/appleNoti.mp3'
})

let androidNoti = new soundItem({
    'min': 0,
    'max': 60,
    'default': 0,
    'name': 'Android Notification',
    'imgPath': './production/svg/Android_robot.svg',
    'audioPath': '../production/sounds/samsungNoti.mp3'
})

let windows10Noti = new soundItem({
    'min': 0,
    'max': 60,
    'default': 0,
    'name': 'Windows 10 Notification',
    'imgPath': './production/svg/windowsLogo.svg',
    'audioPath': '../production/sounds/windows10Noti.mp3'
})

let windowsXpError = new soundItem({
    'min': 0,
    'max': 60,
    'default': 0,
    'name': 'Windows XP Error',
    'imgPath': './production/images/windowsXPLogo.png',
    'audioPath': '../production/sounds/windowsXPError.mp3'
})

let soundItems = []
soundItems.push(appleNoti)
soundItems.push(androidNoti)
soundItems.push(windows10Noti)
soundItems.push(windowsXpError)


// reorders to add cutom new sounds wrapper
let customSoundsWrapper = wrapper.children[1].cloneNode(true) 
wrapper.children[1].remove()
wrapper.appendChild(customSoundsWrapper)




// add custom sound
const addSound = document.querySelector('.addSound'),
reorderRemove = document.querySelector('.reorderRemove'),
soundCreatorWrapper = document.querySelector('.soundCreatorWrapper'),
quitSoundBtn = document.querySelector('.quitSoundBtn'),
uploadSoundInput = document.querySelector('.uploadSoundInput'),
thumbnailUploadInput = document.querySelector('.thumbnailUploadInput'),
thumbnailImg = document.querySelector('.thumbnailImg'),
titleInput = document.querySelector('.titleInput'),
testSoundBtn = document.querySelector('.testSoundBtn'),
saveSoundBtn = document.querySelector('.saveSoundBtn'),
addSoundsWrapper = document.querySelector('.addSoundsWrapper')

let newSoundItem = {
    'title': '',
    'img': '',
    'audio': ''
}
addSound.addEventListener('click', (e) => {
    titleInput.value = ''
    newSoundItem = {
        'title': '',
        'img': '',
        'audio': ''
    }
    thumbnailImg.src = './production/images/apple.png'
    soundCreatorWrapper.classList.add('active')
})

quitSoundBtn.addEventListener('click', (e) => {
    soundCreatorWrapper.classList.remove('active')
})

titleInput.addEventListener('change', (e) => {
    newSoundItem.title = e.target.value
})

thumbnailUploadInput.addEventListener('change', (e) => {
    const fileReader = new FileReader()

    // converts to base64 as result
    fileReader.readAsDataURL(e.target.files[0])
    fileReader.onload = () => {
        // sets the src of the image to the base64 image code
        // the image was already there but didn't render since there was no src
        newSoundItem.img = fileReader.result
        thumbnailImg.src = newSoundItem.img
    }
    fileReader.onerror = (err) => {
        console.error(err)
    }
})

uploadSoundInput.addEventListener('change', (e) => {
    const fileReader = new FileReader()

    // converts to base64 as result
    fileReader.readAsDataURL(e.target.files[0])
    fileReader.onload = () => {
        // sets the src of the image to the base64 image code
        // the image was already there but didn't render since there was no src

        newSoundItem.audio = fileReader.result
        let newSound = new Audio(newSoundItem.audio)
        newSound.cloneNode(1).play()
    }
    fileReader.onerror = (err) => {
        console.error(err)
    }
})

testSoundBtn.addEventListener('click', (e) => {
    // tests the sound by playing it
    let tmp = new Audio(newSoundItem.audio)
    tmp.cloneNode(1).play()
})

saveSoundBtn.addEventListener('click', (e) => {
    // data inputted incorectly
    if (
        newSoundItem.title == '' ||
        newSoundItem.img == '' ||
        newSoundItem.audio == ''
    ) {
        let wrongDataError = document.createElement('div')
        wrongDataError.classList.add('wrongDataError')
        wrongDataError.innerHTML = 'You must insert all data (title, image, audio)'
        wrapper.appendChild(wrongDataError)
        setTimeout(() => {
            wrongDataError.remove()
        }, 1000);
        return
    }

    // pushes the new soundItem into the soundItems
    soundItems.push(new soundItem({
        'min': 0,
        'max': 60,
        'default': 0,
        'name': newSoundItem.title,
        'imgPath': newSoundItem.img,
        'audioPath': newSoundItem.audio
    }))
    soundCreatorWrapper.classList.remove('active')

    // reorders to add cutom new sounds wrapper
    let customSoundsWrapper = addSoundsWrapper.cloneNode(true) 
    addSoundsWrapper.remove()
    wrapper.appendChild(customSoundsWrapper)
})