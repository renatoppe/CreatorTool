const CONTENT_URL =
  "/teacher-tools/database/content.json?nocache=" + Date.now();

const SAVE_ENDPOINT = "/teacher-tools/save-content";

let currentContent = null;


/*
========================
LOAD EXISTING DATABASE
========================
*/

async function loadContent() {
  try {
    const res = await fetch(CONTENT_URL);

    if (!res.ok) {
      throw new Error("Could not load content.json");
    }

    currentContent = await res.json();

    console.log("Loaded content.json successfully");

  } catch (err) {
    console.error("Error loading database:", err);
    alert("Could not load content.json from Brain.");
  }
}


/*
========================
BUILD DATASET
========================
*/

function buildDataset() {

  const topic =
    document.getElementById("topicInput")?.value.trim();

  const category =
    document.getElementById("categoryInput")?.value.trim();

  const words =
    document
      .getElementById("wordsInput")
      ?.value
      .split("\n")
      .map(w => w.trim())
      .filter(w => w.length > 0);


  if (!topic || !category || !words.length) {
    alert("Missing topic / category / words");
    return null;
  }


  return {
    topic,
    category,
    words
  };
}


/*
========================
MERGE INTO DATABASE
========================
*/

function mergeDataset(dataset) {

  if (!currentContent) {
    alert("Database not loaded yet");
    return null;
  }

  if (!currentContent.datasets) {
    currentContent.datasets = {};
  }

  currentContent.datasets[dataset.topic] = dataset;

  return currentContent;
}


/*
========================
DISPLAY JSON OUTPUT
========================
*/

function showOutput(json) {

  const outputBox =
    document.getElementById("outputJson");

  if (!outputBox) return;

  outputBox.value =
    JSON.stringify(json, null, 2);
}


/*
========================
SAVE DATASET TO BRAIN
========================
*/

async function saveDatasetToBrain(json) {

  try {

    const res = await fetch(
      SAVE_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
      }
    );


    if (!res.ok) {
      throw new Error("Save failed");
    }


    alert("Dataset saved successfully to Brain ✅");


  } catch (err) {

    console.error(err);

    alert(
      "Could not save dataset.\nCheck Brain connection."
    );
  }
}


/*
========================
MAIN BUTTON HANDLER
========================
*/

async function handleSaveClick() {

  const dataset = buildDataset();

  if (!dataset) return;

  const merged =
    mergeDataset(dataset);

  if (!merged) return;

  showOutput(merged);

  await saveDatasetToBrain(merged);
}


/*
========================
INIT
========================
*/

window.addEventListener("DOMContentLoaded", async () => {

  console.log("Creator initializing...");

  await loadContent();


  const saveBtn =
    document.getElementById("saveDatasetBtn");

  if (saveBtn) {
    saveBtn.addEventListener(
      "click",
      handleSaveClick
    );
  }

});