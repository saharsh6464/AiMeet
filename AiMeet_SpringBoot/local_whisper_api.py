from faster_whisper import WhisperModel
from flask import Flask, request, jsonify
import os
import tempfile

app = Flask(__name__)

# Load the model once at startup (you can pick "small", "medium", or "large-v3")
model = WhisperModel("base", device="cpu", compute_type="int8")  # use "cuda" if you have a GPU

@app.route("/v1/audio/transcriptions", methods=["POST"])
def transcribe_audio():
    if "file" not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    file = request.files["file"]

    # Save the file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        file.save(tmp.name)
        audio_path = tmp.name

    # Transcribe
    segments, info = model.transcribe(audio_path)
    transcription = "".join([segment.text for segment in segments])

    # Cleanup
    os.remove(audio_path)

    return jsonify({
        "text": transcription,
        "language": info.language,
        "duration": info.duration,
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005)
