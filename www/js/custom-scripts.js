const btnStartListener = document.getElementById("btnStartListener");
const volDisplay = document.getElementById("volDisplay");

let audioCtx = null;
let audioStream = null;
let isListening = false;

// THIS FUNCTION TRICK FORCES ANDROID TO WAKE UP AND MAKE SOUND
const playBeep = () => {
  try {
    // 1. Force the creation of a brand new, clean AudioContext inside this thread
    const ContextClass = window.AudioContext || window.webkitAudioContext;
    const context = new ContextClass();

    // 2. Build the oscillator beep
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(800, context.currentTime);

    // Max out the web volume node explicitly
    gainNode.gain.setValueAtTime(1.0, context.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    // Keep it ringing for 3 seconds so you can clearly hear it!
    oscillator.stop(context.currentTime + 3.0);

    console.log("Audio blast executed!");
  } catch (e) {
    console.error("Audio trigger failed: ", e);
  }
};

const detectClap = (analyzer, dataArray) => {
  if (!isListening) return; // Stop loop if listener turned off

  analyzer.getByteFrequencyData(dataArray);
  let volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

  if (volDisplay) {
    volDisplay.innerText = Math.round(volume);
  }

  // LOWER THE THRESHOLD SENSITIVITY: 140 is extremely high for some phone mics.
  // Lowering this to 60 ensures it actually trips when you make noise!
  if (volume > 60) {
    playBeep();
    stopListening(); // Stop listening once triggered so it doesn't loop forever
    return;
  }
  requestAnimationFrame(() => detectClap(analyzer, dataArray));
};

const stopListening = () => {
  isListening = false;
  if (audioStream) {
    audioStream.getTracks().forEach((track) => track.stop());
    audioStream = null;
  }

  btnStartListener.innerText = "Activate Listener";
  btnStartListener.classList.remove("btn-danger");
  btnStartListener.classList.add("btn-primary");
};

btnStartListener.addEventListener("click", async () => {
  if (isListening) {
    stopListening();
    return;
  }
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    isListening = true;

    btnStartListener.innerText = "Stop Listener";
    btnStartListener.classList.remove("btn-primary");
    btnStartListener.classList.add("btn-danger");

    const audioContext = new (
      window.AudioContext || window.webkitAudioContext
    )();

    // --- INTENTIONAL WAKE UP ---
    // This empty play forces Android to register that the user explicitly authorized audio playback
    const buffer = audioContext.createBuffer(1, 1, 22050);
    const node = audioContext.createBufferSource();
    node.buffer = buffer;
    node.connect(audioContext.destination);
    node.start(0);

    const source = audioContext.createMediaStreamSource(audioStream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 256;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    detectClap(analyser, dataArray);
  } catch (error) {
    console.error("Error starting listener:", error);
    alert("Microphone permission denied or initialization error");
  }
});
