const getXpubBtn = document.getElementById('get-xpub-btn')
const displayXpubContainer = document.getElementById('display-xpub')
const xpubElement = document.getElementById('xpub')

const getFingerprintBtn = document.getElementById('get-fingerprint-btn')
const displayFingerprintContainer = document.getElementById('display-fingerprint')
const fingerprintElement = document.getElementById('fingerprint')

const statusDevice = document.getElementById('status-device')


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
                }, 'testnet', path)
            }, 'testnet')
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

function failureToFindSerialPort() {
    let msg = 'Your Jade is not connected.'
    errorScreen(msg)
}

function psbtSignedSuccessfully(psbt) {
    console.log(psbt)
    console.log('Signing was succesful')
}

function checkStatus() {
    jade.start(() => {
        jade.get_version_info((version_info) => {
            console.log('Version information: ', version_info);
        });
    }, failureToFindSerialPort
    )
}

function unlockDevice() {
    jade.start(() => {
        jade.get_version_info((version_info) => {
            console.log('Version information: ', version_info);
            const state = version_info['JADE_STATE'];
            const network = version_info['JADE_NETWORKS'] == 'TEST' ? 'testnet' : 'mainnet'
            if (state === 'LOCKED') {
                addPinCode()
                console.log('Trying to unlock the device.')
                jade.unlock(fetchUrl, () => {
                    console.log('Jade was unlocked!')
                    statusDevice.classList.remove('hidden')
                }, network)
            }
            else if (state === 'READY') {
                alert('Device is unlocked already.')
                console.log('Device is unlocked already.')
            }
            else if (state === 'TEMP') {
                console.log('Device is used in PIN-less mode. Probably scanned a Seed QR.')
            }
        })
    }, failureToFindSerialPort)
}

// Convert PSBT in base64 to byte array
const psbtBase64 = 'cHNidP8BAHECAAAAAQ37amDsUTaHpAuczGSTBvj6La+paXr+TMSiHZfxZiszAAAAAAD9////AlDDAAAAAAAAFgAUzAwtZc+7esvXIA81p6oMxS7Cc0ZRjAgAAAAAABYAFEThJd9+5M46NGXpux6eWTDwi1bnugoAAAABAIYCAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////wUCpAcBAf////8CL1AJAAAAAAAWABR72MmJodIZyxlgOIc3+O3qxiZcUgAAAAAAAAAAJmokqiGp7eL2HD9x0d79P6mZ36NpU3VcaQaJeZlitIvr2DaXToz5AAAAAAEBHy9QCQAAAAAAFgAUe9jJiaHSGcsZYDiHN/jt6sYmXFIiBgOBlaRA4leGn7QIjZzb9TCD4N6pFbhla/9Tqm3aUBGEnBiMJKUQVAAAgAEAAIAAAACAAAAAABsAAAAAACICAui8o6vE2zfBZiQpNEF7CAxQccYld4eSdfYOQlJEQEwZGIwkpRBUAACAAQAAgAAAAIABAAAAFQAAAAA='
const psbtBytes = new Uint8Array(atob(psbtBase64).split('').map(function(c) {
    return c.charCodeAt(0);
  }));

// Convert base64-encoded PSBT to byte array
// const psbtBytes = new TextEncoder().encode(atob(psbtBase64));

  // Assuming psbt_base64 is the base64 encoded PSBT string

  
function signPsbt() {
    console.log(atob(psbtBase64))
    console.log(psbtBytes)
    jade.start(() => {
        jade.sign_psbt(psbtBytes, psbtSignedSuccessfully)
    }, failureToFindSerialPort)
}
