<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<title>我的 AI 助手</title>
<style>
    * { box-sizing: border-box; }
    body {
        font-family: -apple-system, "Microsoft JhengHei", sans-serif;
        margin: 0;
        display: flex;
        height: 100vh;
        background: #343541;
        color: #ececf1;
    }
    #sidebar {
        width: 260px;
        background: #202123;
        padding: 16px;
        display: flex;
        flex-direction: column;
    }
    #sidebar h2 {
        font-size: 16px;
        margin: 0 0 20px 0;
    }
    #newChatBtn {
        background: transparent;
        border: 1px solid #565869;
        color: #ececf1;
        padding: 10px;
        border-radius: 6px;
        cursor: pointer;
        text-align: left;
    }
    #newChatBtn:hover { background: #2a2b32; }
    #main {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
    #chat {
        flex: 1;
        overflow-y: auto;
        padding: 30px 15%;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    .row {
        display: flex;
        gap: 14px;
    }
    .row.user { background: transparent; }
    .avatar {
        width: 30px;
        height: 30px;
        border-radius: 4px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
    }
    .row.user .avatar { background: #5436da; color: white; }
    .row.ai .avatar { background: #19c37d; color: white; }
    .text { line-height: 1.6; white-space: pre-wrap; padding-top: 4px; }
    footer {
        padding: 20px 15%;
    }
    #inputWrap {
        display: flex;
        background: #40414f;
        border-radius: 12px;
        padding: 8px;
        border: 1px solid #565869;
    }
    #userInput {
        flex: 1;
        background: transparent;
        border: none;
        outline: none;
        color: #ececf1;
        padding: 8px 12px;
        font-size: 15px;
    }
    #sendBtn {
        background: #19c37d;
        border: none;
        color: white;
        padding: 8px 18px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
    }
    #sendBtn:disabled { background: #565869; cursor: not-allowed; }
</style>
</head>
<body>

<div id="sidebar">
    <h2>🎓 我的 AI 助手</h2>
    <button id="newChatBtn" onclick="newChat()">+ 新對話</button>
</div>

<div id="main">
    <div id="chat"></div>
    <footer>
        <div id="inputWrap">
            <input type="text" id="userInput" placeholder="傳送訊息給 AI 助手...">
            <button id="sendBtn" onclick="sendMessage()">送出</button>
        </div>
    </footer>
</div>

<script>
    const API_KEY = "PASTE_HERE";
    const chatBox = document.getElementById("chat");
    const input = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");

    let history = [];

    function addRow(text, sender) {
        const row = document.createElement("div");
        row.className = "row " + sender;
        row.innerHTML = `
            <div class="avatar">${sender === "user" ? "你" : "AI"}</div>
            <div class="text"></div>
        `;
        row.querySelector(".text").innerText = text;
        chatBox.appendChild(row);
        chatBox.scrollTop = chatBox.scrollHeight;
        return row.querySelector(".text");
    }

    function newChat() {
        chatBox.innerHTML = "";
        history = [];
    }

    async function sendMessage() {
        const message = input.value.trim();
        if (!message) return;

        addRow(message, "user");
        history.push({ role: "user", content: message });
        input.value = "";
        sendBtn.disabled = true;

        const loadingText = addRow("思考中...", "ai");

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + API_KEY
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: history
                })
            });
            const data = await response.json();

            if (data.error) {
                loadingText.innerText = "錯誤：" + data.error.message;
            } else {
                const reply = data.choices[0].message.content;
                loadingText.innerText = reply;
                history.push({ role: "assistant", content: reply });
            }
        } catch (err) {
            loadingText.innerText = "發生錯誤：" + err;
        } finally {
            sendBtn.disabled = false;
        }
    }

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMessage();
    });
</script>

</body>
</html>
