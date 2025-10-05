ERP Simples - Sistema de Gerenciamento
Este é um projeto de simulação de um sistema de ERP (Enterprise Resource Planning) desenvolvido para fins de estudo e portfólio. A aplicação é focada no front-end e simula a interação com um backend para gerenciar usuários, finanças e estoque de uma pequena empresa.

➡️ Acesse a demonstração ao vivo: https://erp-alpha-green.vercel.app/

📸 Screenshot
<img width="1919" height="867" alt="image" src="https://github.com/user-attachments/assets/25c4cf0a-4168-4df7-8eeb-4c80d2f47967" />


✨ Funcionalidades Principais
Autenticação de Usuários: Sistema de login completo com fallback para dados mockados caso o backend não esteja disponível.

Registro de Novos Usuários: Formulário de cadastro que verifica o status do backend antes de ser exibido.

Sessão com Logout por Inatividade: O usuário é desconectado automaticamente após um período de inatividade, com um aviso prévio de 30 segundos.

Dashboard Intuitivo: Paineontrole com resumos visuais do saldo financeiro (receitas, despesas) e estatísticas de estoque.

Módulo Financeiro: Permite adicionar e remover transações de receita e despesa, com atualização em tempo real no dashboard.

Módulo de Estoque: Permite adicionar e remover produtos, controlando nome, quantidade em estoque e preço.

Design Responsivo: A interface se adapta a diferentes tamanhos de tela.

🛠️ Tecnologias Utilizadas
Este projeto foi construído com tecnologias modernas do ecossistema JavaScript:

Framework: Next.js (com App Router)

Linguagem: TypeScript

Biblioteca UI: React

Estilização: Tailwind CSS

Requisições HTTP: Axios

Alertas e Modais: SweetAlert2

Hospedagem: Vercel

