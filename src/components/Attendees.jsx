import attendee1 from '../assets/images/attendee-1.png'
import attendee2 from '../assets/images/attendee-2.png'
import attendee3 from '../assets/images/attendee-3.png'
import './Attendees.css'

export const ATTENDEES = [attendee1, attendee2, attendee3]

/** Row of overlapping attendee avatars (24px circles with a white border). */
export default function Attendees({ className = '' }) {
  return (
    <div className={`attendees ${className}`}>
      {ATTENDEES.map((src) => (
        <span className="attendees__item" key={src}>
          <img src={src} width="22" height="22" alt="" />
        </span>
      ))}
    </div>
  )
}
