from typing import Annotated, Optional, List
from fastapi import FastAPI, Form, File, UploadFile, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from src.extract_audio import extract_audio_from_youtube
from src.transcribe_audio import transcribe_audio
from src.util import extract_segments
from src.embeddings import create_embeddings, get_closest_match
import json, os
from datetime import datetime
from dotenv import load_dotenv
import pickle


load_dotenv()
app = FastAPI()

origins = ["http://127.0.0.1:5173", "http://127.0.0.1:3100"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/index")
def search_index(search: str):
    doc_embeddings = pickle.load(open("doc_embeddings", "rb"))
    word_segments = pickle.load(open("word_segments", "rb"))

    if len(doc_embeddings) < 1:
        return {"status_code": 200, "status_txt": "OK", "results": []}

    good_matches = get_closest_match(search, doc_embeddings)

    results = []
    for idx, match in enumerate(good_matches):
        results.append(
            {
                "idx": idx + 1,
                "start": word_segments[match[0]]["start"],
                "text": word_segments[match[0]]["text"],
                "cosine": match[1],
            }
        )

    return {
        "status_code": 200,
        "status_txt": "OK",
        "results": results,
    }


@app.post("/upload")
def upload_vid(req: Request):
    print(req)

    return {
        "status_code": 200,
        "status_txt": "OK",
        "success": {"message": "image uploaded", "code": 200},
        "video": {
            "id": "{{$randomUUID}}",
            "name": "example",
            "extension": "mp4",
            "size": 53237,
            "date": "2014-06-04 15:32:33",
            "original_filename": "example.png",
            "filename": "example.png",
            "mime": "video/mp4",
            "url": "../public/vid.mp4",
        },
    }


@app.get("/embed")
def post_video_link(url: str):
    try:
        extract_audio_from_youtube(url)
        transcribe_audio()

        # extract phrases from serialized deepgram payload
        word_segments = extract_segments(json.load(open("yt_audio.json")))
        texts = [t["text"].strip() for t in word_segments]

        # embed documents
        doc_embeddings = create_embeddings(
            texts, os.environ.get("MODEL")
        )  # All embeddings for the texts

        pickle.dump(doc_embeddings, open("doc_embeddings", "wb"))
        pickle.dump(word_segments, open("word_segments", "wb"))

        return {
            "status_code": 200,
            "status_txt": "OK",
            "success": {"message": "image uploaded", "code": 200},
            "video": {
                "date": datetime.now(),
                "filename": "video.mp4",
                "mime": "video/youtube",
                "url": url,
            },
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Unable to process request")
