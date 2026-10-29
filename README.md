# bases-design-de-produtos

Protótipo em **React + Vite** que reproduz as telas mobile do arquivo Figma
[Exercício Design de produtos digitais](https://www.figma.com/design/OFcKPr6AlO1KmLHYY0WKsg/Exercicio-Design-de-produtos-digitais?node-id=106-590)
(página "Exercício 2", frames de 402 × 874 — iPhone 17).

## Telas

| Rota       | Frame no Figma                                            |
| ---------- | --------------------------------------------------------- |
| `#/home`   | Home (`106:590`)                                          |
| `#/events` | Events (`107:833`)                                        |
| `#/menu`   | Menu (`120:104`)                                          |
| `#/wallet` | Wallet Cards Collapsed (`106:767`) / Visible (`103:383`)  |

Interações:

- Barra flutuante: raio → Home, carteira → Wallet, ingresso → Events.
- Ícone de menu abre o Menu; o **X** volta para a tela anterior. Home, Wallet e Tickets navegam.
- Chevron de "Top Event" abre Events.
- Na Wallet, toque no cartão Nubank para alternar entre cartões recolhidos e visíveis.
- O ícone de olho oculta/mostra os saldos.

No desktop o app aparece dentro de uma moldura de celular; em telas de até 500px ocupa a tela inteira.

## Rodando

```bash
npm install
npm run dev
```

Build de produção: `npm run build` (saída em `dist/`).

## Estrutura

```
src/
  assets/icons    SVGs exportados do Figma
  assets/images   fotos e pôsteres exportados do Figma
  components/     Header, BalancePill, Ticket, FloatingMenu, CreditCard, BalanceCard...
  screens/        Home, Events, Menu, Wallet
  styles/         tokens de design (cores, fontes, sombras)
```

Fontes (DM Sans, Poppins, Inter, Karla) carregadas do Google Fonts.
