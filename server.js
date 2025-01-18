from flask import Flask, request, jsonify
import youtube_dl

app = Flask(__name__)

@app.route('/download', methods=['POST'])
def download_video():
    data = request.json
    url = data.get('url')
    quality = data.get('quality')

    ydl_opts = {
        'format': quality,
        'outtmpl': '%(title)s.%(ext)s',
    }

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    return jsonify({'status': 'success', 'message': 'Video downloaded successfully'})

@app.route('/convert', methods=['POST'])
def convert_to_mp3():
    data = request.json
    url = data.get('url')

    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': '%(title)s.%(ext)s',
    }

    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    return jsonify({'status': 'success', 'message': 'Video converted to MP3 successfully'})

if __name__ == '__main__':
    app.run(debug=True)
