from flask import Flask, request

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        return f"你送出的文字是：{request.form.get('question', '')}"
    return '''
        <form action="/" method="POST">
            <input type="text" name="question" placeholder="請輸入文字">
            <button type="submit">送出</button>
        </form>
    '''

if __name__ == "__main__":
    app.run(debug=True)

