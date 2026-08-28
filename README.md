import os
import streamlit as st
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

DIFFICULTY_PROMPTS = {
    "初級": "用非常簡單、初學者容易理解的方式回答，避免專業術語。",
    "中級": "用一般程度的方式回答，可以包含一些技術細節。",
    "高級": "用深入、專業的方式回答，可包含技術細節與進階概念。",
}

LANGUAGE_PROMPTS = {
    "中文": "請用繁體中文回答。",
    "English": "Please answer in English.",
    "日本語": "日本語で答えてください。",
}

st.set_page_config(page_title="我的 AI 助手")
st.title("🎓 我的 AI 助手")
st.caption("AI 回答可能有錯誤，請勿輸入密碼、地址或身分證等敏感資訊。")

question = st.text_input("請輸入問題")
difficulty = st.selectbox("選擇難度", list(DIFFICULTY_PROMPTS.keys()))
language = st.selectbox("選擇語言", list(LANGUAGE_PROMPTS.keys()))

if st.button("送出問題"):
    if not question.strip():
        st.warning("請輸入問題。")
    elif not os.environ.get("OPENAI_API_KEY"):
        st.error("錯誤：尚未設定 OPENAI_API_KEY。")
    else:
        system_prompt = (
            f"你是一個樂於助人的 AI 助手。"
            f"{DIFFICULTY_PROMPTS[difficulty]} "
            f"{LANGUAGE_PROMPTS[language]}"
        )
        with st.spinner("思考中..."):
            try:
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": question},
                    ],
                    timeout=30,
                )
                st.write(response.choices[0].message.content)
            except Exception as e:
                st.error(f"發生錯誤，請稍後再試：{e}")
