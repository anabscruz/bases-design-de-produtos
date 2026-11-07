/*
 * The signed-in user's tickets: two Lolla Day tickets for Lollapalooza Brasil 2027
 * (19–21 March 2027, Autódromo de Interlagos). One list feeds both the Home
 * tickets and the Ticket screen, so the two always agree.
 */
export const MY_TICKETS = [
  {
    id: 'lolla-2027-d1',
    event: 'Lollapalooza 2027',
    holder: 'Clinton Elvis',
    date: '19 mar. 2027', // Ticket screen
    shortDate: '19 mar', // Home ticket
    time: '11h', // gates open
    type: 'Lolla Lounge',
    orderId: '872847829',
    location: 'Autódromo de Interlagos - SP',
  },
  {
    id: 'lolla-2027-d2',
    event: 'Lollapalooza 2027',
    holder: 'Clinton Elvis',
    date: '20 mar. 2027',
    shortDate: '20 mar',
    time: '11h',
    type: 'Lolla Lounge',
    orderId: '872847830',
    location: 'Autódromo de Interlagos - SP',
  },
]

export const TICKET_RULES = [
  'Obrigatório apresentar documento oficial com foto',
  'Classificação etária: 16 anos. Menores de 16 só com pai, mãe ou responsável legal',
  'Objetos proibidos no festival: latas, garrafas de vidro, guarda-chuvas e armas',
]
