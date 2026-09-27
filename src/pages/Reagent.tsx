function Reagent() {
    return (
        <>
            <h1 className="font-bold text-title">Consultar Reagentes</h1>
            <div className="mt-4 flex justify-between">
                <input type="text" className="border border-border rounded-md p-2 bg-white" placeholder="Consultar reagente"/>
                <button className="bg-primary p-2 text-white text-small font-bold rounded-md">Consultar</button>
            </div>
        </>
    )
}

export default Reagent;