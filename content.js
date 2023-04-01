function validateMessageNode(messageNode) {
  return messageNode.classList.contains('group');
}

function checkAISpeak(messageNode) {
  return messageNode.querySelectorAll('.markdown').length != 0;
}

function extractUserMessage(messageNode) {
  return messageNode.querySelector('.items-start').textContent;
}

function extractAIMessage(messageNode) {
  return messageNode.querySelector('.markdown').textContent;
}

function extractChatUINode() {
  return document.querySelector('.flex-col.items-center');
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'exportChat') {
      const messages = Array.from(Array.from(extractChatUINode().children).filter(messageNode => {
        return validateMessageNode(messageNode);
      }).map(messageNode => {
        if (checkAISpeak(messageNode)) {
          const text = extractAIMessage(messageNode);
          return {author: "AI", text};
        } else {
          const text = extractUserMessage(messageNode);
          return {author: "User", text};
        }
      }));

      sendResponse({ messages });
    }
  });
