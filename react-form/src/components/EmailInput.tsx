function EmailInput() {
    return (
        <div className="form-group p-3 col-12">
            <label htmlFor="email">Email: </label>
            <input className="form-control" placeholder="johndoe123@gmail.com" id="email" type="email" aria-describedby="emailHelp" required/>
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
    )
}

export default EmailInput;