let jathakamFullReport = "";
let jathakamApiText = "";

async function generateJathakam() {
  const loading = document.getElementById("loading");
  const result = document.getElementById("result");

  loading.style.display = "block";
  result.innerHTML = "";

  const name = document.getElementById("name").value.trim();
  const gender = document.getElementById("gender").value;
  const dob = document.getElementById("dob").value;
  const time = document.getElementById("tob").value;
  const place = document.getElementById("place").value.trim();

  if (!name || !gender || !dob || !time || !place) {
    loading.style.display = "none";
    jathakamApiText = await response.text();

const parser = new DOMParser();
const doc = parser.parseFromString(jathakamApiText, "text/html");

let cleanText = doc.body
  ? doc.body.innerText.trim()
  : jathakamApiText.trim();

jathakamFullReport = cleanText;

result.innerHTML = `
  <div class="jathakam-report">

    <div class="report-title">
      <h2>📜 సంపూర్ణ జన్మ జాతకం</h2>
      <p>${name} గారి జాతక వివరాలు</p>
    </div>

    <div class="report-section">
      <h3>👤 వ్యక్తిగత వివరాలు</h3>

      <div class="details-grid">
        <p><b>పేరు:</b> ${name}</p>
        <p><b>లింగం:</b> ${gender}</p>
        <p><b>పుట్టిన తేదీ:</b> ${dob}</p>
        <p><b>పుట్టిన సమయం:</b> ${time}</p>
        <p><b>పుట్టిన స్థలం:</b> ${place}</p>
      </div>
    </div>

    <div class="report-section">
      <h3>🌟 జన్మ జాతక సమాచారం</h3>

      <div class="jathakam-text">
        ${cleanText.replace(/\n/g, "<br>")}
      </div>
    </div>

    <div class="report-buttons">

      <button onclick="showJathakamSummary()">
        📋 సారాంశం
      </button>

      <button onclick="shareJathakam()">
        📲 వాట్సాప్
      </button>

      <button onclick="window.print()">
        🖨️ ప్రింట్
      </button>

    </div>

  </div>
`;
    return;
  }

  const d = dob.split("-");
  const birthdate = `${d[2]}-${d[1]}-${d[0]}`;

  const body =
    `name=${encodeURIComponent(name)}` +
    `&birthdate=${encodeURIComponent(birthdate)}` +
    `&birthtime=${encodeURIComponent(time)}` +
    `&City=${encodeURIComponent(place.toUpperCase())}`;

  try {
    const response = await fetch("https://kundli1.p.rapidapi.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "a97e48a6b4msh1f863e6605b79e5p188a89jsnac6609305923",
        "X-RapidAPI-Host": "kundli1.p.rapidapi.com"
      },
      body: body
    });

    const text = await response.text();
    jathakamApiText = text;

    if (!response.ok) {
      throw new Error("API లోపం: " + response.status);
    }

    loading.style.display = "none";

    jathakamFullReport = `
      <div class="card">
        <h2>📜 జన్మ జాతకం</h2>

        <p><b>👤 పేరు:</b> ${name}</p>
        <p><b>🚻 లింగం:</b> ${gender}</p>
        <p><b>📅 జనన తేదీ:</b> ${dob}</p>
        <p><b>🕐 జనన సమయం:</b> ${time}</p>
        <p><b>📍 జనన స్థలం:</b> ${place}</p>

        <hr>

        <h3>🪐 జాతక వివరాలు</h3>

        <div class="api-result">
          ${text}
        </div>
      </div>
    `;

    result.innerHTML = jathakamFullReport;

  } catch (error) {
    loading.style.display = "none";
    result.innerHTML = "❌ లోపం: " + error.message;
  }
}

function showTab(tabName) {
  const result = document.getElementById("result");

  if (!jathakamFullReport) {
    alert("ముందుగా జాతకం తయారు చేయండి.");
    return;
  }
if (tabName === "summary") {
  const parser = new DOMParser();
  const doc = parser.parseFromString(jathakamApiText, "text/html");
  const reportText = doc.body.innerText;

  result.innerHTML = `
    <div class="card">
      <h2>📋 జాతక సారాంశం</h2>
      <pre style="white-space: pre-wrap;">${reportText}</pre>
    </div>
  `;
}
   else if (tabName === "kundli") {
    result.innerHTML = `
      <div class="card">
        <h2>🪐 కుండలి వివరాలు</h2>
        <p>కుండలి ట్యాబ్ పనిచేస్తోంది.</p>
      </div>
    `;
  } else if (tabName === "ashtaka") {
    result.innerHTML = `
      <div class="card">
        <h2>📊 అష్టకవర్గం</h2>
        <p>అష్టకవర్గం ట్యాబ్ పనిచేస్తోంది.</p>
      </div>
    `;
  } else if (tabName === "full") {
    result.innerHTML = jathakamFullReport;
  }
}

function shareJathakam() {
  const text = document.getElementById("result").innerText.trim();

  if (!text) {
    alert("ముందుగా జాతకం తయారు చేయండి.");
    return;
  }

  const url = "https://wa.me/?text=" + encodeURIComponent(text);
  window.open(url, "_blank");
}
function showJathakamSummary() {

  const result = document.getElementById("result");

  if (!jathakamFullReport) {
    alert("ముందుగా జాతకం తయారు చేయండి.");
    return;
  }

  const lines = jathakamFullReport
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "");

  const summaryText = lines.slice(0, 20).join("<br>");

  result.innerHTML = `
    <div class="jathakam-report">

      <div class="report-title">
        <h2>📋 జాతక సారాంశం</h2>
      </div>

      <div class="report-section">
        <div class="jathakam-text">
          ${summaryText}
        </div>
      </div>

      <div class="report-buttons">

        <button onclick="showFullJathakam()">
          📜 పూర్తి జాతకం
        </button>

        <button onclick="shareJathakam()">
          📲 వాట్సాప్
        </button>

        <button onclick="window.print()">
          🖨️ ప్రింట్
        </button>

      </div>

    </div>
  `;
}


function showFullJathakam() {

  const result = document.getElementById("result");

  result.innerHTML = `
    <div class="jathakam-report">

      <div class="report-title">
        <h2>📜 సంపూర్ణ జన్మ జాతకం</h2>
      </div>

      <div class="report-section">
        <div class="jathakam-text">
          ${jathakamFullReport.replace(/\n/g, "<br>")}
        </div>
      </div>

      <div class="report-buttons">

        <button onclick="showJathakamSummary()">
          📋 సారాంశం
        </button>

        <button onclick="shareJathakam()">
          📲 వాట్సాప్
        </button>

        <button onclick="window.print()">
          🖨️ ప్రింట్
        </button>

      </div>

    </div>
  `;
}
.jathakam-report {
  margin-top: 25px;
  padding: 18px;
  background: #fffdf7;
  border-radius: 18px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  text-align: left;
}

.report-title {
  text-align: center;
  padding: 15px;
  margin-bottom: 18px;
  color: #7a1f00;
  background: linear-gradient(135deg, #ffd88a, #fff3cf);
  border-radius: 14px;
}

.report-title h2 {
  margin: 0 0 5px;
}

.report-title p {
  margin: 0;
  color: #5c3a20;
}

.report-section {
  padding: 15px;
  margin-bottom: 16px;
  background: white;
  border-left: 5px solid #d78300;
  border-radius: 12px;
}

.report-section h3 {
  margin-top: 0;
  color: #8b2f00;
  border-bottom: 1px solid #f0d7ac;
  padding-bottom: 8px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 15px;
}

.details-grid p {
  margin: 5px 0;
}

.jathakam-text {
  line-height: 1.9;
  color: #292929;
  word-wrap: break-word;
  white-space: normal;
}

.report-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
}

.report-buttons button {
  width: auto;
  min-width: 130px;
  padding: 12px 18px;
}

@media screen and (max-width: 600px) {
  .details-grid {
    grid-template-columns: 1fr;
  }

  .jathakam-report {
    padding: 10px;
  }

  .report-buttons button {
    width: 100%;
  }
}
