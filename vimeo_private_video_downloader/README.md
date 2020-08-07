# Vimeo Private Video Downloader

O script Node.js ajuda você a baixar vídeos privados do [Vimeo] (https://vimeo.com)

Antes de começar, verifique se você instalou o [Node.js] (https://nodejs.org/en/download/).

Para checá-lo, execute o terminal `node -v`. Você verá `v10.11.0` por exemplo. Se você receber um erro, instale o [Node.js] mais recente (https://nodejs.org/en/download/).

## Baixar

Para baixar vídeos, você deve:

1. Abra as ferramentas do desenvolvedor do navegador na guia rede (`F12` no Windows / Linux,` CMD + Option + I` no Mac OS).
2. Inicie o vídeo (ou mova o mouse sobre o vídeo).
3. Na guia "Rede", localize a carga do arquivo "master.json" e copie sua URL completa.
4. Preencha os campos `url` e` name` (usando como nome do arquivo) no arquivo `videojson.js`
5. Execute: `node vimeomaster.js`
6. Aguarde a saída do console `🌈 Lista concluída`

## Combinar e converter

O vídeo já esta convertido no final das contas, na pasta 'converted' mas você pode fazer manualmente. Para combinar e converter partes de vídeo / áudio em arquivo `mp4`, execute o terminal` vimeo-combine.sh` e divirta-se! 

### Colaboradores

Agradecimentos especiais aos colaboradores:

[@LucasGeek] (https://github.com/LucasGeek/) - criou o script bash para mesclar vídeos / partes de áudio em `mp4`
