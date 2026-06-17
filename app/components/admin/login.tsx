import { createPortal } from "react-dom"


export default function login(){
    return createPortal(
        <div className="w-full bg-black opacity-200">
            <div className="max-w-4xl bg-gray-800">
                <h1>Login</h1>
                <p>Hola</p>
            </div>
        </div>, document.body
    )
}