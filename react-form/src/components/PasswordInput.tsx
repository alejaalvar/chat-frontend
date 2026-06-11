function PasswordInput({ label, id }: {label: string, id: string}) {
    return (
        <>
            <label htmlFor={id}>{label} </label>
            <input className="form-control" id={id} type="password" required/>
        </>
    )
}

export default PasswordInput;