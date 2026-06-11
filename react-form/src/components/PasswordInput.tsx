function PasswordInput() {
    return (
        <div className="form-group p-3 col-12">
            <label htmlFor="password">Password: </label>
            <input className="form-control" id="password" type="password" required/>
        </div>
    )
}

export default PasswordInput;