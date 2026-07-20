let jathakamFullReport = "";
let jathakamApiText = "";
let currentPersonDetails = null;

/* =========================================
   జాతకం తయారు చేసే ప్రధాన Function
========================================= */

async function generateJathakam() {
  const loading = document.getElementById("loading");
  const result = document.getElementById("result");

  const name = document.getElementById("name").value.trim();
  const gender = document.getElementById("gender").value;
  const dob = document.getElementById("dob").value;
  const time = document.getElementById("tob").value;
  const place = document.getElementById("place").value.trim();

  if (!name || !gender || !dob || !time || !place) {
    result.innerHTML =
      '<div class="error-message">⚠️ దయచేసి అన్ని వివరాలు నమోదు చేయండి.</div>';
    return;
  }

  loading.style.display = "block";
  result.innerHTML = "";

  currentPersonDetails = {
    name,
    gender,
    dob,
    time,
    place
  };

  const dateParts = dob.split("-");

  if (dateParts.length !== 3) {
    loading.style.display = "none";
    result.innerHTML =
      '<div class="error-message">⚠️ పుట్టిన తేదీ సరిగా నమోదు చేయండి.</div>';
    return;
  }

  const birthdate =
    `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

  const body =
    `name=${encodeURIComponent(name)}` +
    `&birthdate=${encodeURIComponent(birthdate)}` +
    `&birthtime=${encodeURIComponent(time)}` +
    `&City=${encodeURIComponent(place.toUpperCase())}`;

  try {
    const response = await fetch(
      "https://kundli1.p.rapidapi.com/",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",

            "X-RapidAPI-Key": "a97e48a6b4msh1f863e6605b79e5p188a89jsnac6609305923",

          "X-RapidAPI-Host":
            "kundli1.p.rapidapi.com"
        },

        body: body
      }
    );

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status}`
      );
    }

    jathakamApiText = await response.text();

    const cleanText =
      cleanApiResponse(jathakamApiText);

    if (!cleanText) {
      throw new Error(
        "API నుంచి జాతక సమాచారం రాలేదు."
      );
    }

    jathakamFullReport = cleanText;

    showFullJathakam();

  } catch (error) {
    console.error("Jathakam Error:", error);

    result.innerHTML = `
      <div class="error-message">
        <h3>⚠️ జాతకం తయారు కాలేదు</h3>

        <p>
          ఇంటర్నెట్ కనెక్షన్ లేదా RapidAPI Key
          సరిగా ఉందో పరిశీలించండి.
        </p>

        <p>
          <b>వివరం:</b>
          ${escapeHtml(error.message)}
        </p>
      </div>
    `;

  } finally {
    loading.style.display = "none";
  }
}


/* =========================================
   API HTML/Text శుభ్రం చేయడం
========================================= */

function cleanApiResponse(apiText) {
  if (!apiText) {
    return "";
  }

  const parser = new DOMParser();

  const doc = parser.parseFromString(
    apiText,
    "text/html"
  );

  const unwantedSelectors = [
    "script",
    "style",
    "nav",
    "footer",
    "header",
    "form",
    "button",
    "iframe",
    "noscript"
  ];

  unwantedSelectors.forEach(selector => {
    doc.querySelectorAll(selector).forEach(element => {
      element.remove();
    });
  });

  let cleanText = "";

  if (doc.body) {
    cleanText = doc.body.innerText;
  } else {
    cleanText = apiText;
  }

  cleanText = cleanText
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n[ ]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  cleanText = removeUnwantedLines(cleanText);

  return cleanText;
}


/* =========================================
   అవసరం లేని API లైన్లు తొలగించడం
========================================= */

function removeUnwantedLines(text) {
  const unwantedWords = [
    "your title here",
    "undefined",
    "null",
    "javascript",
    "copyright",
    "all rights reserved"
  ];

  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "");

  const cleanedLines = lines.filter(line => {
    const lowerLine = line.toLowerCase();

    return !unwantedWords.some(word =>
      lowerLine === word ||
      lowerLine.includes(word)
    );
  });

  return cleanedLines.join("\n");
}


/* =========================================
   పూర్తి జాతకం చూపించడం
========================================= */

function showFullJathakam() {
  const result = document.getElementById("result");

  if (!jathakamFullReport) {
    alert("ముందుగా జాతకం తయారు చేయండి.");
    return;
  }

  const details = currentPersonDetails || {};

  result.innerHTML = `
    <div class="jathakam-report">

      <div class="report-title">
        <h2>📜 సంపూర్ణ జన్మ జాతకం</h2>

        <p>
          ${escapeHtml(details.name || "")}
          గారి జాతక వివరాలు
        </p>
      </div>

      ${createPersonalDetailsHtml(details)}

      <div class="report-section">

        <h3>🌟 జాతక సమాచారం</h3>

        <div class="jathakam-text">
          ${formatReportText(jathakamFullReport)}
        </div>

      </div>

      ${createReportButtonsHtml("full")}

    </div>
  `;

  scrollToResult();
}


/* =========================================
   సారాంశం చూపించడం
========================================= */

function showJathakamSummary() {
  const result = document.getElementById("result");

  if (!jathakamFullReport) {
    alert("ముందుగా జాతకం తయారు చేయండి.");
    return;
  }

  const details = currentPersonDetails || {};
  const summaryText =
    createSummary(jathakamFullReport);

  result.innerHTML = `
    <div class="jathakam-report">

      <div class="report-title">
        <h2>📋 జాతక సారాంశం</h2>

        <p>
          ${escapeHtml(details.name || "")}
          గారి ముఖ్యమైన జాతక వివరాలు
        </p>
      </div>

      ${createPersonalDetailsHtml(details)}

      <div class="report-section">

        <h3>🔮 ముఖ్య సమాచారం</h3>

        <div class="jathakam-text">
          ${formatReportText(summaryText)}
        </div>

      </div>

      ${createReportButtonsHtml("summary")}

    </div>
  `;

  scrollToResult();
}


/* =========================================
   జాతక సారాంశం తయారు చేయడం
========================================= */

function createSummary(fullText) {
  const lines = fullText
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 2);

  if (lines.length <= 25) {
    return lines.join("\n");
  }

  const importantWords = [
    "ascendant",
    "lagna",
    "rasi",
    "rashi",
    "nakshatra",
    "moon",
    "sun",
    "mars",
    "mercury",
    "jupiter",
    "venus",
    "saturn",
    "rahu",
    "ketu",
    "marriage",
    "career",
    "health",
    "wealth",
    "education",
    "children"
  ];

  const importantLines = lines.filter(line => {
    const lowerLine = line.toLowerCase();

    return importantWords.some(word =>
      lowerLine.includes(word)
    );
  });

  const selectedLines = [];

  lines.slice(0, 12).forEach(line => {
    if (!selectedLines.includes(line)) {
      selectedLines.push(line);
    }
  });

  importantLines.slice(0, 18).forEach(line => {
    if (!selectedLines.includes(line)) {
      selectedLines.push(line);
    }
  });

  return selectedLines
    .slice(0, 30)
    .join("\n");
}


/* =========================================
   వ్యక్తిగత వివరాల HTML
========================================= */

function createPersonalDetailsHtml(details) {
  return `
    <div class="report-section">

      <h3>👤 వ్యక్తిగత వివరాలు</h3>

      <div class="details-grid">

        <p>
          <b>పేరు:</b>
          ${escapeHtml(details.name || "")}
        </p>

        <p>
          <b>లింగం:</b>
          ${escapeHtml(details.gender || "")}
        </p>

        <p>
          <b>పుట్టిన తేదీ:</b>
          ${formatDate(details.dob)}
        </p>

        <p>
          <b>పుట్టిన సమయం:</b>
          ${escapeHtml(details.time || "")}
        </p>

        <p>
          <b>పుట్టిన స్థలం:</b>
          ${escapeHtml(details.place || "")}
        </p>

      </div>

    </div>
  `;
}


/* =========================================
   బటన్ల HTML
========================================= */

function createReportButtonsHtml(viewName) {
  const changeViewButton =
    viewName === "summary"
      ? `
        <button
          type="button"
          onclick="showFullJathakam()"
        >
          📜 పూర్తి జాతకం
        </button>
      `
      : `
        <button
          type="button"
          onclick="showJathakamSummary()"
        >
          📋 సారాంశం
        </button>
      `;

  return `
    <div class="report-buttons">

      ${changeViewButton}

      <button
        type="button"
        onclick="shareJathakam()"
      >
        📲 వాట్సాప్
      </button>

      <button
        type="button"
        onclick="printJathakam()"
      >
        🖨️ ప్రింట్
      </button>

      <button
        type="button"
        onclick="goHome()"
      >
        🏠 హోమ్
      </button>

    </div>
  `;
}


/* =========================================
   WhatsApp Share
========================================= */

function shareJathakam() {
  if (!jathakamFullReport) {
    alert("ముందుగా జాతకం తయారు చేయండి.");
    return;
  }

  const details = currentPersonDetails || {};

  const shareText = `
🙏 మన జాతకం

పేరు: ${details.name || ""}
లింగం: ${details.gender || ""}
పుట్టిన తేదీ: ${formatDate(details.dob)}
పుట్టిన సమయం: ${details.time || ""}
పుట్టిన స్థలం: ${details.place || ""}

📋 జాతక సారాంశం:

${createSummary(jathakamFullReport)}
  `.trim();

  const whatsappUrl =
    "https://wa.me/?text=" +
    encodeURIComponent(shareText);

  window.open(
    whatsappUrl,
    "_blank",
    "noopener,noreferrer"
  );
}


/* =========================================
   Print
========================================= */

function printJathakam() {
  if (!jathakamFullReport) {
    alert("ముందుగా జాతకం తయారు చేయండి.");
    return;
  }

  window.print();
}


/* =========================================
   Home
========================================= */

function goHome() {
  window.location.href = "index.html";
}


/* =========================================
   Report Text Formatting
========================================= */

function formatReportText(text) {
  return escapeHtml(text)
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");
}


/* =========================================
   Date Formatting
========================================= */

function formatDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const parts = dateValue.split("-");

  if (parts.length !== 3) {
    return escapeHtml(dateValue);
  }

  return (
    escapeHtml(parts[2]) +
    "-" +
    escapeHtml(parts[1]) +
    "-" +
    escapeHtml(parts[0])
  );
}


/* =========================================
   HTML Security
========================================= */

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================
   Result దగ్గరకు Scroll
========================================= */

function scrollToResult() {
  const result = document.getElementById("result");

  if (result) {
    result.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}
