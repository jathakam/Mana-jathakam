async function generateJathakam() {

  alert("Button Clicked");

  const loading = document.getElementById("loading");
  const result = document.getElementById("result");

  loading.style.display = "block";
  result.innerHTML = "";

  const name = document.getElementById("name").value;
  const gender = document.getElementById("gender").value;
  const dob = document.getElementById("dob").value;
  const time = document.getElementById("tob").value;
  const place = document.getElementById("place").value;

  if (!name || !dob || !time || !place) {
    loading.style.display = "none";
    result.innerHTML = "⚠️ దయచేసి అన్ని వివరాలు నమోదు చేయండి.";
    return;
  }

  const d = dob.split("-");
  const birthdate = `${d[2]}-${d[1]}-${d[0]}`;

  const body =
    `name=${encodeURIComponent(name)}&birthdate=${birthdate}&birthtime=${encodeURIComponent(time)}&City=${encodeURIComponent(place.toUpperCase())}`;
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

    if (!response.ok) {
      throw new Error("API Error: " + response.status);
    }

    const html = await response.text();
alert("Fetch పూర్తైంది");
    loading.style.display = "none";

alert(html);

result.innerHTML = "<pre>" + html + "</pre>";

  } catch (error) {

    loading.style.display = "none";
    result.innerHTML = "❌ లోపం: " + error.message;
    alert(error.message);
  }

}
function shareJathakam() {

  const text = document.getElementById("result").innerText;

  if (!text.trim()) {
    alert("ముందు జాతకం తయారు చేయండి.");
    return;
  }

  const url = "https://wa.me/?text=" + encodeURIComponent(text);
  window.open(url, "_blank");

}
.jathakam-box{
    background:#fffdf5;
    border:2px solid #d4af37;
    border-radius:15px;
    padding:20px;
    margin-top:20px;
    box-shadow:0 4px 12px rgba(0,0,0,0.15);
    font-family:'Noto Sans Telugu',sans-serif;
}

.jathakam-box h2{
    color:#b22222;
    text-align:center;
}

.jathakam-box h3{
    color:#8b4513;
    border-bottom:1px solid #d4af37;
    padding-bottom:5px;
}

.jathakam-box pre{
    white-space:pre-wrap;
    word-wrap:break-word;
    font-size:16px;
    line-height:1.7;
}
