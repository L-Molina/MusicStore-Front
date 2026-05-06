import './MaterialSymbol.css'

export default function MaterialSymbol({ children, className = '', filled, style, ...rest }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        ...(filled ? { fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24' } : {}),
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  )
}
