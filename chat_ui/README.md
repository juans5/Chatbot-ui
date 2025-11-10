# ChatBot UI

Una interfaz de chat moderna, rápida y escalable construida con **React + TypeScript + Zustand + TailwindCSS**.  
Perfecta para integrar con tu backend de IA, login, temas oscuros y más.

---

## Características

- **Login / Registro** con validación
- **Estado global** con Zustand (persistente)
- **Tema oscuro/claro automático** (sistema + guardado)
- **Diseño responsive** (móvil y escritorio)
- **Carga, errores y feedback visual**
- **Navegación protegida** (React Router)
- **API con Axios** (fácil de conectar)

---

## Tecnologías

| Tech                   | Uso                        |
| ---------------------- | -------------------------- |
| **React + TypeScript** | UI segura y tipada         |
| **Vite**               | Desarrollo ultrarrápido    |
| **Zustand**            | Estado global ligero       |
| **TailwindCSS**        | Estilos rápidos y modernos |
| **React Router**       | Navegación                 |
| **Axios**              | Peticiones HTTP            |

---

## Estructura de carpetas

src/
├── components/ # Botones, inputs, cards
├── views/ # Páginas: Login, Register, Chat
├── stores/ # Zustand: user, theme, chat
├── routes/ # Rutas protegidas
├── App.tsx
└── main.tsx
