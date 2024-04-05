import { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConnection";
import { signOut } from "firebase/auth";
import {
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    where,
    doc,
    deleteDoc,
    updateDoc
} from "firebase/firestore";
import { toast } from "react-toastify"

import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import LogoutIcon from '@mui/icons-material/Logout';

import './admin.css'

const Admin = () => {
    const [tarefaInput, setTarefaInput] = useState('');
    const [user, setUser] = useState({});
    const [tarefas, setTarefas] = useState([]);
    const [edit, setEdit] = useState({});

    useEffect(() => {
        const loadTarefas = () => {
            const userDetail = localStorage.getItem("@detailUser")
            setUser(JSON.parse(userDetail))

            if (userDetail) {
                const data = JSON.parse(userDetail);

                const tarefaRef = collection(db, "tarefas")
                const q = query(tarefaRef, orderBy("created", "desc"), where("userUid", "==", data?.uid))

                const unsub = onSnapshot(q, (snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            tarefa: doc.data().tarefa,
                            userUid: doc.data().userUid
                        })
                    })

                    setTarefas(lista);
                })
            }
        }

        loadTarefas();
    }, [])

    const handleRegister = async (e) => {
        e.preventDefault();

        if (edit?.id) {
            handleUpdateTarefa();
            return;
        }

        await addDoc(collection(db, "tarefas"), {
            tarefa: tarefaInput,
            created: new Date(),
            userUid: user?.uid
        })
            .then(() => {
                toast.success("Tarefa registrada com sucesso!")
                setTarefaInput('')
            })
            .catch(() => {
                toast.error("Erro ao registrar a tarefa. Tente novamente!")
            })
    }

    const handleLogout = async () => {
        await signOut(auth);
    }

    const deleteTarefa = async (id) => {
        const docRef = doc(db, "tarefas", id)

        await deleteDoc(docRef)
            .then(() => {
                toast.success("Tarefa concluida com sucesso.")
            })
            .catch(() => {
                toast.error("Erro ao deletar tarefa. Tente novamente!")
            })
    }

    const editTarefa = async (item) => {
        setTarefaInput(item.tarefa)
        setEdit(item);
    }

    const handleUpdateTarefa = async () => {
        const docRef = doc(db, "tarefas", edit?.id)

        await updateDoc(docRef, {
            tarefa: tarefaInput
        })
            .then(() => {
                toast.success("Tarefa atualizada com sucesso!")
                setTarefaInput('')
                setEdit({})
            })
            .catch(() => {
                toast.error("Erro ao atualizar a tarefa. Tente novamente!")
                setTarefaInput('')
                setEdit({})
            })
    }

    const handleCancel = () => {
        setEdit({});
        setTarefaInput('');
    }

    return (
        <div className='admin-container'>
            <h1>Minhas tarefas</h1>
            <span>Gerencie suas tarefas diariamente</span>

            <form className="form" onSubmit={handleRegister}>
                <textarea
                    id="tarefa"
                    name="tarefa"
                    required
                    placeholder='Digite sua tarefa...'
                    value={tarefaInput}
                    onChange={(e) => setTarefaInput(e.target.value)}
                />

                {Object.keys(edit).length > 0 ? (
                    <div className="btns-edit">
                        <button className="btn-register" type="submit">Atualizar Tarefa</button>
                        <button
                            className="btn-register"
                            style={{ backgroundColor: "#464a50" }}
                            type="submit"
                            onClick={handleCancel}>
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <button className="btn-register" type="submit">Registrar Tarefa</button>
                )}
            </form>

            {Object.keys(tarefas).length === 0 && (
                <p>Não há nenhuma tarefa em andamento.</p>
            )}

            {tarefas.map((item) => (
                <article className="list" key={item.id}>
                    <p>{item.tarefa}</p>
                    <div className="box-btn">
                        <button onClick={() => editTarefa(item)} className="btn-edit" title="Editar tarefa">
                            <EditIcon />
                        </button>
                        <button className="btn-delete" onClick={() => deleteTarefa(item.id)} title="Concluir tarefa">
                            <CheckIcon />
                        </button>
                    </div>
                </article>
            ))
            }

            <button className="btn-logout" onClick={handleLogout} title="Sair da conta">
                <LogoutIcon />
            </button>
        </div>
    );
}

export default Admin;