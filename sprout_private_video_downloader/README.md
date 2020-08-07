# SPROUT VIDEO DOWNLOADER
##### DOWNLOAD TREINAWEB

## PASSOS 1 (TESTADO NO MACBOOK PRO):
- Tenha instaldo no seu computador node e npm;
- Baixe o projeto;
- Na pasta raiz, faça o comando para gerar o node_module (`$ npm install`);
- Caso aconteça algum problema force a instalção com o comando (`$ npm install --unsafe-perm=true --allow-root`);

## PASSOS 2 (TESTADO NO MACBOOK PRO):
- Entre na página do video que você quer baixar;
- Entre no DevTools(ESTOU USANDO CHROME);
- Na tab de "NETWORK" procure por "videos.sproutvideo.com" ou algo do tipo, seleciona ele;
- REQUEST HEADERS => REFERER => COPIE A URL, EXEMPLO ("https://videos.sproutvideo.com/embed/1c9cdab71c1aecc494/5fe6d6ff50d68e25?signature=YqIOqgQB%2F8GuLT4ImDP7rWvWmJ8%3D&expires=1586874783&type=hd");
- Verifique se a ult termina com "&type=hd" se não seu video vai sair com qualidade ruim ou nem vai funcionar;

## PASSOS 3 (TESTADO NO MACBOOK PRO):
- Na pasta raiz do projeto use o comando no terminal (`$ node downloader.js 'COLOQUE_AQUI_SUA_URL_PARA_DOWNLOAD'`);
- Tudo certo? Então aperte o ENTER para executar o comando;
- Vai abrir o CHROME do seu MAC, insanamente, mas é normal só para o script funcionar mesmo;
- É possível que umas bugadas e não funcione de primeira e pareça que travoum mais é so reiniciar, dar um CONTROL+C, para cancelar o comando, e depois tente novamente; No meu pc isso funciona;
- DESFRUTE DO SEU DOWNLOAD, o arquivo vai estar em .M3U8, agora é fácil para transformar em .mp4 ou afins, no software VLC, tem tutorial faceis para fazer essa conversão;
- Depois de convertido para a extensão do seu gosto verifique os minutos do seu video e veja se o video que você fez o download tem o mesmo tempo se não tente novamente;

## PASSO 4
- CASO VOCÊ MELHOROU O CODIGO OU ARRUMOU ALGUM BUG OU DEIXOU MAIS OTIMIZADO OU MAIS CERTO, ENTRE EM CONTATO COMIGO, FAÇA UM FORK, SEILA, MEU EMAIL É (lucas.albuquerque.gk@gmail.com)

## TUDO PARA FIM'S ACADÊMICOS!