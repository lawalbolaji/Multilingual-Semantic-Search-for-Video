from deepgram import Deepgram
import asyncio, json, os
from dotenv import load_dotenv

load_dotenv()

dg_key = os.environ["DEEPGRAM_KEY"]
dg = Deepgram(dg_key)

# Feel free to modify your model's parameters as you wish!
options = {"punctuate": True, "model": "general", "tier": "nova"}


# This function is what calls on the model to transcribe
def transcribe_audio(DIRECTORY = ".", MIMETYPE = "mp3"):
    audio_folder = os.listdir(DIRECTORY)
    for audio_file in audio_folder:
        if audio_file.endswith(MIMETYPE):
            with open(f"{DIRECTORY}/{audio_file}", "rb") as f:
                source = {"buffer": f, "mimetype": "audio/" + MIMETYPE}
                res = dg.transcription.sync_prerecorded(source, options)
                with open(f"./{audio_file[:-4]}.json", "w") as transcript:
                    json.dump(res, transcript)
    # return

# main()