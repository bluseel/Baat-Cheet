
const Input = () =>{
    return (
        <div className="input">
            <input type="text" placeholder="Types your message ...."/>
            <div className="send">
                <img src="picture-sample.svg" alt="" />
                <input type="file" id="file" style={{display:"none"}} />
                <label htmlFor="file">
                    <img src="attach.svg" alt="" />
                </label>
                <button>Send</button>
            </div>
        </div>
    )
}

export default Input;