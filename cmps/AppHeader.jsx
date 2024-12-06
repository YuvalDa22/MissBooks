const {  NavLink, useNavigate } = ReactRouterDOM
const navigate = useNavigate()

function onBack() {
    navigate(-1)
}

export function AppHeader() {

    return (
        <header className="app-header full main-layout">
            <section>
                <h1>Miss Books App</h1>
                <button onClick={onBack}>Back</button>
                <nav className="app-nav">
                    <NavLink to="/home">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/book">Books</NavLink>
                </nav>
            </section>
        </header>
    )
}

