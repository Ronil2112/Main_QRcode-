let synth = window.speechSynthesis;
window.speechSynthesis.onvoiceschanged = () => { };

let isPlaying = false;
let isPaused = false;
let currentIndex = 0;

const sentences = [
    "The painting portrays a young girl in side profile, standing calmly with a serene expression.",
    "Her long flowing hair and textured blue dress are beautifully detailed with soft brushstrokes.",
    "The light green background contrasts gently with her figure, adding a peaceful mood to the artwork.",
    "The composition captures the innocence and quiet strength of childhood with grace.",
    "The realistic style and subtle colors reflect the artist’s delicate and thoughtful approach."
];

function speakSentence(index) {
    if (index >= sentences.length) {
        isPlaying = false;
        isPaused = false;
        currentIndex = 0; // Reset for next play
        updatePlayButton();
        return;
    }
    
    

    const sentence = sentences[index];
    const utterance = new SpeechSynthesisUtterance(sentence);
    const subtitleBox = document.getElementById("subtitle-box");
    const progressFill = document.getElementById("progressFill");

    // Show subtitle
    subtitleBox.innerHTML = sentence;

    // Use male voice if available
    const voices = synth.getVoices().filter(v => v.name.toLowerCase().includes("male"));
    if (voices.length > 0) utterance.voice = voices[0];

    // Estimate duration
    const wordCount = sentence.split(" ").length;
    const estimatedDuration = wordCount * 330; // ~330ms per word
    progressFill.style.width = "0%";

    // Animate progress bar
    let startTime = Date.now();
    const progressInterval = setInterval(() => {
        if (!isPlaying || isPaused) {
            clearInterval(progressInterval);
            return;
        }
        const elapsed = Date.now() - startTime;
        const percent = Math.min((elapsed / estimatedDuration) * 100, 100);
        progressFill.style.width = percent + "%";
        if (percent >= 100) clearInterval(progressInterval);
    }, 50);

    utterance.onend = () => {
        progressFill.style.width = "100%";
        currentIndex++;
        speakSentence(currentIndex);
    };

    currentIndex = index;
    isPlaying = true;
    isPaused = false;
    updatePlayButton();
    synth.speak(utterance);
}

function togglePlay() {
    if (isPlaying && !isPaused) {
        pauseSpeaking();
    } else {
        speakSentence(currentIndex);
    }
}

function pauseSpeaking() {
    if (synth.speaking) {
        synth.cancel();
        isPaused = true;
        isPlaying = false;
        updatePlayButton();
    }
}

function rewind() {
    if (currentIndex > 0) {
        synth.cancel();
        currentIndex--;
        speakSentence(currentIndex);
    }
}

function forward() {
    if (currentIndex < sentences.length - 1) {
        synth.cancel();
        currentIndex++;
        speakSentence(currentIndex);
    }
}

function updatePlayButton() {
    const playBtn = document.querySelector("#playBtn img");
    playBtn.src = isPlaying ? "image 2/play.png" : "image 2/pause.png";
}

document.getElementById("playBtn").addEventListener("click", togglePlay);
document.getElementById("rewindBtn").addEventListener("click", rewind);
document.getElementById("forwardBtn").addEventListener("click", forward);
