import cohere
import numpy as np
from numpy.linalg import norm
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ["COHERE_API_KEY"]
model = os.environ["MODEL"]
co = cohere.Client(api_key)


def create_embeddings(texts, model):
    response = co.embed(texts=texts, model=model)
    return response.embeddings


def get_closest_match(query, doc_embeddings):
    threshold = 0.3
    good_matches = []
    query_embedding = create_embeddings([query], os.environ.get("MODEL"))[0]

    for idx, embedding in enumerate(doc_embeddings):
        cosine = np.dot(embedding, query_embedding) / (
            norm(embedding) * norm(query_embedding)
        )

        if cosine > threshold:
            good_matches.append((idx, cosine))

    return sorted(good_matches, key=lambda x: x[1], reverse=True)
