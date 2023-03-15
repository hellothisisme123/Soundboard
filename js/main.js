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

// reorder sounds variables
const removeReorderSoundBtn = document.querySelector('.reorderRemove'),
soundReorderWrapper = document.querySelector('.soundReorderWrapper'),
reorderX = soundReorderWrapper.querySelector('.xBtn')


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
        if (allItems.result.length == 0) {
            // indexedDB
            const db = request.result
            const transaction = db.transaction('sounds', 'readwrite')
            const store = transaction.objectStore('sounds')

            store.put({
                'title': 'Apple Notification',
                'img': './production/images/Apple.png',
                'audio': '../production/sounds/appleNoti.mp3',
                'order': 1
            })

            store.put({
                'title': 'Android Notification',
                'img': './production/svg/Android_robot.svg',
                'audio': '../production/sounds/samsungNoti.mp3',
                'order': 2
            })

            store.put({
                'title': 'Windows 10 Notification',
                'img': './production/svg/windowsLogo.svg',
                'audio': '../production/sounds/windows10Noti.mp3',
                'order': 3
            })

            store.put({
                'title': 'Windows XP Error',
                'img': './production/images/windowsXPLogo.png',
                'audio': '../production/sounds/windowsXPError.mp3',
                'order': 4
            })
        }

        // recall the database to get the new information since it might've just added new items
        const db2 = request.result
        const transaction2 = db2.transaction('sounds', 'readwrite')
        const store2 = transaction2.objectStore('sounds')
        const titleIndex2 = store2.index('title')
        let allItems2 = titleIndex2.getAll()
        allItems2.onsuccess = () => {
            // pushes every sound item from the database and code into the real site as an actual item
            let sortedItems = allItems2.result
            sortedItems = sortedItems.sort((a, b) => a.order - b.order)

            sortedItems.forEach(item => {
                soundItems.push(new soundItem({
                    'min': 0,
                    'max': 60,
                    'default': 0,
                    'title': item.title,
                    'imgPath': item.img,
                    'audioPath': item.audio
                }))
            })

            soundItems.forEach(item => {
                new soundReorderThumb({
                    'img': item.imgPath,
                    'title': item.title 
                })
            })
    
            // reorders the add and remove and reorder sounds buttons
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
    thumbnailImg.src = './production/images/Apple.png'
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

    
    // adds the item into the reorder thumbs
    new soundReorderThumb({
        'img': newSoundItem.imgPath,
        'title': newSoundItem.title
    })



    // pushes item into indexedDB
    const db = request.result
    const transaction = db.transaction('sounds', 'readwrite')
    const store = transaction.objectStore('sounds')

    let allItems = store.getAll()
    allItems.onsuccess = () => {
        soundItems.forEach(item => {
            item = {
                'img': item.imgPath,
                'title': item.title,
                'audio': item.audioPath,
                'order': allItems.result.length + 1
            }
            store.put(item)
    
            store.onsuccess = () => {
                console.log(store.result)
            }
        })
    }
})





reorderX.addEventListener('click', (e) => {
    soundReorderWrapper.classList.remove('active')
})

removeReorderSoundBtn.addEventListener('click', (e) => {
    soundReorderWrapper.classList.toggle('active')

})

class soundReorderThumb {
    constructor (settings) {
        this.img = settings.img
        this.title = settings.title
        
        // adds it to the reorder wrapper
        this.newReorderThumb = document.querySelector('.soundReorderWrapper .soundItemThumb.hidden').cloneNode(true)

        
        let headerP = this.newReorderThumb.querySelector('p'),
        img = this.newReorderThumb.querySelector('img')
        
        headerP.innerHTML = this.title
        img.src = this.img
        img.alt = this.title
        
        this.newReorderThumb.classList.remove('hidden')
        soundReorderWrapper.appendChild(this.newReorderThumb)
        this.thumbRect = this.newReorderThumb.getBoundingClientRect()

        this.closeBtn = this.newReorderThumb.querySelector('.remove')
        this.closeBtn.addEventListener('click', this.removeItem)

        this.dragBtn = this.newReorderThumb.querySelector('.drag')
        this.dragBtn.addEventListener('dragstart', this.dragStart)
        this.dragBtn.addEventListener('dragend', this.dragEnd)
        this.newReorderThumb.parentElement.addEventListener('dragover', this.dragOver)
    }

    getDragAfterElement = (container, y) => {
        // https://www.youtube.com/watch?v=jfYWwQrtzzY&ab_channel=WebDevSimplified
        const draggableElements = [...container.querySelectorAll('.soundItemThumb:not(.hidden):not(.dragging)')]

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect()
            const offset = y - box.top - box.height / 2
            if (offset < 0 && offset > closest.offset) {
                return {offset: offset, element: child}
            } else {
                return closest
            }
        }, {offset: Number.NEGATIVE_INFINITY}).element
    }

    dragOver = (e) => {
        e.preventDefault();

        const afterElement = this.getDragAfterElement(this.newReorderThumb.parentElement, e.clientY)

        const dragging = this.newReorderThumb.parentElement.querySelector('.dragging')

        console.log(this.newReorderThumb)

        if (afterElement == null) {
            this.newReorderThumb.parentElement.appendChild(dragging)    
        } else {
            this.newReorderThumb.parentElement.insertBefore(dragging, afterElement)
        }
    }

    dragStart = (e) => {
        console.log('dragstart');
        e.dataTransfer.setDragImage(this.newReorderThumb, this.thumbRect.width / 2, this.thumbRect.height / 2)

        this.newReorderThumb.classList.add('dragging')
    }

    dragEnd = (e) => {
        console.log('dragend');
        this.newReorderThumb.classList.remove('dragging')
    }

    removeItem = () => {
        // main list item
        let mainSoundItem = soundItems.filter(x => x.title == this.title)

        console.log('remove item')
        // indexedDB variables
        const db = request.result
        const transaction = db.transaction('sounds', 'readwrite')
        const store = transaction.objectStore('sounds')

        // changes the order of all items ahead of it
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE
        // WORKING HERE HERE HERE

        // removes it from the database
        store.delete(this.title)

        // removes it from the reorder list
        this.newReorderThumb.remove()

        // removes it from the main list
        mainSoundItem[0].soundItemWrapper.remove();

        // removes it from the soundItems array
        delete soundItems[soundItems.indexOf(mainSoundItem[0])]
    }
}