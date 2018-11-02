from flask import Flask, request, jsonify
import handler

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def hello_world():
    if request.method == 'POST':
        content = request.get_json(silent=True)
        # app.logger.error(content)
        handler.fingerprint(content, {})
        return jsonify(['POST', content])
    else:
        return jsonify(['Hello'])
