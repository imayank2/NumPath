# 🔢 NumPath

NumPath is a fun and interactive **Numerology & Life Path Calculator** built with **React + Node.js + MySQL + Ollama**.  
It helps users explore their **Life Path Number, Destiny Number, Zodiac Sign, and more** based on their Date of Birth and Name.  

It also includes a **personal AI Chatbot** powered by [Ollama](https://ollama.ai), and a **Blog section** for learning about numerology.

---

## ✨ Features

- 🧮 Calculate **Life Path Number**  
- 🔮 Get **Destiny Number, Personal Year, Month & Day**  
- 🌌 Find your **Zodiac Sign**  
- 💞 SoulMate **Compatibility Checker**  
- 📖 Blog Section with Numerology Guides & Articles  
- 🤖 **LLM Chatbot** 
- 🔐 Secure **Login & Signup** with Node.js + MySQL  
- 🎨 Modern UI with React + Lucide Icons  
- 📱 Fully **Responsive Design**  

---

## 🚀 Tech Stack

**Frontend:**  
- React  

**Backend:**  
- Node.js (Express.js)  
- MySQL  
- Axios  

**AI (Chatbot):**  
- [Ollama](https://ollama.ai) (running local model Mistral)  

**Other Tools:**  
- dotenv (for environment variables)  
- GitHub branch protection (for secure contributions)  

---

## 📂 Project Structure

NumPath/
├── backend/ # Node.js + MySQL backend
│ ├── server.js
│ ├── routes/
│ └── models/
├── frontend/ # React frontend
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ │ ├── CalculatorPage.jsx
│ │ │ ├── BlogPage.jsx
│ │ │ └── ChatBot.jsx
│ │ └── App.js
├── .env # Environment variables (NOT uploaded to GitHub)
├── LICENSE
└── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/imayank2/NumPath.git
cd NumPath
```
```bash
cd backend
npm install
```

```bash
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=numpath
JWT_SECRET=your_secret_key
```
```bash
node server.js
```

```bash
cd frontend
npm install
npm start
```

##4️⃣ Ollama Setup (Chatbot)

1. Install Ollama → https://ollama.ai
2. Pull a model (example mistral):
```bash
ollama pull llama3
```

4. Start the Ollama service (default runs on port 11434):
```bash
ollama run mistral
```


##📜 License

This project is licensed under the MIT License – see the LICENSE file for details.

© 2025 Mayank Chauhan


##📖 Blog Section

The project also includes a Blog section with guides, tips, and articles on Numerology:
Life Path Numbers explained
Destiny Number guide
Personal year & month meaning
Zodiac insights
You can easily extend this by adding more blog posts in the frontend pages/BlogPage.jsx.


##🌟 Support

If you like this project, give it a ⭐ on GitHub!
Feel free to open issues or suggest new features.




