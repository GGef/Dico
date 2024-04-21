function fetchWords() {
    fetch('/get-words')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const select = document.getElementById('word');
            select.innerHTML = '<option value="">Sélectionnez un mot</option>'; // Reset dropdown
            data.data.forEach(item => {
                const option = new Option(item.mot, item.ID); // Create a new Option object
                select.add(option); // Add it to the list
            });
        } else {
            console.log('No words fetched');
        }
    })
    .catch(error => console.error('Error fetching words:', error));
}

document.addEventListener('DOMContentLoaded', fetchWords);

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = {
            firstName: document.getElementById('firstname').value,
            lastName: document.getElementById('lastname').value,
            email: document.getElementById('email').value,
            id: document.getElementById('word').value
        };

        // Send the data to your server
        fetch('/submit-word-selection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Word reserved successfully!');
            } else {
                alert('Failed to reserve word. Please try again!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting form.');
        });
    });
});
