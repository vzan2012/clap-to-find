const btnStartListener = document.getElementById("btnStartListener");
const volDisplay = document.getElementById("volDisplay");

let audioCtx,
  audioStream = null;
let isListening = false;

const playBeep = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const oscillator = audioCtx.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);

  oscillator.connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 1.5);
};

const detectClap = (analyzer, dataArray) => {
  analyzer.getByteFrequencyData(dataArray);
  let volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

  if (volDisplay) {
    volDisplay.innerText = Math.round(volume);
  }

  if (volume > 140) {
    playBeep();
  }
  requestAnimationFrame(() => detectClap(analyzer, dataArray));
};

const stopListening = () => {
  isListening = false;
  if (audioStream) {
    audioStream.getTracks().forEach((track) => track.stop());
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

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(audioStream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 256;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    detectClap(analyser, dataArray);
  } catch (error) {
    console.error("Error starting listener:", error);
    alert("Microphone permission denied");
  }
});
