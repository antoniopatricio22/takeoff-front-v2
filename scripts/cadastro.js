function handleSubmit(event) {
  event.preventDefault();

  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmar-senha').value;

  if (senha !== confirmarSenha) {
    alert('As senhas não coincidem!');
    return;
  }

  alert('Cadastro realizado com sucesso!');
  // Aqui você pode redirecionar ou salvar os dados via API
}
