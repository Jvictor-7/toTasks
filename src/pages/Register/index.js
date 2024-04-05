import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (email !== '' && password !== '') {
            await createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    navigate('/admin', { replace: true })
                    toast.success("Conta registrada com sucesso!");
                })
                .catch((error) => {
                    if (error.code === "auth/email-already-in-use") {
                        toast.error("Já existe uma conta criada com este email.")
                    } else {
                        toast.error("Ocorreu algum tipo de erro. Por favor, tente novamente mais tarde.")
                    }
                })
        } else {
            toast.warn("Preencha todos os campos.");
        }
    }

    return (
        <div className="home-container">
            <h1>Cadastre-se</h1>
            <span>Vamos criar sua conta!</span>

            <form className="form" onSubmit={handleRegister}>
                <input
                    id="email"
                    name="email"
                    required
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    id="password"
                    name="password"
                    required
                    minLength={8}
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Cadastrar</button>
            </form>

            <Link className="button-link" to="/" title="Faça login na sua conta existente">
                Já possui uma conta? Faça login!
            </Link>
        </div>
    );
}

export default Register;