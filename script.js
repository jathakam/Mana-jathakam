function showMessage() {

    let name = document.getElementById("name").value;
    let gender = document.getElementById("gender").value;
    let dob = document.getElementById("dob").value;
    let time = document.getElementById("time").value;
    let place = document.getElementById("place").value;

    if (name === "" || dob === "" || time === "" || place === "") {
        document.getElementById("result").innerHTML =
        "⚠️ దయచేసి అన్ని వివరాలు నమోదు చేయండి.";
        return;
    }

    document.getElementById("result").innerHTML =
    "🙏 " + name + " గారు,<br><br>" +
    "మీ వివరాలు విజయవంతంగా నమోదు అయ్యాయి.<br>" +
    "తదుపరి వెర్షన్‌లో నక్షత్రం, రాశి, లగ్నం, దశ, గుణమేళనం, పూర్తి జాతక వివరాలు చూపబడతాయి.";
}