document.addEventListener('DOMContentLoaded', function () {
    const synth = window.speechSynthesis;
    const textElement = document.getElementById('textToSpeak');
    const voiceSelect = document.getElementById('voiceSelect');
    const playBtn = document.getElementById('playBtn');
    const stopBtn = document.getElementById('stopBtn');
    const volumeRange = document.getElementById('volumeRange');
    let voices = [];

    function populateVoiceList() {
        voices = synth.getVoices().filter(voice => voice.lang.includes('pt'));
        voiceSelect.innerHTML = '';
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = `${voice.name}`;
            option.setAttribute('data-name', voice.name);
            option.setAttribute('data-lang', voice.lang);
            voiceSelect.appendChild(option);
        });
    }

    populateVoiceList();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoiceList;
    }

    playBtn.addEventListener('click', () => {
        const textToSpeak = textElement.getAttribute('data-speech-text') || textElement.textContent;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        const selectedVoiceName = voiceSelect.selectedOptions[0].getAttribute('data-name');
        utterance.volume = volumeRange.value / 100;

        voices.forEach(voice => {
            if (voice.name === selectedVoiceName) {
                utterance.voice = voice;
            }
        });

        synth.speak(utterance);
    });

    stopBtn.addEventListener('click', () => {
        synth.cancel();
    });

    volumeRange.addEventListener('input', () => {
        if (synth.speaking) {
            synth.cancel();  // Stop current speech
            const textToSpeak = textElement.getAttribute('data-speech-text') || textElement.textContent;
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            const selectedVoiceName = voiceSelect.selectedOptions[0].getAttribute('data-name');
            utterance.volume = volumeRange.value / 100;

            voices.forEach(voice => {
                if (voice.name === selectedVoiceName) {
                    utterance.voice = voice;
                }
            });

            synth.speak(utterance);  // Restart with new volume
        }
    });
});