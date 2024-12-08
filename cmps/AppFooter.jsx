import { ColorInput } from "./dynamic-inputs/ColorInput.jsx";
import { FontsizeInput } from "./dynamic-inputs/FontsizeInput.jsx";

const { useState } = React

export function AppFooter() {

    const [cmpType, setCmpType] = useState('color')

    const [footerStyle, setFooterStyle] = useState({
        backgroundColor: '#101010',
        fontSize: '18px'
    })

    function onSetFooterStyle(footerStyle) {
        setFooterStyle(prevStyle => ({ ...prevStyle, ...footerStyle }))
    }

    return (
        <footer style={footerStyle} className="app-footer full main-layout">
            <section >
                <DynamicCmp {...footerStyle} onSetFooterStyle={onSetFooterStyle} name="Babi" cmpType={cmpType} />
                <select value={cmpType} onChange={(ev) => setCmpType(ev.target.value)}>
                    <option value="color">Color</option>
                    <option value="fontSize">Font size</option>
                </select>
            </section>
        </footer>
    )
}


function DynamicCmp({ cmpType, ...restOfProps }) {
    const dynCmpsMap = {
        color: <ColorInput {...restOfProps} />,
        fontSize: <FontsizeInput {...restOfProps} />
    }

    return dynCmpsMap[cmpType]
}
