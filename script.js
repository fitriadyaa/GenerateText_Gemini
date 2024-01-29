const generateButton = document.getElementById("generateButton");
const promptInput = document.getElementById("prompt");
const generatedText = document.getElementById("generatedText");

generateButton.addEventListener("click", async () => {
  const prompt = promptInput.value;
  if (prompt.trim() === "") {
    alert("Please enter a prompt.");
    return;
  }

  // Make a POST request to the Flask API
  const response = await fetch(
    "https://be9c-182-253-124-242.ngrok-free.app/generate_text_stream",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    }
  );

  if (!response.ok) {
    console.error("Error:", response.statusText);
    generatedText.textContent = "Error occurred while generating text.";
    return;
  }

  console.log(response);

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

    const chunkText = decoder.decode(value);
    generatedTextContent += chunkText;
    generatedText.innerHTML = generatedTextContent;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
});
