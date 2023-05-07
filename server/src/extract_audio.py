import moviepy.editor as mp
from pytube import YouTube
import os
import shutil


def extract_audio_from_local_vid(vid_path, audio_path):
    clip = mp.VideoFileClip(vid_path)
    return clip.audio.write_audiofile(audio_path)


def extract_audio_from_youtube(url):
    temp_output_path = "temp_output_path"
    video = YouTube(url, use_oauth=True, allow_oauth_cache=True)
    audio = video.streams.filter(only_audio=True).first()
    output = audio.download(output_path=temp_output_path)

    file_names = os.listdir(temp_output_path)

    for file_name in file_names:
        shutil.move(os.path.join(temp_output_path, file_name), ".")
        os.rename((file_name), "yt_audio.mp3")
    shutil.rmtree(temp_output_path)