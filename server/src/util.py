import string
import json

def endsWithAnyOf(word, tokens):
    for letter in tokens:
        if word.endswith(letter):
            return True
    return False


def extract_segments(ser_deepgram_payload):
    # extract tokens
    transcript = ser_deepgram_payload["results"]["channels"][0]["alternatives"][0]
    word_segments = (
        []
    )  # will contain extracted phrases from transcription with some meta info {phrase: "", meta: {start: x, end: y}}

    phrase_markers = "?.!,"
    collection = {"start": "", "end": "", "text": ""}

    for data in transcript["words"]:
        collection["text"] = f'{collection["text"]} {data["word"]}'
        if collection["start"] == "":
            collection["start"] = data["start"]
        if endsWithAnyOf(data["punctuated_word"], phrase_markers):
            collection["end"] = data["end"]
            word_segments.append(collection)
            collection = {"start": "", "end": "", "text": ""}

    return word_segments
