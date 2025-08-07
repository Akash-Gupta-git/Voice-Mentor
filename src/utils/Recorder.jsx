// src/utils/recorder.js
export async function* recordAudioStream() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

  const audioChunks = [];
  let resolve;
  const audioQueue = new Promise(r => resolve = r);

  mediaRecorder.ondataavailable = (event) => {
    audioChunks.push(event.data);
    resolve(audioChunks.shift());
  };

  mediaRecorder.start(250); // every 250ms

  while (true) {
    const chunk = await audioQueue;
    yield chunk;
  }
}
