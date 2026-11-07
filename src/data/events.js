/*
 * Event catalogue: reads src/data/events.json and adds what the screens need.
 *
 * The JSON keeps plain data only. Images are file names in src/assets/images,
 * resolved here to the URLs Vite builds; dates are ISO strings (with the -03:00
 * offset) and prices are numbers in reais, formatted here in pt-BR.
 */
import rawEvents from './events.json'

// Every image in the assets folder, keyed by file name ("poster-afropunk.jpg" → built URL)
const IMAGES = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/images/*', { eager: true, import: 'default' })).map(([path, url]) => [
    path.split('/').pop(),
    url,
  ]),
)

export function imageUrl(fileName) {
  if (!fileName) return undefined
  const url = IMAGES[fileName]
  if (!url && import.meta.env.DEV) console.warn(`events.json: image "${fileName}" not found in src/assets/images`)
  return url
}

const TIME_ZONE = 'America/Sao_Paulo'
const dayMonth = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', timeZone: TIME_ZONE })
const hourMinute = new Intl.DateTimeFormat('pt-BR', { hour: 'numeric', minute: 'numeric', hourCycle: 'h23', timeZone: TIME_ZONE })

/** "26 de setembro" */
export const formatDay = (date) => dayMonth.format(date)

/** "21h" or "21h30" */
export function formatTime(date) {
  const parts = Object.fromEntries(hourMinute.formatToParts(date).map((part) => [part.type, part.value]))
  return `${Number(parts.hour)}h${parts.minute === '00' ? '' : parts.minute}`
}

/**
 * Events that run over several days (exhibitions, food festivals) have an
 * `endDateTime`: "12 a 14 de novembro", "27 de novembro a 4 de abril"
 */
export function formatDayRange(start, end) {
  const from = formatDay(start)
  const to = formatDay(end)
  const [fromDay, ...fromMonth] = from.split(' de ')
  const [, ...toMonth] = to.split(' de ')
  return fromMonth.join(' de ') === toMonth.join(' de ') ? `${fromDay} a ${to}` : `${from} a ${to}`
}

/** 3000 → "3.000", 356.9 → "356,90" (the currency symbol is added by <Amount>) */
export function formatPrice(amount) {
  const cents = !Number.isInteger(amount)
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: 2 }).format(amount)
}

/** "Tom, Kim e outras 2 pessoas vão" */
export function attendeesLabel(attendees) {
  const names = attendees.map((person) => person.name)
  if (names.length === 0) return 'Seja a primeira pessoa a ir'
  if (names.length === 1) return `${names[0]} vai`
  if (names.length === 2) return `${names[0]} e ${names[1]} vão`
  const others = names.length - 2
  return `${names[0]}, ${names[1]} e ${others === 1 ? 'outra pessoa' : `outras ${others} pessoas`} vão`
}

function prepare(event) {
  const date = new Date(event.dateTime)
  const endDate = event.endDateTime ? new Date(event.endDateTime) : null
  const tickets = Object.entries(event.prices).map(([id, ticket]) => ({ id, ...ticket, price: formatPrice(ticket.amount) }))
  const lowest = Math.min(...tickets.map((ticket) => ticket.amount))
  return {
    ...event,
    date,
    endDate,
    dateLabel: endDate ? formatDayRange(date, endDate) : `${formatDay(date)} - ${formatTime(date)}`,
    tickets,
    priceFrom: formatPrice(lowest),
    posterUrl: imageUrl(event.poster),
    artistPhotoUrl: imageUrl(event.artistPhoto) ?? imageUrl(event.poster),
    attendees: event.attendees.map((person) => ({ ...person, photoUrl: imageUrl(person.photo) })),
  }
}

export const EVENTS = rawEvents.map(prepare)

export const getEvent = (id) => EVENTS.find((event) => event.id === id)

/** Route to an event's page: "#/event/placebo" */
export const eventPath = (id) => `event/${id}`
