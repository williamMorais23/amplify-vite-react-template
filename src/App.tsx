import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [content, setContent] = useState(""); // Estado para o conteúdo do Todo
  const [isDone, setIsDone] = useState(false); // Estado para o status do Todo

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    // Limpar a assinatura ao desmontar o componente
    return () => subscription.unsubscribe();
  }, []);

  function createTodo() {
    if (!content) return; // Verifica se o conteúdo não está vazio

    client.models.Todo.create({ 
      content: content,
      isDone: isDone // Utiliza o estado do checkbox
    });

    // Limpa os campos após a criação do Todo
    setContent("");
    setIsDone(false);
  }

  return (
    <main>
      <h1>Minha Lista</h1>
      <div>
        <input 
          type="text" 
          placeholder="Todo content" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
        />
        <label>
          <input 
            type="checkbox" 
            checked={isDone} 
            onChange={(e) => setIsDone(e.target.checked)} 
          />
          Concluído
        </label>
        <button onClick={createTodo}>+ Novo Todo</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.content} - <strong>{todo.isDone ? 'Concluído' : 'Não Concluído'}</strong>
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
