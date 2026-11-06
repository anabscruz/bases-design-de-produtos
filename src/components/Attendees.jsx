import attendee1 from '../assets/images/attendee-1.png'
import attendee2 from '../assets/images/attendee-2.png'
import attendee3 from '../assets/images/attendee-3.png'
import './Attendees.css'

export const ATTENDEES = [attendee1, attendee2, attendee3]

const MAX_SHOWN = 3

/**
 * Row of overlapping attendee avatars (24px circles with a white border).
 * `people`: [{ name, photoUrl }] from the event data; without it, the generic trio.
 */
export default function Attendees({ className = '', people }) {
  const shown = people
    ? people.slice(0, MAX_SHOWN).map((person) => ({ key: person.name, src: person.photoUrl, name: person.name }))
    : ATTENDEES.map((src) => ({ key: src, src }))
  return (
    <div className={`attendees ${className}`}>
      {shown.map((person) => (
        <span className="attendees__item" key={person.key} title={person.name}>
          <img src={person.src} width="22" height="22" alt="" />
        </span>
      ))}
    </div>
  )
}
