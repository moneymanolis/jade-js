const getXpubBtn = document.getElementById('get-xpub-btn')
const displayXpubContainer = document.getElementById('display-xpub')
const xpubElement = document.getElementById('xpub')

const getFingerprintBtn = document.getElementById('get-fingerprint-btn')
const displayFingerprintContainer = document.getElementById('display-fingerprint')
const fingerprintElement = document.getElementById('fingerprint')

async function showXpub(path) {
    console.log('This is the path:' + path)
    spinner.classList.remove('hidden')
    getXpubBtn.classList.add('hidden')
    let xpub = await getXpub(path)
    spinner.classList.add('hidden')
    displayXpubContainer.classList.remove('hidden')
    xpubElement.innerText = xpub
}

async function getXpub(path) {
    return new Promise((resolve, reject) => {
        jade.start(() => {
            jade.unlock(fetchUrl, () => {
                jade.get_xpub((xpub) => {
                    resolve(xpub)
                }, 'mainnet', path)
            }, 'mainnet')
        }, (error) => {
            reject(error)
        })
    })
}

async function showFingerprint() {
    spinner.classList.remove('hidden')
    getFingerprintBtn.classList.add('hidden')
    let fingerprint = await getFingerprint()
    spinner.classList.add('hidden')
    displayFingerprintContainer.classList.remove('hidden')
    fingerprintElement.innerText = fingerprint
}

async function getFingerprint() {
    let firstChildOfRootKey = await getXpub([0])
    const bytes = bs58.decode(firstChildOfRootKey);
    const fingerprint = Array.from(new Uint8Array(bytes.slice(5, 9))).map(b => b.toString(16).padStart(2, '0')).join('');
    return fingerprint
}