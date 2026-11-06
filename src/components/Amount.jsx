// Renders values in reais, like "R$ 356,90" (values are already formatted pt-BR).
export default function Amount({ prefix = '', value, hidden = false }) {
  return (
    <>
      <span>{`${prefix}R$\u00a0`}</span>
      <span>{hidden ? '•••••' : value}</span>
    </>
  )
}
