src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js">

    document.getElementById('profileForm').addEventListener('submit', function(e) {
        e.preventDefault();
        // Aqui você faria a integração com backend para salvar
        const successModal = new bootstrap.Modal(document.getElementById('successModal'));
        successModal.show();
    });
