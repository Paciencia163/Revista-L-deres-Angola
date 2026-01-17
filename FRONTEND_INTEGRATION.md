# 🌐 Integração Frontend com Backend GraphQL

## 📦 Opções de Implementação

### **Opção 1: Apollo Client (Recomendado para React)**

#### 1. Instalar dependências:
```bash
npm install @apollo/client graphql
```

#### 2. Configurar Apollo Client:

```javascript
// src/lib/apolloClient.js
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
```

#### 3. Configurar no App (React):

```javascript
// src/App.jsx ou src/main.jsx
import { ApolloProvider } from '@apollo/client';
import client from './lib/apolloClient';

function App() {
  return (
    <ApolloProvider client={client}>
      {/* Seus componentes aqui */}
    </ApolloProvider>
  );
}

export default App;
```

#### 4. Exemplos de Uso nos Componentes:

**📋 Listar Todos os Usuários:**
```javascript
import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      avatar
      createdAt
    }
  }
`;

function UsersList() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;

  return (
    <div>
      {data.users.map((user) => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email} - {user.role}</p>
        </div>
      ))}
    </div>
  );
}
```

**➕ Criar Usuário:**
```javascript
import { useMutation, gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      role
    }
  }
`;

function CreateUserForm() {
  const [createUser, { loading, error }] = useMutation(CREATE_USER, {
    // Refetch para atualizar a lista
    refetchQueries: ['GetUsers'],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createUser({
        variables: {
          input: {
            name: "Novo Usuário",
            email: "novo@exemplo.com",
            password: "senha123",
            role: "writer"
          }
        }
      });
      alert('Usuário criado com sucesso!');
    } catch (err) {
      console.error('Erro ao criar usuário:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={loading}>
        {loading ? 'Criando...' : 'Criar Usuário'}
      </button>
      {error && <p>Erro: {error.message}</p>}
    </form>
  );
}
```

**📰 Listar Artigos com Autor e Seção:**
```javascript
import { useQuery, gql } from '@apollo/client';

const GET_ARTICLES = gql`
  query GetArticles {
    articles {
      id
      title
      excerpt
      status
      views
      isFeatured
      author {
        name
        email
      }
      section {
        name
        slug
      }
      createdAt
    }
  }
`;

function ArticlesList() {
  const { loading, error, data } = useQuery(GET_ARTICLES);

  if (loading) return <p>Carregando artigos...</p>;
  if (error) return <p>Erro: {error.message}</p>;

  return (
    <div>
      {data.articles.map((article) => (
        <article key={article.id}>
          <h2>{article.title}</h2>
          <p>{article.excerpt}</p>
          <p>Autor: {article.author?.name}</p>
          <p>Seção: {article.section?.name}</p>
          <span>👁️ {article.views} visualizações</span>
        </article>
      ))}
    </div>
  );
}
```

**✏️ Atualizar Artigo:**
```javascript
const UPDATE_ARTICLE = gql`
  mutation UpdateArticle($id: ID!, $input: UpdateArticleInput!) {
    updateArticle(id: $id, input: $input) {
      id
      title
      status
    }
  }
`;

function EditArticleButton({ articleId }) {
  const [updateArticle] = useMutation(UPDATE_ARTICLE);

  const handlePublish = async () => {
    try {
      await updateArticle({
        variables: {
          id: articleId,
          input: {
            status: "published"
          }
        }
      });
      alert('Artigo publicado!');
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  return <button onClick={handlePublish}>Publicar</button>;
}
```

---

### **Opção 2: Fetch API (Vanilla JavaScript)**

```javascript
// utils/graphqlClient.js
const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

export async function graphqlRequest(query, variables = {}) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}

// Exemplo: Buscar todos os usuários
export async function getUsers() {
  const query = `
    query {
      users {
        id
        name
        email
        role
      }
    }
  `;

  return await graphqlRequest(query);
}

// Exemplo: Criar usuário
export async function createUser(input) {
  const query = `
    mutation CreateUser($input: CreateUserInput!) {
      createUser(input: $input) {
        id
        name
        email
        role
      }
    }
  `;

  return await graphqlRequest(query, { input });
}

// Exemplo: Buscar artigos
export async function getArticles() {
  const query = `
    query {
      articles {
        id
        title
        excerpt
        author {
          name
        }
        section {
          name
        }
      }
    }
  `;

  return await graphqlRequest(query);
}
```

**Uso:**
```javascript
import { getUsers, createUser, getArticles } from './utils/graphqlClient';

// Listar usuários
async function loadUsers() {
  try {
    const data = await getUsers();
    console.log(data.users);
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Criar usuário
async function addUser() {
  try {
    const data = await createUser({
      name: "João Silva",
      email: "joao@exemplo.com",
      password: "senha123",
      role: "writer"
    });
    console.log('Usuário criado:', data.createUser);
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Buscar artigos
async function loadArticles() {
  try {
    const data = await getArticles();
    console.log(data.articles);
  } catch (error) {
    console.error('Erro:', error);
  }
}
```

---

### **Opção 3: Axios**

```bash
npm install axios
```

```javascript
// services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/graphql',
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function graphqlQuery(query, variables = {}) {
  const response = await api.post('', {
    query,
    variables,
  });

  if (response.data.errors) {
    throw new Error(response.data.errors[0].message);
  }

  return response.data.data;
}

// Funções específicas
export const userService = {
  async getAll() {
    const query = `
      query {
        users {
          id name email role avatar
        }
      }
    `;
    const data = await graphqlQuery(query);
    return data.users;
  },

  async create(userData) {
    const query = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          id name email role
        }
      }
    `;
    const data = await graphqlQuery(query, { input: userData });
    return data.createUser;
  },

  async update(id, userData) {
    const query = `
      mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
        updateUser(id: $id, input: $input) {
          id name email role
        }
      }
    `;
    const data = await graphqlQuery(query, { id, input: userData });
    return data.updateUser;
  },
};

export const articleService = {
  async getAll() {
    const query = `
      query {
        articles {
          id title excerpt status views
          author { name }
          section { name }
        }
      }
    `;
    const data = await graphqlQuery(query);
    return data.articles;
  },

  async create(articleData) {
    const query = `
      mutation CreateArticle($input: CreateArticleInput!) {
        createArticle(input: $input) {
          id title status
        }
      }
    `;
    const data = await graphqlQuery(query, { input: articleData });
    return data.createArticle;
  },

  async incrementViews(id) {
    const query = `
      mutation IncrementViews($id: ID!) {
        incrementArticleViews(id: $id) {
          id views
        }
      }
    `;
    const data = await graphqlQuery(query, { id });
    return data.incrementArticleViews;
  },
};
```

**Uso nos componentes:**
```javascript
import { userService, articleService } from './services/api';

async function loadData() {
  // Carregar usuários
  const users = await userService.getAll();
  console.log(users);

  // Criar usuário
  const newUser = await userService.create({
    name: "Maria Santos",
    email: "maria@exemplo.com",
    password: "senha123",
    role: "editor"
  });

  // Carregar artigos
  const articles = await articleService.getAll();
  console.log(articles);

  // Incrementar views
  await articleService.incrementViews('1');
}
```

---

## 🎯 Exemplo Completo React + Apollo Client

```javascript
// pages/UsersPage.jsx
import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      avatar
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      role
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export default function UsersPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'writer'
  });

  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [createUser] = useMutation(CREATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser({ variables: { input: formData } });
      setFormData({ name: '', email: '', password: '', role: 'writer' });
      refetch();
      alert('Usuário criado!');
    } catch (err) {
      alert('Erro: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Tem certeza?')) {
      try {
        await deleteUser({ variables: { id } });
        refetch();
      } catch (err) {
        alert('Erro: ' + err.message);
      }
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error.message}</p>;

  return (
    <div>
      <h1>Gerenciar Usuários</h1>
      
      {/* Formulário */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="writer">Writer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Criar Usuário</button>
      </form>

      {/* Lista */}
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Role</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 🔑 Dicas Importantes

1. **CORS**: Certifique-se de que o backend aceita requisições do frontend (já configurado com `cors()`)

2. **Ambiente de Produção**: Use variáveis de ambiente:
```javascript
const GRAPHQL_ENDPOINT = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql';
```

3. **Tratamento de Erros**: Sempre adicione try/catch

4. **Loading States**: Mostre feedback visual durante requisições

5. **Cache**: Apollo Client cacheia automaticamente

## 📚 Queries Prontas para Usar

Todas as queries disponíveis no arquivo [GRAPHQL_QUERIES.md](./GRAPHQL_QUERIES.md) (vou criar a seguir)
