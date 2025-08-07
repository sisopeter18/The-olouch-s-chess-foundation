// Dynamic programs data
let programs = [
    { title: "Youth Chess Clubs", description: "Weekly sessions for kids to learn and compete.", icon: "fas fa-graduation-cap" },
    { title: "Tournaments", description: "Local & national chess competitions.", icon: "fas fa-trophy" },
    { title: "Teacher Training", description: "Workshops for educators to integrate chess in schools.", icon: "fas fa-chalkboard-teacher" }
];

function renderPrograms() {
    const container = document.getElementById('programs-container');
    container.innerHTML = "";
    programs.forEach(program => {
        const card = document.createElement('div');
        card.className = "program-card";
        card.innerHTML = `
            <i class="${program.icon}"></i>
            <h3>${program.title}</h3>
            <p>${program.description}</p>
        `;
        container.appendChild(card);
    });
}
renderPrograms();

// Dynamic events data
let events = [
    { name: "Inter-School Chess Challenge", date: "2025-08-10" },
    { name: "Youth Rapid Tournament", date: "2025-08-15" }
];

// Simple admin authentication (for demo purposes)
let isAdmin = false;
function adminLogin() {
    const password = prompt("Enter admin password:");
    // Replace 'admin123' with your secure password
    if (password === "admin123") {
        isAdmin = true;
        document.getElementById('add-event-btn').style.display = "inline-block";
        renderEvents();
        alert("Admin mode enabled.");
    } else {
        alert("Incorrect password.");
    }
}

// Store participants per event (in-memory for demo; use backend for persistence)
let participants = {};

// Store uploaded documents (in-memory for demo)
let uploadedDocs = [];

// Render events and allow signup
function renderEvents() {
    const list = document.getElementById('events-list');
    list.innerHTML = "";
    const today = new Date();
    events = events.filter(event => new Date(event.date) >= today);
    events.forEach((event, idx) => {
        const li = document.createElement('li');
        li.textContent = `${event.name} - ${event.date}`;
        // Signup button for all users
        const signupBtn = document.createElement('button');
        signupBtn.textContent = "Sign Up";
        signupBtn.className = "btn";
        signupBtn.style.marginLeft = "10px";
        signupBtn.onclick = () => openSignupModal(idx);
        li.appendChild(signupBtn);

        // Remove button for admin only
        if (isAdmin) {
            const removeBtn = document.createElement('button');
            removeBtn.textContent = "Remove";
            removeBtn.className = "btn";
            removeBtn.style.marginLeft = "10px";
            removeBtn.onclick = () => {
                events.splice(idx, 1);
                renderEvents();
                renderParticipantsData();
            };
            li.appendChild(removeBtn);
        }
        // Show number of participants
        const count = participants[event.name]?.length || 0;
        const partSpan = document.createElement('span');
        partSpan.textContent = ` (${count} signed up)`;
        partSpan.style.marginLeft = "10px";
        li.appendChild(partSpan);

        list.appendChild(li);
    });
    renderParticipantsData();
}
renderEvents();

// Signup modal logic
function openSignupModal(eventIdx) {
    document.getElementById('signup-modal').style.display = "flex";
    document.getElementById('signup-form').onsubmit = function (e) {
        e.preventDefault();
        const form = e.target;
        const data = {
            name: form.name.value,
            gender: form.gender.value,
            dob: form.dob.value,
            age: form.age.value,
            level: form.level.value
        };
        const eventName = events[eventIdx].name;
        if (!participants[eventName]) participants[eventName] = [];
        participants[eventName].push(data);
        alert("Signup successful!");
        document.getElementById('signup-modal').style.display = "none";
        renderEvents();
        form.reset();
    };
    document.getElementById('close-signup').onclick = function () {
        document.getElementById('signup-modal').style.display = "none";
        document.getElementById('signup-form').reset();
    };
}

// Show participants data to admin only
function renderParticipantsData() {
    const adminDiv = document.getElementById('admin-participants');
    const dataDiv = document.getElementById('participants-data');
    if (isAdmin) {
        adminDiv.style.display = "block";
        let html = "";
        Object.keys(participants).forEach(eventName => {
            html += `<strong>${eventName}</strong>
            <table border="1" cellpadding="5" style="margin-bottom:15px;">
                <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Date of Birth</th>
                    <th>Age</th>
                    <th>Level</th>
                </tr>`;
            participants[eventName].forEach(p => {
                html += `<tr>
                    <td>${p.name}</td>
                    <td>${p.gender}</td>
                    <td>${p.dob}</td>
                    <td>${p.age}</td>
                    <td>${p.level}</td>
                </tr>`;
            });
            html += "</table>";
        });
        dataDiv.innerHTML = html || "<em>No participants yet.</em>";
        renderUploadedDocs();
    } else {
        adminDiv.style.display = "none";
        dataDiv.innerHTML = "";
    }
    renderParticipantDocs();
}

// Download participants list as CSV
document.getElementById('download-participants-btn').onclick = function () {
    if (!isAdmin) return;
    let csv = "Event,Name,Gender,Date of Birth,Age,Level\n";
    Object.keys(participants).forEach(eventName => {
        participants[eventName].forEach(p => {
            csv += `"${eventName}","${p.name}","${p.gender}","${p.dob}","${p.age}","${p.level}"\n`;
        });
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'participants_list.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Admin uploads document
document.getElementById('upload-btn').onclick = function () {
    if (!isAdmin) return;
    const fileInput = document.getElementById('admin-upload');
    if (fileInput.files.length === 0) {
        alert("Please select a file to upload.");
        return;
    }
    const file = fileInput.files[0];
    // For demo, just store file name and URL (real app: upload to server)
    const url = URL.createObjectURL(file);
    uploadedDocs.push({ name: file.name, url });
    fileInput.value = "";
    renderUploadedDocs();
    renderParticipantDocs();
    alert("Document uploaded and available to participants.");
};

// Show uploaded docs to admin
function renderUploadedDocs() {
    const docsDiv = document.getElementById('uploaded-docs');
    let html = "<ul>";
    uploadedDocs.forEach(doc => {
        html += `<li><a href="${doc.url}" target="_blank">${doc.name}</a></li>`;
    });
    html += "</ul>";
    docsDiv.innerHTML = html;
}

// Show uploaded docs to participants
function renderParticipantDocs() {
    const docsDiv = document.getElementById('participant-docs');
    const listDiv = document.getElementById('docs-list');
    if (uploadedDocs.length > 0) {
        docsDiv.style.display = "block";
        let html = "<ul>";
        uploadedDocs.forEach(doc => {
            html += `<li><a href="${doc.url}" target="_blank">${doc.name}</a></li>`;
        });
        html += "</ul>";
        listDiv.innerHTML = html;
    } else {
        docsDiv.style.display = "none";
        listDiv.innerHTML = "";
    }
}

// Add event button functionality (admin only)
document.getElementById('add-event-btn').onclick = function () {
    if (!isAdmin) return;
    const name = prompt("Enter event name:");
    const date = prompt("Enter event date (YYYY-MM-DD):");
    if (name && date && !isNaN(Date.parse(date))) {
        events.push({ name, date });
        renderEvents();
    } else {
        alert("Please enter a valid event name and date.");
    }
}

// Add a login button for admin
const loginBtn = document.createElement('button');
loginBtn.textContent = "Admin Login";
loginBtn.className = "btn";
loginBtn.style.marginTop = "10px";
loginBtn.onclick = adminLogin;
document.querySelector('.events-section').appendChild(loginBtn);