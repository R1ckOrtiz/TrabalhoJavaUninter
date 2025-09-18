# Cofrinho Virtual

Um projeto em Java que simula um cofrinho virtual com diversas funcionalidades. O sistema permite gerenciar moedas nacionais e internacionais e realizar conversões de valores.

## Funcionalidades

- **Adicionar moedas nacionais e internacionais**  
  O usuário pode adicionar moedas de diferentes valores e códigos monetários (ex.: BRL, USD, EUR).

- **Excluir moedas**  
  Permite remover moedas específicas do cofrinho.

- **Listar as moedas do cofrinho**  
  Exibe todas as moedas armazenadas, com valores e códigos.

- **Converter o valor total do cofrinho**  
  Converte o total acumulado para uma moeda específica.

## Versão Web

Uma interface web moderna está disponível na pasta `webapp`. Ela replica as principais ações do cofrinho:

- adicionar moedas em Real, Dólar ou Euro;
- remover itens individualmente ou esvaziar o cofrinho;
- visualizar o total convertido automaticamente para Real;
- atualizar as cotações diretamente da nuvem (AwesomeAPI) com um clique;
- converter o total acumulado para qualquer uma das moedas suportadas usando as cotações mais recentes.

### Como executar

1. Abra o arquivo `webapp/index.html` em um navegador moderno.
2. Clique em **“Atualizar cotações”** para buscar os valores mais recentes diretamente da AwesomeAPI.
3. As informações do cofrinho ficam salvas localmente no navegador (via `localStorage`), permitindo continuar de onde parou.

> 💡 Caso esteja sem acesso à internet, a aplicação mantém valores padrão offline e continua funcionando normalmente.
