# Contribuindo para o JusCleaner

Antes de mais nada, obrigado por considerar contribuir para o JusCleaner! São pessoas como você que fazem do JusCleaner uma ferramenta tão excelente para a comunidade jurídica.

## Por onde começo?

Se você notou um bug ou tem um pedido de funcionalidade, crie uma issue! Geralmente é melhor confirmar o bug ou aprovar a funcionalidade dessa forma antes de começar a programar.

## Fazer um Fork e criar uma branch

Se for algo que você acredita poder consertar, faça um fork do JusCleaner e crie uma branch com um nome descritivo.

## Formatação de código

Certifique-se de rodar as ferramentas de lint e formatação antes de enviar suas alterações (push):

```bash
cd frontend && npm run lint
cd ../backend && npm run lint
```

## Processo de Pull Request

1. Certifique-se de que quaisquer dependências de build ou instalação sejam removidas antes do final do fluxo ao realizar o build.
2. Atualize o README.md com detalhes das alterações na interface, isso inclui novas variáveis de ambiente, portas expostas, localizações de arquivos úteis e parâmetros de contêiner.
3. Você pode fazer o merge do Pull Request após obter a aprovação de dois outros desenvolvedores. Se você não tiver permissão para isso, pode solicitar ao segundo revisor que faça o merge para você.
