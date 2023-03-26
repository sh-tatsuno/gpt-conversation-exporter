chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("hello");
    if (request.action === 'exportChat') {
      const userMessages = Array.from(document.querySelectorAll('.items-start')).map(message => {
        const text = message.textContent;
        return text;
      });

      const aiMessages = Array.from(document.querySelectorAll('.markdown')).map(message => {
        const text = message.textContent;
        return text;
      });

      // Merge and sort user and AI messages based on their position in the chat
      // const messages = userMessages.concat(aiMessages).sort((a, b) => {
      //   const positionA = Array.from(a.parentElement.children).indexOf(a);
      //   const positionB = Array.from(b.parentElement.children).indexOf(b);
      //   return positionA - positionB;
      // });

      sendResponse({ userMessages });
    }
  });


  // const messageElements = Array.from(document.querySelectorAll('.items-start, .items-end'));
  // const messages = messageElements.map(element => {
  //   const userMessage = userMessages.find(msg => msg.element === element);
  //   if (userMessage) {
  //     return { author: 'User', text: userMessage.text };
  //   }

  //   const aiMessage = aiMessages.find(msg => msg.element === element);
  //   if (aiMessage) {
  //     return { author: 'AI', text: aiMessage.text };
  //   }
  // });

  // console.log('Merged messages:', messages);

  // sendResponse({ messages });
