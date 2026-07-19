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
      throw new Error("API Error : " + response.status);
    }

    const html = await response.text();

    loading.style.display = "none";

    result.innerHTML = "<pre>" + html + "</pre>";

  } catch (error) {

    loading.style.display = "none";
    result.innerHTML = "❌ " + error.message;
  }
function shareJathakam() {

  const result = document.getElementById("result");
  const text = result.innerText.trim();

  if (!text) {
    alert("ముందుగా జాతకం తయారు చేయండి.");
    return;
  }

  const whatsappUrl =
    "https://wa.me/?text=" + encodeURIComponent(text);

  window.open(whatsappUrl, "_blank");
}
}
