import './PhoneFrame.css'

export default function PhoneFrame({ screenKey, children }) {
  return (
    <div className="phone-stage">
      <div className="phone">
        <div className="phone__viewport" key={screenKey}>
          {children}
        </div>
      </div>
    </div>
  )
}
