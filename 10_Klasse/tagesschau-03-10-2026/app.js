"use strict";

const STORAGE_KEY = "tse-03102026-arbeitsblatt-v3";
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzd2Mg6wHvVk83LjKshehg5px_5dZkbfVDZYHS5jT9YyT9_mBSIkC60ff1lNnyb6vCBGw/exec";

const questions = [
  { q: "Was ist die beste Methode, das Hauptthema einer Meldung zu erkennen?", a: ["Nur auf die Hintergrundmusik achten", "Auf Überschrift, Bilder und zentrale Informationen achten", "Eine eigene Geschichte erfinden"], correct: 1 },
  { q: "Was ist eine Tatsache?", a: ["Eine überprüfbare Information", "Ein persönliches Gefühl", "Eine Vermutung ohne Quelle"], correct: 0 },
  { q: "Welche Frage hilft dir, eine Nachricht genauer zu verstehen?", a: ["Welche Farbe hat der Fernseher?", "Wie gefällt mir die Musik?", "Was ist passiert und wer ist betroffen?"], correct: 2 },
  { q: "Welche Formulierung drückt eine eigene Meinung aus?", a: ["Der Bericht nennt drei Personen.", "Meiner Meinung nach ist das wichtig.", "Die Meldung beginnt um …"], correct: 1 },
  { q: "Was solltest du tun, wenn du ein Wort im Video nicht verstehst?", a: ["Sofort aufgeben", "Aus dem Zusammenhang erschließen und die Stelle noch einmal hören", "Die Nachricht als falsch bezeichnen"], correct: 1 }
];

const words = [
  ["die Nachricht", ["eine aktuelle Information", "ein Musikinstrument", "eine Unterrichtspause"], 0],
  ["die Ursache", ["der Grund für etwas", "die letzte Folge", "ein neuer Ort"], 0],
  ["berichten", ["Informationen mitteilen", "etwas verkaufen", "schnell laufen"], 0],
  ["die Folge", ["das Ergebnis / die Konsequenz", "eine Adresse", "eine Frage"], 0],
  ["zuverlässig", ["vertrauenswürdig", "unbekannt", "sehr teuer"], 0]
];

let quizPoints = null;
let vocabPoints = null;

function renderActivities() {
  document.getElementById("quiz").innerHTML = questions.map((item, i) => `
    <div class="question">
      <div class="qtitle">${i + 1}. ${item.q}</div>
      <div class="options">${item.a.map((answer, j) => `<label><input type="radio" name="q${i}" value="${j}"> ${answer}</label>`).join("")}</div>
    </div>`).join("");

  document.getElementById("vocab").innerHTML = words.map(([word, options], i) => `
    <label for="voc${i}">${i + 1}. ${word}</label>
    <select id="voc${i}" name="voc${i}">
      <option value="">Bedeutung wählen</option>
      ${options.map((option, j) => `<option value="${j}">${option}</option>`).join("")}
    </select>`).join("");
}

function allAnswerFields() {
  return document.querySelectorAll("input[type=text], textarea, select");
}

function restoreAnswers() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    Object.entries(saved).forEach(([id, value]) => {
      if (id.startsWith("radio:")) {
        const radio = document.querySelector(`input[name="${id.slice(6)}"][value="${value}"]`);
        if (radio) radio.checked = true;
      } else {
        const field = document.getElementById(id);
        if (field) field.value = value;
      }
    });
  } catch (error) {
    console.warn("Gespeicherte Antworten konnten nicht geladen werden.", error);
  }
  updateCount();
}

function saveAnswers() {
  const saved = {};
  allAnswerFields().forEach(field => { saved[field.id] = field.value; });
  questions.forEach((question, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (selected) saved[`radio:q${i}`] = selected.value;
  });
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch (error) { console.warn("Lokales Speichern nicht möglich.", error); }
}

function checkQuiz() {
  quizPoints = questions.filter((question, i) => Number(document.querySelector(`input[name="q${i}"]:checked`)?.value) === question.correct).length;
  const feedback = document.getElementById("feedback");
  feedback.textContent = `${quizPoints} / ${questions.length} richtig. ${quizPoints === questions.length ? "Sehr gut!" : "Überprüfe deine Antworten und versuche es noch einmal."}`;
  feedback.className = `feedback ${quizPoints === questions.length ? "good" : ""}`;
  updateScores();
  return quizPoints;
}

function resetQuiz() {
  document.querySelectorAll("#quiz input").forEach(input => { input.checked = false; });
  quizPoints = null;
  document.getElementById("feedback").textContent = "";
  updateScores();
  saveAnswers();
}

function checkVocab() {
  vocabPoints = words.filter((word, i) => Number(document.getElementById(`voc${i}`).value) === word[2]).length;
  const feedback = document.getElementById("vfeedback");
  feedback.textContent = `${vocabPoints} / ${words.length} richtig.`;
  feedback.className = `feedback ${vocabPoints === words.length ? "good" : ""}`;
  updateScores();
  return vocabPoints;
}

function updateScores() {
  document.getElementById("scores").textContent = `Multiple Choice: ${quizPoints === null ? "–" : `${quizPoints}/5`} · Wortschatz: ${vocabPoints === null ? "–" : `${vocabPoints}/5`}`;
}

function updateCount() {
  const text = document.getElementById("summary").value.trim();
  const count = text ? text.split(/\s+/).length : 0;
  document.getElementById("count").textContent = `${count} Wörter (Ziel: 70–90)`;
}

function collectAnswers() {
  const answers = {};
  allAnswerFields().forEach(field => { answers[field.id] = field.value; });
  questions.forEach((question, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    answers[`q${i + 1}`] = selected ? String(Number(selected.value) + 1) : "";
  });
  return answers;
}

function downloadAnswers() {
  const lines = ["TAGESSCHAU – ARBEITSBLATT (03.10.2026)", ""];
  allAnswerFields().forEach(field => {
    const label = document.querySelector(`label[for="${field.id}"]`)?.textContent || field.id;
    lines.push(`${label}: ${field.value}`);
  });
  lines.push(`Multiple Choice: ${quizPoints ?? "nicht geprüft"}/5`, `Wortschatz: ${vocabPoints ?? "nicht geprüft"}/5`);
  const blob = new Blob([lines.join("\n\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeName = document.getElementById("name").value.trim().replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, "_") || "Schuelerin";
  link.href = url;
  link.download = `Tagesschau_Antworten_${safeName}.txt`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function submissionId() {
  const key = `${STORAGE_KEY}:submissionId`;
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

async function sendResults() {
  const status = document.getElementById("sendStatus");
  const button = document.getElementById("sendButton");
  const name = document.getElementById("name").value.trim();
  const klasse = document.getElementById("klasse").value.trim();

  if (!name || !klasse) {
    status.textContent = "Bitte zuerst Name und Klasse / Datum eintragen.";
    status.className = "feedback wrong";
    document.getElementById(!name ? "name" : "klasse").focus();
    return;
  }
  if (!document.getElementById("consent").checked) {
    status.textContent = "Bitte bestätige zuerst, dass du die Ergebnisse senden möchtest.";
    status.className = "feedback wrong";
    document.getElementById("consent").focus();
    return;
  }
  if (!APPS_SCRIPT_URL.startsWith("https://script.google.com/macros/s/") || !APPS_SCRIPT_URL.endsWith("/exec")) {
    status.textContent = "Die Google-Sheets-Verbindung ist nicht richtig konfiguriert.";
    status.className = "feedback wrong";
    return;
  }

  checkQuiz();
  checkVocab();
  saveAnswers();
  const payload = {
    submissionId: submissionId(),
    worksheet: "tagesschau_03_10_2026",
    version: 2,
    createdAt: new Date().toISOString(),
    name,
    klasse,
    quizPoints,
    vocabPoints,
    totalPoints: quizPoints + vocabPoints,
    maxPoints: 10,
    answers: collectAnswers()
  };

  button.disabled = true;
  status.textContent = "Ergebnisse werden gesendet …";
  status.className = "feedback";
  try {
    await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    status.textContent = "Sendeanfrage erfolgreich übertragen. Die Lehrkraft kann den Eintrag jetzt im Google Sheet sehen.";
    status.className = "feedback good";
    localStorage.setItem(`${STORAGE_KEY}:lastSent`, new Date().toISOString());
  } catch (error) {
    status.textContent = "Senden nicht möglich. Bitte Internetverbindung prüfen und später erneut versuchen.";
    status.className = "feedback wrong";
    console.error(error);
  } finally {
    button.disabled = false;
  }
}

function clearAll() {
  if (!window.confirm("Möchtest du wirklich alle lokal gespeicherten Antworten löschen?")) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(`${STORAGE_KEY}:submissionId`);
  localStorage.removeItem(`${STORAGE_KEY}:lastSent`);
  location.reload();
}

function init() {
  renderActivities();
  restoreAnswers();
  document.getElementById("checkQuiz").addEventListener("click", checkQuiz);
  document.getElementById("resetQuiz").addEventListener("click", resetQuiz);
  document.getElementById("checkVocab").addEventListener("click", checkVocab);
  document.getElementById("printButton").addEventListener("click", () => window.print());
  document.getElementById("downloadButton").addEventListener("click", downloadAnswers);
  document.getElementById("clearButton").addEventListener("click", clearAll);
  document.getElementById("sendButton").addEventListener("click", sendResults);
  document.getElementById("worksheet").addEventListener("input", () => { saveAnswers(); updateCount(); });
  document.getElementById("worksheet").addEventListener("change", saveAnswers);
}

document.addEventListener("DOMContentLoaded", init);
