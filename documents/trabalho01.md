Com certeza\! Aqui está uma documentação completa e profissional para o projeto, no formato Markdown (`README.md`).

Você pode salvar este conteúdo em um arquivo chamado `README.md` na raiz do seu projeto.

-----

# Simulador de Exclusão Mútua Centralizada com Interface Web

Este projeto é uma simulação interativa e visual do **Algoritmo de Exclusão Mútua Centralizado**, um conceito fundamental em Sistemas Distribuídos. A aplicação foi desenvolvida em Node.js e apresenta uma interface web em tempo real que permite observar o comportamento dos processos, do coordenador e do acesso a um recurso compartilhado.

## 📜 Visão Geral

O objetivo deste trabalho é demonstrar, de forma prática e visual, como um coordenador centralizado gerencia requisições concorrentes a uma seção crítica. A simulação é dinâmica e inclui eventos como a falha do coordenador e a criação de novos processos, permitindo analisar a robustez e os pontos fracos do algoritmo.

## ✨ Funcionalidades Principais

  * **Implementação do Algoritmo Centralizado**: Lógica completa de `REQUEST`, `GRANT` e `RELEASE` gerenciada por um coordenador.
  * **Interface Web em Tempo Real**: Um dashboard dinâmico que exibe o estado de todos os componentes da simulação, atualizado instantaneamente via WebSockets.
  * **Simulação Dinâmica**:
      * O Coordenador falha a cada 1 minuto e um novo é eleito.
      * Um novo Processo é criado a cada 40 segundos.
      * O tempo de uso do recurso varia de 5 a 15 segundos.
      * Os processos tentam acessar o recurso em intervalos de 10 a 25 segundos.
  * **Tratamento de Falhas**: A simulação lida corretamente com a perda da fila e a interrupção de processos quando o coordenador falha.
  * **Código Modular e Organizado**: A estrutura do projeto separa claramente as responsabilidades do backend, frontend e da lógica da simulação.

## 🖥️ Interface Visual

A interface web é dividida em quatro painéis principais para facilitar a observação:

![alt text](image.png)

1.  **Coordenador e Recurso**: Mostra o ID do coordenador ativo (ou se está offline) e o estado da seção crítica (LIVRE ou OCUPADO, e por quem).
2.  **Fila de Espera**: Exibe em ordem os processos que solicitaram acesso e estão aguardando a liberação do recurso.
3.  **Processos Ativos**: Lista todos os processos existentes e seu status atual (`Na Seção Crítica`, `Na Fila`, `Requisitando` ou `Ocioso`), ordenados por prioridade de status.
4.  **Log de Eventos**: Um console que registra em tempo real as ações mais importantes que ocorrem na simulação.

## 🛠️ Tecnologias Utilizadas

  * **Backend**:
      * [Node.js](https://nodejs.org/): Ambiente de execução do JavaScript no servidor.
      * [Express.js](https://expressjs.com/): Framework para criar o servidor web.
      * [Socket.IO](https://socket.io/): Biblioteca para comunicação em tempo real (WebSockets).
  * **Frontend**:
      * HTML5
      * CSS3
      * JavaScript (Vanilla)

## 📁 Estrutura do Projeto

O projeto segue uma estrutura modular para garantir a separação de responsabilidades e facilitar a manutenção.

```
/seu-projeto
|
|-- src/
|   |-- backend/
|   |   |-- simulation/
|   |   |   |-- Coordinator.js  // Classe do Coordenador
|   |   |   |-- Process.js      // Classe do Processo
|   |   |
|   |   |-- server.js           // Arquivo principal (Express, Socket.IO, Lógica da Simulação)
|   |
|   |-- public/
|       |-- index.html          // Estrutura da UI
|       |-- style.css           // Estilização da UI
|       |-- script.js           // Lógica do frontend e comunicação com o servidor
|
|-- node_modules/
|-- package.json
|-- README.md
```

## 🚀 Instalação e Execução

Siga os passos abaixo para rodar a simulação em sua máquina local.

**1. Pré-requisitos:**

  * Ter o [Node.js](https://nodejs.org/) (versão 14 ou superior) instalado, que inclui o `npm`.

**2. Clone ou Baixe o Repositório:**

```bash
git clone <url-do-seu-repositorio>
cd <nome-do-projeto>
```

**3. Instale as Dependências:**
Execute o comando abaixo no terminal para instalar o Express e o Socket.IO.

```bash
npm install
```

**4. Inicie a Simulação:**
Use o script definido no `package.json` para iniciar o servidor.

```bash
npm start
```

**5. Acesse a Interface:**
Abra seu navegador e acesse a URL:
[http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)

A simulação começará imediatamente e você poderá observar os eventos na tela.

## ⚙️ Arquitetura e Funcionamento

A comunicação entre o backend e o frontend é o coração do projeto.

1.  **Backend (`server.js`)**:

      * Mantém um objeto de estado central (`simulationState`) que contém todas as informações atuais da simulação (coordenador, processos, fila, etc.).
      * As classes `Coordinator` e `Process` encapsulam a lógica de seus respectivos papéis.
      * A cada mudança significativa no estado (uma requisição, uma liberação, uma falha), o servidor emite um evento `update` via Socket.IO.

2.  **Comunicação em Tempo Real (Socket.IO)**:

      * O evento **`'update'`** envia o objeto `simulationState` completo para todos os clientes conectados.
      * Essa abordagem garante que a interface web seja sempre um reflexo fiel do que está acontecendo no servidor.

3.  **Frontend (`script.js`)**:

      * O cliente se conecta ao servidor via Socket.IO e fica "ouvindo" o evento `'update'`.
      * Ao receber um novo estado, o script JavaScript reconstrói dinamicamente os elementos HTML da página (a lista de processos, o status do recurso, etc.) para exibir as informações mais recentes, sem a necessidade de recarregar a página.

