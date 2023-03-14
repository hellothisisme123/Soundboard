const wrapper = document.querySelector('.wrapper')

class soundItem {
    constructor(settings) {
        this.min = settings.min
        this.max = settings.max
        this.default = settings.default
        this.title = settings.title
        this.imgPath = settings.imgPath
        this.currentTimeDelay = settings.default
        this.audioPath = settings.audioPath
        this.audio = new Audio(this.audioPath)
        
        this.soundItemWrapper = document.querySelector('.soundItem.innactive').cloneNode(1)
        this.heading = this.soundItemWrapper.querySelector('h1')
        this.delayInput = this.soundItemWrapper.querySelector('.rangeInput')
        this.delayLabel = this.soundItemWrapper.querySelector('.timeInputLabel')
        this.delayLabelValue = this.soundItemWrapper.querySelector('.timeInputLabelValue')
        this.playBtn = this.soundItemWrapper.querySelector('button')
        this.img = this.soundItemWrapper.querySelector('img')


        
        this.delayInput.min = this.min
        this.delayInput.max = this.max
        this.delayInput.value = this.default
        this.delayLabelValue.innerText = `${this.default}s`
        this.heading.innerText = this.title
        this.soundItemWrapper.classList.remove('innactive')
        this.img.src = this.imgPath
        this.img.alt = this.title

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



// let appleNoti = new soundItem({
//     'min': 0,
//     'max': 60,
//     'default': 0,
//     'title': 'Apple Notification',
//     'imgPath': './production/images/apple.png',
//     'audioPath': '../production/sounds/appleNoti.mp3'
// })

// let androidNoti = new soundItem({
//     'min': 0,
//     'max': 60,
//     'default': 0,
//     'title': 'Android Notification',
//     'imgPath': './production/svg/Android_robot.svg',
//     'audioPath': '../production/sounds/samsungNoti.mp3'
// })

// let windows10Noti = new soundItem({
//     'min': 0,
//     'max': 60,
//     'default': 0,
//     'title': 'Windows 10 Notification',
//     'imgPath': './production/svg/windowsLogo.svg',
//     'audioPath': '../production/sounds/windows10Noti.mp3'
// })

// let windowsXpError = new soundItem({
//     'min': 0,
//     'max': 60,
//     'default': 0,
//     'title': 'Windows XP Error',
//     'imgPath': './production/images/windowsXPLogo.png',
//     'audioPath': '../production/sounds/windowsXPError.mp3'
// })



// indexedDB
let soundItems = []

const indexedDB = window.indexedDB
const request = indexedDB.open("soundboardDB", 2)

request.onerror = (err) => {
    console.error(err)
}

request.onupgradeneeded = () => {
    console.log('database upgraded succesfully');
    const db = request.result
    const store = db.createObjectStore('sounds', {keyPath: 'title'})
    
    store.createIndex("title", ['title'], {unique: false})
}

request.onsuccess = () => {
    console.log('database successfully loaded')
    const db = request.result
    const transaction = db.transaction('sounds', 'readwrite')
    const store = transaction.objectStore('sounds')
    
    const titleIndex = store.index('title')
    // pulls items from database and pushes them to soundItems

    let allItems = titleIndex.getAll()
    allItems.onsuccess = () => {
        console.log(allItems.result.length)
        if (allItems.result.length == 0) {
            // indexedDB
            const db = request.result
            const transaction = db.transaction('sounds', 'readwrite')
            const store = transaction.objectStore('sounds')

            store.put({
                'title': 'Apple Notification',
                'img': './production/images/Apple.png',
                'audio': '../production/sounds/appleNoti.mp3'
            })

            store.put({
                'title': 'Android Notification',
                'img': './production/svg/Android_robot.svg',
                'audio': '../production/sounds/samsungNoti.mp3',
            })

            store.put({
                'title': 'Windows 10 Notification',
                'img': './production/svg/windowsLogo.svg',
                'audio': '../production/sounds/windows10Noti.mp3',
            })

            store.put({
                'title': 'Windows XP Error',
                'img': './production/images/windowsXPLogo.png',
                'audio': '../production/sounds/windowsXPError.mp3',
            })
        }
        // HERE ITS BREAKING
        let allItemsWithDefaults = titleIndex.getAll()
        allItemsWithDefaults.onsuccess = () => {
            console.log(allItemsWithDefaults.result)
            allItemsWithDefaults.result.forEach(item => {
                soundItems.push(new soundItem({
                    'min': 0,
                    'max': 60,
                    'default': 0,
                    'title': item.title,
                    'imgPath': item.img,
                    'audioPath': item.audio
                }))
            })
    
            wrapper.appendChild(addSoundsWrapper)
        }
    }
    
}




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

// reorders to add cutom new sounds wrapper
wrapper.appendChild(addSoundsWrapper)

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
    if (e.target.value.length > 50) {
        e.target.value = e.target.value.slice(0, -(e.target.value.length - 50))
    }
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
        'title': newSoundItem.title,
        'imgPath': newSoundItem.img,
        'audioPath': newSoundItem.audio
    }))
    soundCreatorWrapper.classList.remove('active')

    // reorders to add cutom new sounds wrapper
    wrapper.appendChild(addSoundsWrapper)



    // indexedDB
    const db = request.result
    const transaction = db.transaction('sounds', 'readwrite')
    const store = transaction.objectStore('sounds')

    soundItems.forEach(item => {
        item = {
            'img': item.imgPath,
            'title': item.title,
            'audio': item.audioPath
        }
        store.put(item)

        store.onsuccess = () => {
            console.log(store.result)
        }
    })
    // store.put(newSoundItem)



})