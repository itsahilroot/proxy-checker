document.getElementById('proxyForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const proxy = document.getElementById('proxy').value;
    const url = document.getElementById('url').value;

    const statusEl = document.getElementById('status');
    const timeEl = document.getElementById('time');
    const jsonOutput = document.getElementById('jsonOutput');
    const resultBox = document.getElementById('result');
    const loader = document.getElementById('loader');

    // Reset UI
    statusEl.textContent = '';
    timeEl.textContent = '-';
    jsonOutput.textContent = '';
    resultBox.classList.add('hidden');
    loader.classList.remove('hidden');

    try {
        const response = await fetch('/ajax-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ proxy, url })
        });

        const data = await response.json();
        statusEl.textContent = data.status;
        timeEl.textContent = data.time;

        // Try to parse as JSON first
        try {
            const parsed = JSON.parse(data.html);
            jsonOutput.textContent = JSON.stringify(parsed, null, 2);
        } catch {
            // Not JSON, assume it's HTML
            jsonOutput.textContent = data.html;
        }
    } catch (err) {
        statusEl.textContent = 'Error';
        jsonOutput.textContent = err.message;
    } finally {
        loader.classList.add('hidden');
        resultBox.classList.remove('hidden');
    }
});
