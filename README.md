# **Order List**

#### Este projeto consiste no desenvolvimento de uma aplicação frontend em React para gerenciamento de pedidos de entrega.

#### A aplicação permite aos usuários cadastrar novos pedidos, visualizar o tempo estimado de entrega para cada pedido e acompanhar a atualização dinâmica desse tempo.

## **Principais Funcionalidades:**

#### 1 - **Cadastro de Pedidos**

#### Interface intuitiva que permite aos usuários adicionar novos pedidos, fornecendo o nome do cliente e endereço de entrega.

#### 2- **Exibição dos Pedidos**

#### Tela dedicada a exibir todos os pedidos cadastrados, com um layout responsivo, permitindo que o usuário utilize a aplicação em qualquer dispositivo.

#### Exibição do tempo estimado de entrega, que é a soma do tempo de preparo (30 minutos) e do tempo de viagem calculado pelo Google Maps Directions API.

#### Exibição dinâmica do status da entrega, sendo: Aguardando, Em Produção, Rota de Entrega e Entregue.

#### Os pedidos são gerenciados da seguinte maneira: apenas TRÊS pedidos podem ter o status 'Em Produção' simultaneamente, enquanto os demais permanecem com o status 'Aguardando'. À medida que os pedidos em produção avançam para o status 'Rota de Entrega', os próximos pedidos na fila são atualizados para 'Em Produção'. Esse ciclo continua, respeitando o limite de TRÊS pedidos em produção, até que todos os pedidos pendentes sejam processados.

## **Principais Tecnologias/Bibliotecas utilizadas**:
#### React, React Router Dom, React-Toastify, React Icons, Axios, Cors, Express, Tailwind(Flowbite), Moment, react-google-maps/api entre outras. 

## **Uso**:
#### Certifique-se de ter o Node v22.4.0 instalado em sua máquina.

```bash
git clone https://github.com/pedrohrocha18/order_list.git

cd order_list

npm install
```
#### Crie e exporte um arquivo key.js na pasta raiz do projeto:

```bash
const apiKey = "sua_google_maps_key";

export default apiKey;
```

#### Inicie o servidor Backend para que a aplicação faça requisição ao Google Maps Directions API:

```bash
node ./src/server/server.js
```

#### Em um novo terminal navegue até a pasta raiz do projeto e digite o comando para iniciar o servidor react 'Frontend':

```bash
npm run dev
```

#### O servidor backend ficará rodando na porta 5000, caso necessário, faça alteração no arquivo src/server/server.js

```bash
http://localhost:5000/api/googlemaps/directions
```

#### O servidor frontend ficará rodando na porta localhost 5173, que é o padrão do vite.

```bash
http://localhost:5173/
```

### **Enjoy :D**