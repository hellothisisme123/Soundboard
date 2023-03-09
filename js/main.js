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


let soundItems = []

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

soundItems.push(appleNoti)
soundItems.push(androidNoti)
soundItems.push(windows10Noti)



// reorders to add cutom new sounds wrapper
let customSoundsWrapper = wrapper.children[1].cloneNode(true) 
wrapper.children[1].remove()
wrapper.appendChild(customSoundsWrapper)




// add custom sound
const addSound = document.querySelector('.addSound'),
reorderRemove = document.querySelector('.reorderRemove')

addSound.addEventListener('click', (e) => {

})