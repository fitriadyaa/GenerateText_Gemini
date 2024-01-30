const promptInput = document.getElementById("userInput");
const chatContainer = document.getElementById("chatContainer");
const typingIndicator = document.getElementById("typingIndicator");

async function sendMessage() {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    alert("Please enter a message.");
    return;
  }

  addMessage(prompt, 'user');
  promptInput.value = "";

  showTypingIndicator();

  const generatedText = await generateText(prompt);
  addMessage(generatedText, 'bot');

  hideTypingIndicator(); 
}

async function generateText(prompt) {
  try {
    const response = await fetch("https://5bed-182-253-124-244.ngrok-free.app/generate_text_stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      console.error("Error:", response.statusText);
      return "Error occurred while generating response.";
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let isFinished = false;
    let generatedTextContent = "";

    while (!isFinished) {
      const { done, value } = await reader.read();
      if (done) {
        isFinished = true;
        break;
      }
      generatedTextContent += decoder.decode(value, {stream: true});
    }

    return generatedTextContent;
  } catch (error) {
    console.error("Error:", error);
    return "An error occurred.";
  }
}

function addMessage(text, type) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.innerHTML = `<div class="message-bubble fadeIn">${text}</div>`;
  chatContainer.appendChild(messageDiv);

  chatContainer.scrollTop = chatContainer.scrollHeight;

  hideTypingIndicator();
}

let typingTimeout;

function showTypingIndicator() {
  clearTimeout(typingTimeout);
  typingIndicator.style.display = "inline-block";
}

function hideTypingIndicator() {
  typingTimeout = setTimeout(() => {
      typingIndicator.style.display = "none";
  }, 1000);
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
      sendMessage();
  }
}

window.onload = () => addMessage("Hello! How can I assist you today?", 'bot');
