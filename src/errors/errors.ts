class MiError extends Error {

    name: string
    estado: number

    constructor(name:string, message: string,estado:number){
        super(message)
        this.name = name
        this.estado = estado
    }
}

export default MiError