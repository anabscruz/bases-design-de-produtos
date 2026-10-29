// Renders values like "N 356.90" where the struck-through "N" stands for the Naira sign.
export default function Amount({ prefix = '', value, separator = ' ', hidden = false }) {
  return (
    <>
      <span className="naira">{`${prefix}N${separator}`}</span>
      <span>{hidden ? '•••••' : value}</span>
    </>
  )
}
