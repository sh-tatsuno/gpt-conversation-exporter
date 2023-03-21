const notOpenAI = document.getElementById('notOpenAI');
const exportOptions = document.getElementById('exportOptions');
const exportMarkdownBtn = document.getElementById('exportMarkdown');
const exportPDFBtn = document.getElementById('exportPDF');

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

getCurrentTab().then(
    (tab) => {
        if (!tab.url.startsWith('https://chat.openai.com/chat')) {
            notOpenAI.style.display = 'block';
        } else {
            exportOptions.style.display = 'block';
        }
    }
);

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function convertToMarkdown(messages) {
  return messages.map(({ author, text }) => `**${author}**: ${text}`).join('\n\n');
}

function convertToPDF(messages) {
  const jsPDF = window.jspdf.jsPDF;
  const pdf = new jsPDF();
  let yOffset = 10;

  messages.forEach(({ author, text }) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${author}:`, 10, yOffset);
    yOffset += 7;

    pdf.setFont('helvetica', 'normal');
    const lines = pdf.splitTextToSize(text, 190);
    pdf.text(lines, 10, yOffset);
    yOffset += 7 * lines.length + 5;
  });

  return pdf.output('blob');
}

function exportChat(format) {
    getCurrentTab().then((tab) => {
      chrome.tabs.sendMessage(tab.id, { action: 'exportChat' }, (response) => {
        if (response && response.messages) {
          const messages = response.messages;
          if (format === 'markdown') {
            const content = convertToMarkdown(messages);
            downloadFile('openai-chat.md', content, 'text/markdown');
          } else if (format === 'pdf') {
            const content = convertToPDF(messages);
            downloadFile('openai-chat.pdf', content, 'application/pdf');
          }
        } else {
          console.log('No response or messages received from the content script.');
        }
      });
    });
  }

exportMarkdownBtn.addEventListener('click', () => exportChat('markdown'));
exportPDFBtn.addEventListener('click', () => exportChat('pdf'));
