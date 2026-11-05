# Pendências

Lista para retomar os ajustes do projeto, com o contexto técnico de cada item.

## 1. Tela de descrição do evento (implementada para o RTM)

- Feita a partir do frame "Página evento" (Figma 233:98): `src/screens/EventDetails.jsx`, rota `#/event`.
- Abre pelo pôster do RTM na grade "Top Events", pelo pôster do RTM em "All Events" e pelo botão "Order" desse item. Os outros eventos ainda não abrem nada, porque só o RTM tem conteúdo no Figma (`HAS_DETAILS` em `src/screens/Events.jsx`).
- Ainda pendente:
  - textos de regras de "Meia Solidária", "Meia PCD" e "Inteira" são provisórios (o Figma só tem o de "Meia Entrada");
  - o botão "Comprar" não leva a nenhum fluxo de compra;
  - o header usa a seta de voltar no lugar do avatar (padrão do `onBack`), enquanto o Figma mostra o avatar (ver item 4);
  - a imagem do topo (`event-rtm-hero.png`) tem 4 MB: vale exportar em JPG/WebP menor.

## 2. Tela de notificações (implementada)

- Feita a partir do frame "Notification" (Figma 239:1373): `src/screens/Notifications.jsx`, rota `#/notifications`, aberta pelo sino da barra (agora uma aba como as outras).
- Ainda pendente:
  - as notificações são fixas no código e o estado (lidas/removidas) se perde ao trocar de tela;
  - "See event" de Afropunk e Coachella leva para a lista de Events, porque só o RTM tem página de evento;
  - não há indicador de não lidas no sino.

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

## 5. ~~Espaçamento desigual entre os ícones da barra~~ (resolvido)

- Resolvido junto com a inclusão do ícone de Home: todas as abas agora têm a mesma largura (48px), com 6px entre elas.

## 6. Transição e navegação do menu (transição feita)

- Feito: o menu deixou de ser uma tela (`#/menu`) e virou uma camada de tela cheia por cima da tela atual, seguindo o vídeo de referência: ao abrir, a tela de trás desfoca e clareia (efeito de vidro fosco) e os itens aparecem um a um; ao fechar, o efeito se desfaz. Fecha com o X ou com Esc.
- Com isso, o bug do X (que voltava para a última aba) deixou de existir: fechar o menu volta para a mesma tela.
- Ainda pendente: "Saved Events", "Invite", "Profile" e "Logout" não fazem nada, e "Events" não tem item no menu (nessa tela nenhum item fica destacado).

## 7. Tela de upcoming events

- Verificar se existe frame no Figma; nos frames usados até agora não há essa tela.
- Seria a lista completa dos próximos eventos/ingressos do usuário (hoje a Home mostra só dois tickets na seção "Upcoming events").
- Ponto de entrada natural: o título "Upcoming events" da Home (como já foi feito com "Top Event", com seta e título clicáveis).
- Hoje o ícone de ingresso da barra e o item "Tickets" do menu levam direto para a tela de ingresso (`#/ticket`). Se essa lista for criada, avaliar se eles devem abrir a lista em vez do ingresso.
- Cada item da lista deve abrir a tela de ingresso (`#/ticket`), como os tickets da Home já fazem.

## 8. ~~Remover o ícone de notificação do header da tela de Events~~ (resolvido)

- Removido. O sino agora fica só na barra de navegação, onde ainda não abre nada (ver item 2).

## 9. Desenhar e implementar o filtro

- Ainda não há desenho no Figma: primeiro desenhar e depois implementar.
- Hoje existem dois botões de filtro (ícone `tune`) que não fazem nada:
  - "All Events", na tela de Events (`events__filter` em `src/screens/Events.jsx`);
  - "Transactions", na carteira (`wallet__filter` em `src/screens/Wallet.jsx`).
- Definir no desenho: se é um mesmo componente para os dois, quais critérios cada um tem (ex.: data, local e preço nos eventos; origem e tipo nas transações) e o formato (bottom sheet, painel ou chips).
- O link "Transactions" do cartão de saldo (que mostrava só as transações da "Wallet") foi removido por feedback de usuários: o comportamento não era o esperado. A animação de desfoque continua disponível no `TransactionItem` (prop `collapsed`) e pode ser reaproveitada no filtro.
