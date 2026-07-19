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
    result.innerHTML = "⚠️ దయచేసి అన్ని వివరాలు నమోదు చేయండి.";
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
