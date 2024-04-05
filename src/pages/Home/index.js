import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth"
import { toast } from "react-toastify"

import './home.css'

const Home = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (email !== '' && password !== '') {
            await signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    navigate('/admin', { replace: true })
                    toast.success("Login realizado com sucesso!")
                })
                .catch(() => {
                    toast.error("Credenciais inválidas. Tente novamente!")
                })
        } else {
            toast.warn("Preencha todos os campos.")
        }
    }

    return (
        <div className="home-container">
            <h1>toTasks</h1>
            <span>Organize suas tarefas de forma fácil e acessível!</span>

            <form className="form" onSubmit={handleLogin}>
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
                    id="email"
                    name="password"
                    required
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit">Acessar</button>
            </form>

            <Link className="button-link" to="/register" title="Cadastre-se para criar uma conta">
                Não possui uma conta? Cadastre-se
            </Link>

            <footer>
                Projeto pessoal feito por:
                <a href="https://www.linkedin.com/in/jo%C3%A3o-lima-574a60227/" target="_blank" rel="noreferrer">João Lima</a>
            </footer>
        </div>
    );
}

export default Home;