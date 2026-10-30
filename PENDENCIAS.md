# Pendências

Lista para retomar os ajustes do projeto, com o contexto técnico de cada item.

## 1. Tela de descrição do evento

- Ainda não existe frame dessa tela no Figma: é preciso desenhar (ou indicar o frame) antes de implementar.
- Pontos de entrada naturais: os pôsteres da grade "Top Events" e da lista "All Events" (Events), os pôsteres de "Top Event" (Home) e o botão "Order" da lista.
- Seguir o padrão da tela de ticket: rota nova em `src/App.jsx` (`SCREENS`), entrando com slide "forward" e com botão de voltar no Header (`onBack`).

## 2. Tela de notificações

- Também não há frame no Figma.
- Hoje o sino aparece na barra de navegação e no cabeçalho de Events, mas não abre nada: em `src/components/FloatingMenu.jsx` a aba `notifications` não navega (`opensScreen`).
- Ao criar a tela, ligar a aba da barra (a bolinha azul passa a ir até o sino) e o sino do Header.

## 3. Melhorar a transição entre telas

- Hoje (`src/components/PhoneFrame.css`) só a tela nova é animada: ela entra deslizando 40px + fade (420ms), ou fade (280ms) no menu. A tela antiga some na hora.
- Ideias: animar a saída também (manter a tela anterior montada durante a troca, ou usar a View Transitions API), deslocamento maior/tela inteira, e transições de elemento compartilhado (ex.: o ticket da Home "virando" o cartão da tela de ingresso).
- Manter o respeito a "reduzir movimento" (`prefers-reduced-motion`).

## 4. Botão de voltar na tela de Events mantendo avatar e saldo

- Hoje o `onBack` do `src/components/Header.jsx` *substitui* o avatar pela seta.
- Opções a avaliar:
  - seta antes do avatar (seta + avatar + saldo na mesma linha);
  - avatar menor (44px) com a seta ao lado;
  - mostrar a seta só quando Events foi aberto por "Top Event" na Home, e não pela barra (Events também é uma aba, então "voltar" pode não fazer sentido vindo da barra).

## 5. Espaçamento desigual entre os ícones da barra

- Causa: o `gap` é fixo (16px), mas os botões têm larguras diferentes. Raio e carteira têm 48px fixos; ingresso e sino só a largura do ícone (30px e 26px). Por isso o espaço *visual* entre os ícones varia.
- Correção provável: todas as abas com a mesma largura (ex.: 48px) e ajustar o `gap` para manter a largura total da barra. A bolinha mede a posição de cada aba, então se adapta sozinha.

## 6. Transição e navegação do menu

- Hoje a tela do menu entra com fade e a barra de navegação desce e some.
- Bug encontrado: o X do menu volta para a última *aba* (`onClose={() => navigate(lastTab)}` em `src/App.jsx`), não para a tela anterior. Ex.: Ticket → menu → X leva para a Home, não de volta ao Ticket. Usar o mesmo `goBack` do botão de voltar resolveria.
- "Saved Events", "Invite", "Profile" e "Logout" ainda não fazem nada.
- Ideias de transição: menu deslizando como painel por cima da tela atual, itens entrando em sequência (stagger).
