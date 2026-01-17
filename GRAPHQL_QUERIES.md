# 📝 Coleção de Queries GraphQL - Líderes Angola

## 👥 USERS (Usuários)

### Listar todos os usuários
```graphql
query GetUsers {
  users {
    id
    name
    email
    role
    avatar
    createdAt
    updatedAt
  }
}
```

### Buscar usuário por ID
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    role
    avatar
    articles {
      id
      title
    }
  }
}
```

### Buscar usuários por role
```graphql
query GetUsersByRole($role: String!) {
  usersByRole(role: $role) {
    id
    name
    email
    role
  }
}
```

### Criar usuário
```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
    role
  }
}
```
**Variables:**
```json
{
  "input": {
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "password": "senha123",
    "role": "writer",
    "avatar": "https://exemplo.com/avatar.jpg"
  }
}
```

### Atualizar usuário
```graphql
mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    name
    email
    role
  }
}
```
**Variables:**
```json
{
  "id": "1",
  "input": {
    "name": "João Silva Atualizado",
    "role": "editor"
  }
}
```

### Deletar usuário
```graphql
mutation DeleteUser($id: ID!) {
  deleteUser(id: $id)
}
```

---

## 📰 ARTICLES (Artigos)

### Listar todos os artigos
```graphql
query GetArticles {
  articles {
    id
    title
    excerpt
    content
    status
    isFeatured
    views
    author {
      id
      name
      email
    }
    section {
      id
      name
      slug
    }
    edition {
      id
      title
    }
    createdAt
    updatedAt
  }
}
```

### Buscar artigo por ID
```graphql
query GetArticle($id: ID!) {
  article(id: $id) {
    id
    title
    excerpt
    content
    status
    isFeatured
    views
    author {
      name
      email
      avatar
    }
    section {
      name
    }
    edition {
      title
      coverImage
    }
  }
}
```

### Artigos por seção
```graphql
query GetArticlesBySection($sectionId: ID!) {
  articlesBySection(sectionId: $sectionId) {
    id
    title
    excerpt
    status
    author {
      name
    }
  }
}
```

### Artigos por edição
```graphql
query GetArticlesByEdition($editionId: ID!) {
  articlesByEdition(editionId: $editionId) {
    id
    title
    excerpt
    status
  }
}
```

### Artigos por autor
```graphql
query GetArticlesByAuthor($authorId: ID!) {
  articlesByAuthor(authorId: $authorId) {
    id
    title
    excerpt
    status
    createdAt
  }
}
```

### Artigos em destaque
```graphql
query GetFeaturedArticles {
  featuredArticles {
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
```

### Criar artigo
```graphql
mutation CreateArticle($input: CreateArticleInput!) {
  createArticle(input: $input) {
    id
    title
    status
  }
}
```
**Variables:**
```json
{
  "input": {
    "title": "Angola: Economia em Crescimento",
    "excerpt": "Análise do crescimento econômico...",
    "content": "Conteúdo completo do artigo...",
    "authorId": 1,
    "sectionId": 1,
    "editionId": 1,
    "status": "draft",
    "isFeatured": false
  }
}
```

### Atualizar artigo
```graphql
mutation UpdateArticle($id: ID!, $input: UpdateArticleInput!) {
  updateArticle(id: $id, input: $input) {
    id
    title
    status
    updatedAt
  }
}
```
**Variables:**
```json
{
  "id": "1",
  "input": {
    "title": "Título Atualizado",
    "status": "published",
    "isFeatured": true
  }
}
```

### Atualizar status do artigo
```graphql
mutation UpdateArticleStatus($id: ID!, $status: String!) {
  updateArticleStatus(id: $id, status: $status) {
    id
    status
  }
}
```
**Variables:**
```json
{
  "id": "1",
  "status": "published"
}
```

### Incrementar visualizações
```graphql
mutation IncrementArticleViews($id: ID!) {
  incrementArticleViews(id: $id) {
    id
    views
  }
}
```

### Deletar artigo
```graphql
mutation DeleteArticle($id: ID!) {
  deleteArticle(id: $id)
}
```

---

## 📑 SECTIONS (Seções)

### Listar todas as seções
```graphql
query GetSections {
  sections {
    id
    name
    slug
    description
    createdAt
  }
}
```

### Buscar seção por ID
```graphql
query GetSection($id: ID!) {
  section(id: $id) {
    id
    name
    slug
    description
    articles {
      id
      title
      status
    }
  }
}
```

### Criar seção
```graphql
mutation CreateSection($input: CreateSectionInput!) {
  createSection(input: $input) {
    id
    name
    slug
  }
}
```
**Variables:**
```json
{
  "input": {
    "name": "Economia",
    "slug": "economia",
    "description": "Notícias sobre economia angolana"
  }
}
```

### Atualizar seção
```graphql
mutation UpdateSection($id: ID!, $input: UpdateSectionInput!) {
  updateSection(id: $id, input: $input) {
    id
    name
    slug
    description
  }
}
```

### Deletar seção
```graphql
mutation DeleteSection($id: ID!) {
  deleteSection(id: $id)
}
```

---

## 📚 EDITIONS (Edições)

### Listar todas as edições
```graphql
query GetEditions {
  editions {
    id
    title
    publicationDate
    status
    coverImage
    createdAt
  }
}
```

### Edições publicadas
```graphql
query GetPublishedEditions {
  publishedEditions {
    id
    title
    publicationDate
    coverImage
  }
}
```

### Buscar edição por ID
```graphql
query GetEdition($id: ID!) {
  edition(id: $id) {
    id
    title
    publicationDate
    status
    coverImage
    articles {
      id
      title
      excerpt
      author {
        name
      }
    }
  }
}
```

### Criar edição
```graphql
mutation CreateEdition($input: CreateEditionInput!) {
  createEdition(input: $input) {
    id
    title
    status
  }
}
```
**Variables:**
```json
{
  "input": {
    "title": "Edição Janeiro 2026",
    "publicationDate": "2026-01-16T00:00:00Z",
    "status": "draft",
    "coverImage": "https://exemplo.com/capa.jpg"
  }
}
```

### Atualizar edição
```graphql
mutation UpdateEdition($id: ID!, $input: UpdateEditionInput!) {
  updateEdition(id: $id, input: $input) {
    id
    title
    status
  }
}
```

### Publicar edição
```graphql
mutation PublishEdition($id: ID!) {
  publishEdition(id: $id) {
    id
    title
    status
    publicationDate
  }
}
```

### Deletar edição
```graphql
mutation DeleteEdition($id: ID!) {
  deleteEdition(id: $id)
}
```

---

## 🎯 QUERIES COMBINADAS

### Dashboard completo
```graphql
query GetDashboard {
  articles {
    id
    title
    status
  }
  users {
    id
    name
    role
  }
  sections {
    id
    name
  }
  editions {
    id
    title
    status
  }
}
```

### Artigo completo com todas as relações
```graphql
query GetFullArticle($id: ID!) {
  article(id: $id) {
    id
    title
    excerpt
    content
    status
    isFeatured
    views
    createdAt
    updatedAt
    author {
      id
      name
      email
      avatar
      role
    }
    section {
      id
      name
      slug
      description
    }
    edition {
      id
      title
      publicationDate
      coverImage
      status
    }
  }
}
```

### Estatísticas gerais
```graphql
query GetStats {
  articles {
    id
    status
    views
  }
  users {
    id
    role
  }
  featuredArticles {
    id
  }
}
```

---

## 📋 Status Disponíveis

### Artigos:
- `draft` - Rascunho
- `pending_review` - Pendente de revisão
- `approved` - Aprovado
- `rejected` - Rejeitado
- `published` - Publicado

### Edições:
- `draft` - Rascunho
- `published` - Publicada
- `archived` - Arquivada

### Roles de Usuários:
- `admin` - Administrador
- `editor` - Editor
- `writer` - Escritor/Jornalista
