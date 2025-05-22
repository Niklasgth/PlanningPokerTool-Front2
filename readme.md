<h1>Planning Poker Tool – Frontend</h1>
<p><strong>Tech Stack:</strong> React + TypeScript + Vite</p>
<p>This is the frontend for the Planning Poker Tool – a task estimation app using React, Axios, and Spring Boot (backend).</p>
<hr>
<h2>What’s included</h2>
<ul>
<li>React with TypeScript</li>
<li>Vite for fast development</li>
<li>Axios for backend communication</li>
<li>CSS Modules for scoped styles</li>
<li>React Router DOM for navigation</li>
</ul>
<hr>
<h2>Getting Started</h2>
<h3>1. Clone the project or create new</h3>
If you're starting from scratch:
<pre><code>npm create vite@latest planning-poker -- --template react-ts
cd planning-poker
</code></pre>
<h3>2. Install dependencies</h3>
<pre><code>npm install</code></pre>
<h3>3. Install required packages</h3>
These are not included by default:
<pre><code>npm install axios react-router-dom</code></pre>
<h3>4. Set environment variables</h3>
Create a file called <code>.env</code> in the project root and add:
<pre><code>VITE_API_URL=http://localhost:8080/api</code></pre>
This connects the frontend to your Spring Boot backend.
<h3>5. Run the development server</h3>
<pre><code>npm run dev</code></pre>
Then open your browser at:
<pre><code>http://localhost:5173</code></pre>
<hr>
<h2>Project Structure Overview</h2>
<pre>
src/
├── api/ → Axios API calls (getUsers, createUser, etc.)
├── components/
│ ├── loginPage/
│ ├── mypage/
│ ├── taskList/
│ └── ...
├── AppRoutes.tsx → React Router configuration
└── main.tsx → App entry point with <BrowserRouter>
</pre>
<hr>
<h2> Backend Integration</h2>
This frontend expects a Spring Boot backend running on:
OBS! if not deployed !!! change this when we deployed it..
<pre><code>http://localhost:8080/api</code></pre>
<h3>Example endpoints:</h3>
<ul>
<li><code>GET /users</code></li>
<li><code>POST /user</code></li>
<li><code>GET /tasks</code></li>
<li><code>POST /task</code></li>
</ul>
<hr>
Then restart the backend.
<hr>
<h2>Features</h2>
<ul>
<li>User registration with validation</li>
<li>Login form (frontend only)</li>
<li>Fetch and list tasks from backend</li>
<li>Popup to create new tasks</li>
<li>React Router navigation between pages</li>
</ul>
<hr>
<h2> Production Build</h2>
To create a production build:
<pre><code>npm run build</code></pre>
<hr>
<h2> Known Bugs</h2>
<ul>
<li>User can create a task without name. Needs proper validation</li>
<li>When you view the task statistics, some tasks show one vote. But when you open the task details, there are no votes recorded.</li>
</ul>
