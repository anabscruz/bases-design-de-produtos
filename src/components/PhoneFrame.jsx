import './PhoneFrame.css'

export default function PhoneFrame({ screenKey, transition = 'none', overlay, children }) {
  return (
    <div className="phone-stage">
      <div className="phone">
        <div className={`phone__viewport phone__viewport--${transition}`} key={screenKey}>
          {children}
        </div>
        {overlay}
      </div>
    </div>
  )
}
