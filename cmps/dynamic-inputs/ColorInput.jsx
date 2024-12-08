
export function ColorInput({ name = 'Popo', onSetFooterStyle, backgroundColor }) {

    const colors = [
        '#F44236',
        '#9C27B0',
        '#3F51B5',
        '#2196F3',
        '#4caf50',
        '#101010',
    ]

    function onSetColor(color) {
        const footerStyle = { backgroundColor: color }
        onSetFooterStyle(footerStyle)
    }

    return (
        <section className="color-input">
            <div className="items-container">
                {colors.map(color =>
                    <div
                        key={color}
                        className={`item ${color === backgroundColor ? 'chosen' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => onSetColor(color)}
                    ></div>
                )}
            </div>
            <h3>Hello {name}!, pick a color!</h3>
        </section >
    )
}