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

// PSBTs to use

// Unsigned singlesig PSBT
const psbtBase64Single = 'cHNidP8BAHECAAAAAQ37amDsUTaHpAuczGSTBvj6La+paXr+TMSiHZfxZiszAAAAAAD9////AlDDAAAAAAAAFgAUzAwtZc+7esvXIA81p6oMxS7Cc0ZRjAgAAAAAABYAFEThJd9+5M46NGXpux6eWTDwi1bnugoAAAABAIYCAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////wUCpAcBAf////8CL1AJAAAAAAAWABR72MmJodIZyxlgOIc3+O3qxiZcUgAAAAAAAAAAJmokqiGp7eL2HD9x0d79P6mZ36NpU3VcaQaJeZlitIvr2DaXToz5AAAAAAEBHy9QCQAAAAAAFgAUe9jJiaHSGcsZYDiHN/jt6sYmXFIiBgOBlaRA4leGn7QIjZzb9TCD4N6pFbhla/9Tqm3aUBGEnBiMJKUQVAAAgAEAAIAAAACAAAAAABsAAAAAACICAui8o6vE2zfBZiQpNEF7CAxQccYld4eSdfYOQlJEQEwZGIwkpRBUAACAAQAAgAAAAIABAAAAFQAAAAA='
// This is the signed PSBT
// cHNidP8BAHECAAAAAQ37amDsUTaHpAuczGSTBvj6La+paXr+TMSiHZfxZiszAAAAAAD9////AlDDAAAAAAAAFgAUzAwtZc+7esvXIA81p6oMxS7Cc0ZRjAgAAAAAABYAFEThJd9+5M46NGXpux6eWTDwi1bnugoAAAABAIYCAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////wUCpAcBAf////8CL1AJAAAAAAAWABR72MmJodIZyxlgOIc3+O3qxiZcUgAAAAAAAAAAJmokqiGp7eL2HD9x0d79P6mZ36NpU3VcaQaJeZlitIvr2DaXToz5AAAAAAEBHy9QCQAAAAAAFgAUe9jJiaHSGcsZYDiHN/jt6sYmXFIiAgOBlaRA4leGn7QIjZzb9TCD4N6pFbhla/9Tqm3aUBGEnEcwRAIgCWfubINbaqkmQcUtyo2mYB7CiuIjZQAidxiR5qWX0LECICwqe8qKHU8wAEEQUREvA+px66P3MLzF0tbSyqNfC8SrASIGA4GVpEDiV4aftAiNnNv1MIPg3qkVuGVr/1OqbdpQEYScGIwkpRBUAACAAQAAgAAAAIAAAAAAGwAAAAAAIgIC6Lyjq8TbN8FmJCk0QXsIDFBxxiV3h5J19g5CUkRATBkYjCSlEFQAAIABAACAAAAAgAEAAAAVAAAAAA==

// Unsigned multisig PSBT
const psbtBase64Multi = 'cHNidP8BAH0CAAAAASyv94BkTFa1YffINML5et/+EVDdMQJm5hB+aSA/trtBAgAAAAD9////ApcQAQAAAAAAIgAgdyszWtC6/qgHiR7bvhpLWw3Q2JKpjxKY5WLk+f6ORKQwdQAAAAAAABYAFMwMLWXPu3rL1yAPNaeqDMUuwnNGugoAAE8BBDWHzwSUBpH+gAAAAh8YCbNHWagazb0ozk6whPGtPubZcIDweTjLQlkW4kMjAjKvSEgprmFJf9tCsB17rVSWXCmgf3JJ1REFMmGD+RTWFB6c+KcwAACAAQAAgAAAAIACAACATwEENYfPBAuvP0iAAAACweIfqbu1bH4rpgh2qwgt/MexXDaJ4mKGT6zdZFoY9UUDoEA0M+MlXadOfU8w0q0Twkt/9HNKOsQRlir52AVhdn0UjCSlEDAAAIABAACAAAAAgAIAAIBPAQQ1h88EAPw/IIAAAAIQmYrkj9TKyy+bqE6VICMJRz8mjCWb/x61AFcS9UIfiwLnXy5A+T0eiSrKGUjNoBSmdFKXie5YUDVxjDe6Q0ZM0RRZlnz9MAAAgAEAAIAAAACAAgAAgAABALsCAAAAASEYvwjP5ongp+qKwXzxzZs34G+XWbmRxOhusnRpHxDgAgAAAAD9////BFDDAAAAAAAAFgAUYtpvUJWlKzQMGupTEzQTZK+8Lo7kysodAAAAABYAFPH5hFcNPIxHh34yOVQRsNiW1O27oIYBAAAAAAAiACCpKDxzVmbwci1Lcghwg/6cg1/LXEv3LZlIGHh6pPwiMCBOAAAAAAAAFgAUIi9uGm656UMIMS2/f2HZuloMZLSKCAAAAQEroIYBAAAAAAAiACCpKDxzVmbwci1Lcghwg/6cg1/LXEv3LZlIGHh6pPwiMAEFaVIhAlPUM2i99d0bdUO9aa9RPa3mQ4r3VmDFmBqnjE3Y8cTuIQKZ3zTubJrvui9M6LYJSJx/PqSULZmLXhHyNPnuMpJR+iECzBx18v8Ck+AC7zP2XgDzq2uAO/gnEgDh7FLbWmzb+0tTriIGAlPUM2i99d0bdUO9aa9RPa3mQ4r3VmDFmBqnjE3Y8cTuHIwkpRAwAACAAQAAgAAAAIACAACAAAAAAAsAAAAiBgKZ3zTubJrvui9M6LYJSJx/PqSULZmLXhHyNPnuMpJR+hwenPinMAAAgAEAAIAAAACAAgAAgAAAAAALAAAAIgYCzBx18v8Ck+AC7zP2XgDzq2uAO/gnEgDh7FLbWmzb+0scWZZ8/TAAAIABAACAAAAAgAIAAIAAAAAACwAAAAABAWlSIQI0Hfsn3BbKslMuKtV5DG1/2KzyPJiwGC9B8sLkY1acjyEDrK0SiasQdrvQYmYuqL0w2ulpHnyJnhNRLBZbmwMpP3AhA+cduOOY0LDbTBAI5g6moSjxnC92Hlrf5qRLSbk5KfvQU64iAgI0Hfsn3BbKslMuKtV5DG1/2KzyPJiwGC9B8sLkY1acjxyMJKUQMAAAgAEAAIAAAACAAgAAgAEAAAABAAAAIgIDrK0SiasQdrvQYmYuqL0w2ulpHnyJnhNRLBZbmwMpP3AcWZZ8/TAAAIABAACAAAAAgAIAAIABAAAAAQAAACICA+cduOOY0LDbTBAI5g6moSjxnC92Hlrf5qRLSbk5KfvQHB6c+KcwAACAAQAAgAAAAIACAACAAQAAAAEAAAAAAA=='
// This is the signed PSBT
// cHNidP8BAH0CAAAAASyv94BkTFa1YffINML5et/+EVDdMQJm5hB+aSA/trtBAgAAAAD9////ApcQAQAAAAAAIgAgdyszWtC6/qgHiR7bvhpLWw3Q2JKpjxKY5WLk+f6ORKQwdQAAAAAAABYAFMwMLWXPu3rL1yAPNaeqDMUuwnNGugoAAE8BBDWHzwSUBpH+gAAAAh8YCbNHWagazb0ozk6whPGtPubZcIDweTjLQlkW4kMjAjKvSEgprmFJf9tCsB17rVSWXCmgf3JJ1REFMmGD+RTWFB6c+KcwAACAAQAAgAAAAIACAACATwEENYfPBAuvP0iAAAACweIfqbu1bH4rpgh2qwgt/MexXDaJ4mKGT6zdZFoY9UUDoEA0M+MlXadOfU8w0q0Twkt/9HNKOsQRlir52AVhdn0UjCSlEDAAAIABAACAAAAAgAIAAIBPAQQ1h88EAPw/IIAAAAIQmYrkj9TKyy+bqE6VICMJRz8mjCWb/x61AFcS9UIfiwLnXy5A+T0eiSrKGUjNoBSmdFKXie5YUDVxjDe6Q0ZM0RRZlnz9MAAAgAEAAIAAAACAAgAAgAABALsCAAAAASEYvwjP5ongp+qKwXzxzZs34G+XWbmRxOhusnRpHxDgAgAAAAD9////BFDDAAAAAAAAFgAUYtpvUJWlKzQMGupTEzQTZK+8Lo7kysodAAAAABYAFPH5hFcNPIxHh34yOVQRsNiW1O27oIYBAAAAAAAiACCpKDxzVmbwci1Lcghwg/6cg1/LXEv3LZlIGHh6pPwiMCBOAAAAAAAAFgAUIi9uGm656UMIMS2/f2HZuloMZLSKCAAAAQEroIYBAAAAAAAiACCpKDxzVmbwci1Lcghwg/6cg1/LXEv3LZlIGHh6pPwiMCICAlPUM2i99d0bdUO9aa9RPa3mQ4r3VmDFmBqnjE3Y8cTuRzBEAiAfY3WEk6ar7mQQ3aO/bagiZu/RbnUUYgXG9Si7u+Q7tAIgU8SKWzqqzKGIRZLGV8PPbaGH8iib9mU4k7cSVb/1de4BAQVpUiECU9QzaL313Rt1Q71pr1E9reZDivdWYMWYGqeMTdjxxO4hApnfNO5smu+6L0zotglInH8+pJQtmYteEfI0+e4yklH6IQLMHHXy/wKT4ALvM/ZeAPOra4A7+CcSAOHsUttabNv7S1OuIgYCU9QzaL313Rt1Q71pr1E9reZDivdWYMWYGqeMTdjxxO4cjCSlEDAAAIABAACAAAAAgAIAAIAAAAAACwAAACIGApnfNO5smu+6L0zotglInH8+pJQtmYteEfI0+e4yklH6HB6c+KcwAACAAQAAgAAAAIACAACAAAAAAAsAAAAiBgLMHHXy/wKT4ALvM/ZeAPOra4A7+CcSAOHsUttabNv7SxxZlnz9MAAAgAEAAIAAAACAAgAAgAAAAAALAAAAAAEBaVIhAjQd+yfcFsqyUy4q1XkMbX/YrPI8mLAYL0HywuRjVpyPIQOsrRKJqxB2u9BiZi6ovTDa6WkefImeE1EsFlubAyk/cCED5x2445jQsNtMEAjmDqahKPGcL3YeWt/mpEtJuTkp+9BTriICAjQd+yfcFsqyUy4q1XkMbX/YrPI8mLAYL0HywuRjVpyPHIwkpRAwAACAAQAAgAAAAIACAACAAQAAAAEAAAAiAgOsrRKJqxB2u9BiZi6ovTDa6WkefImeE1EsFlubAyk/cBxZlnz9MAAAgAEAAIAAAACAAgAAgAEAAAABAAAAIgID5x2445jQsNtMEAjmDqahKPGcL3YeWt/mpEtJuTkp+9AcHpz4pzAAAIABAACAAAAAgAIAAIABAAAAAQAAAAAA

// Helper functions 

// Convert PSBT in base64 to byte array
function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64)
    const len = binaryString.length // Number of bytes
    let bytes = new Uint8Array(len)
    bytes = bytes.map((_, i) => binaryString.charCodeAt(i))
    return bytes.buffer
}
  
// Convert byte array back to a PSBT in base64
function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    const charCodes = Array.from(bytes).map(byte => String.fromCharCode(byte));
    return btoa(charCodes.join(''));
}
  
const psbtBytes = base64ToArrayBuffer(psbtBase64Multi)

function signPsbt() {
    jade.start(() => {
        jade.sign_psbt(psbtBytes, psbtSignedSuccessfully)
    }, failureToFindSerialPort)
}

function psbtSignedSuccessfully(psbt) {
    console.log(psbt)
    psbtBase64 = arrayBufferToBase64(psbt)
    console.log('This is the signed psbt:')
    console.log(psbtBase64)
}