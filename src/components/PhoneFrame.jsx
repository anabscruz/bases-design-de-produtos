import './PhoneFrame.css'

/**
 * Phone shell. `menu` is a full-screen layer drawn over the current screen;
 * while `menuOpen`, the screen underneath is inert.
 */
export default function PhoneFrame({ screenKey, transition = 'none', overlay, menu, menuOpen = false, children }) {
  return (
    <div className="phone-stage">
      <div className="phone">
        <div className="phone__screen">
          <div className={`phone__viewport phone__viewport--${transition}`} key={screenKey} inert={menuOpen}>
            {children}
          </div>
        </div>
        {overlay}
        {menu}
      </div>
    </div>
  )
}
