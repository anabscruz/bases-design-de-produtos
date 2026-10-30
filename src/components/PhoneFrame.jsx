import './PhoneFrame.css'

/**
 * Phone shell. `menu` is rendered underneath the current screen; while
 * `menuOpen`, the screen is pushed aside to reveal it, and tapping the pushed
 * screen closes the menu.
 */
export default function PhoneFrame({ screenKey, transition = 'none', overlay, menu, menuOpen = false, onCloseMenu, children }) {
  return (
    <div className="phone-stage">
      <div className="phone">
        {menu}
        <div className={`phone__screen${menuOpen ? ' phone__screen--pushed' : ''}`}>
          <div className={`phone__viewport phone__viewport--${transition}`} key={screenKey} inert={menuOpen}>
            {children}
          </div>
          {menuOpen && <button type="button" className="phone__screen-close" aria-label="Fechar menu" onClick={onCloseMenu} />}
        </div>
        {overlay}
      </div>
    </div>
  )
}
