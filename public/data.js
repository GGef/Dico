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

document.addEventListener('DOMContentLoaded',  setTimeout(() => {
   fetchWords()
}, 2000));

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const submitButton = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Lock the button and show a spinner
        submitButton.disabled = true;
        submitButton.innerHTML = '<div>En cours... <div class="spinner"></div></div>';

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
                messageDiv.textContent = 'Mot réservé avec succès!';
                messageDiv.className = 'text-green-500'; // Green text color for success
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            } else {
                messageDiv.textContent = 'Échec de la réservation. Veuillez réessayer!';
                messageDiv.className = 'text-red-500'; // Red text color for failure
            }
            submitButton.disabled = false;
            submitButton.innerHTML = 'Réserver'; // Restore button text
          
        })
        .catch(error => {
            console.error('Error:', error);
            messageDiv.textContent = 'Erreur lors de l\'envoi du formulaire.';
            messageDiv.className = 'text-red-500'; // Red text color for error
            submitButton.disabled = false;
            submitButton.innerHTML = 'Réserver'; // Restore button text
        });
    });
});

