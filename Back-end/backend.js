// URL base del backend
const API_URL = "http://localhost:3000/skills";

const skillForm = document.getElementById("skillForm");
const skillsList = document.getElementById("skillsList");

let allSkills = [];

/* ===============================
   CARGAR SKILLS AL INICIAR
================================ */
document.addEventListener("DOMContentLoaded", loadSkills);

async function loadSkills() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        allSkills = data;
        displaySkills(allSkills);
    } catch (error) {
        console.error("Error cargando habilidades:", error);
    }
}

/* ===============================
   MOSTRAR SKILLS
================================ */
function displaySkills(skills) {
    skillsList.innerHTML = "";

    skills.forEach(skill => {
        const card = document.createElement("div");
        card.classList.add("skill-card");

        card.innerHTML = `
            <h3>${skill.title}</h3>
            <p>${skill.description}</p>
            <small>${skill.category} - ${skill.type}</small>
            <div class="card-buttons">
                <button class="edit-btn" onclick="editSkill('${skill._id}')">Editar</button>
                <button class="delete-btn" onclick="deleteSkill('${skill._id}')">Eliminar</button>
            </div>
        `;

        skillsList.appendChild(card);
    });
}

/* ===============================
   CREAR SKILL
================================ */
skillForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newSkill = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        category: document.getElementById("category").value,
        type: document.getElementById("type").value
    };

    try {
        await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newSkill)
        });

        skillForm.reset();
        loadSkills();
    } catch (error) {
        console.error("Error creando skill:", error);
    }
});

/* ===============================
   ELIMINAR SKILL
================================ */
async function deleteSkill(id) {
    if (!confirm("¿Seguro que quieres eliminar esta publicación?")) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        loadSkills();
    } catch (error) {
        console.error("Error eliminando skill:", error);
    }
}

/* ===============================
   EDITAR SKILL
================================ */
async function editSkill(id) {
    const newTitle = prompt("Nuevo título:");
    const newDescription = prompt("Nueva descripción:");

    if (!newTitle || !newDescription) return;

    try {
        await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: newTitle,
                description: newDescription
            })
        });

        loadSkills();
    } catch (error) {
        console.error("Error actualizando skill:", error);
    }
}

/* ===============================
   FILTRAR SKILLS
================================ */
function filterSkills(type) {
    if (type === "all") {
        displaySkills(allSkills);
    } else {
        const filtered = allSkills.filter(skill => skill.type === type);
        displaySkills(filtered);
    }
}