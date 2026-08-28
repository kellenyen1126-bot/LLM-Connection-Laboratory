import os
import streamlit as st
from openai import OpenAI

client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

st.title("🎓 我的 AI 助手")

question = st.text_input("請輸入問題")
difficulty = st.selectbox("選擇難度", ["初級", "中級", "高級"])
language = st.selectbox("選擇語言", ["中文", "English", "日本語"])

if st.button("送出問題"):
    if not question.strip():
        st.warning("請輸入問題。")
    else:
        with st.spinner("思考中..."):
            try:
                response = client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": f"用{difficulty}程度回答，並用{language}回答。"},
                        {"role": "user", "content": question}
                    ]
                )
                st.write(response.choices[0].message.content)
            except Exception as e:
                st.error(f"發生錯誤：{e}")
