document.getElementById('recoveryForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('recoveryEmail').value;

    if (email) {
        // Simula envio do e-mail de recuperação
        const messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
        messageModal.show();

        // Aqui você poderia integrar com backend via fetch/AJAX se necessário.
        console.log(`Link de recuperação enviado para: ${email}`);
    }
});
