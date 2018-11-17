/** RUST CORE
 * This is the main application logic, implemented in Rust and compiled to WASM.
 * The main() function is run as a side-effect of loading that WASM, so importing
 * the project here is all that needs to be done to load the app.
 */ import '/../Cargo.toml'

// say hi from JS, just so we know that we're alive
console.log(`Started @ ${new Date().toISOString()}`)

/**
 * Handle PWA installation prompt.
 * see https://developers.google.com/web/fundamentals/app-install-banners/
 */

const inBtn = document.getElementById('pwa-install-button')
let deferredPrompt
window.addEventListener('beforeinstallprompt', ev => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  ev.preventDefault()
  // Stash the event so it can be triggered later.
  deferredPrompt = ev

  inBtn.style.display = 'block'
})

inBtn.addEventListener('click', ev => {
  inBtn.style.display = 'none'
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  deferredPrompt.userChoice.then(res => {
    if (res.outcome === 'accepted') {
      console.log('User accepted A2HS propt; PWA Installed')
    } else {
      console.log('User denied A2HS prompt; PWA installation canceled')
    }
    deferredPrompt = null
  })
})
