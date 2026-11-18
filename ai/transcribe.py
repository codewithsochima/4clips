
import sys
import json
from faster_whisper import WhisperModel


def transcribe_video(video_path):
    # Load the AI model using your computer's CPU
    model = WhisperModel(
        "base",
        device="cpu",
        compute_type="int8"
    )

    # Convert the video's speech into text
    segments, info = model.transcribe(
        video_path,
        beam_size=5,
        vad_filter=True
    )

    # Store each spoken section with its timestamps
    transcript = []

    for segment in segments:
        transcript.append({
            "start": round(segment.start, 2),
            "end": round(segment.end, 2),
            "text": segment.text.strip()
        })

    # Prepare the final result
    result = {
        "language": info.language,
        "language_probability": round(info.language_probability, 3),
        "segments": transcript
    }

    print(json.dumps(result, ensure_ascii=False))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Please provide a video file path"}))
        sys.exit(1)

    transcribe_video(sys.argv[1])
