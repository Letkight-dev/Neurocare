let currentLanguage = localStorage.getItem("lang") || "en";
let donationFrequency = "one-time";
let selectedDonationAmount = 10;
let currentModalStep = 1;

const defaultStories = [
  {
    author: "Molyka S.",
    location: "Phnom Penh",
    text_en: "My son Sothy smiles every day at his special class. Thank you for raising awareness!",
    text_km: "កូនប្រុសរបស់ខ្ញុំ សុធី ញញឹមរាល់ថ្ងៃនៅថ្នាក់ពិសេសរបស់គាត់។ អរគុណសម្រាប់ការជួយដាស់តឿនការយល់ដឹង!",
  },
  {
    author: "Dara K.",
    location: "Siem Reap",
    text_en: "We wish for a future where every school in Siem Reap has sensory rooms.",
    text_km: "យើងប្រាថ្នាចង់បានអនាគតមួយដែលសាលារៀនគ្រប់កន្លែងនៅខេត្តសៀមរាបមានបន្ទប់អារម្មណ៍។",
  },
  {
    author: "Sophea T.",
    location: "Battambang",
    text_en: "Early screening changed Serey's life. He is starting primary education this term!",
    text_km: "ការពិនិត្យដំបូងបានផ្លាស់ប្តូរជីវិតរបស់សិរី។ គាត់កំពុងចាប់ផ្តើមការអប់រំបឋមសិក្សានៅឆមាសនេះ!",
  },
];

const LOCATION_KM = {
  "Phnom Penh": "ភ្នំពេញ",
  "Siem Reap": "សៀមរាប",
  Battambang: "បាត់ដំបង",
  Sihanoukville: "ព្រះសីហនុ",
  "Kampong Cham": "កំពង់ចាម",
};

const IMPACT = [
  { match: (n) => n <= 0, en: "Please select or type an amount to see the impact of your support.", km: "សូមជ្រើសរើស ឬវាយបញ្ចូលចំនួនទឹកប្រាក់ ដើម្បីមើលពីផលប៉ះពាល់នៃការគាំទ្ររបស់អ្នក។" },
  { match: (n) => n < 25, en: "funds sensory learning materials for classroom activities.", km: "ផ្តល់មូលនិធិដល់សម្ភារៈសិក្សាផ្នែកអារម្មណ៍សម្រាប់សកម្មភាពក្នុងថ្នាក់រៀន។" },
  { match: (n) => n < 50, en: "provides tactile study sensory kits for autism diagnostics in Siem Reap.", km: "ផ្តល់ជូននូវឧបករណ៍សិក្សារំញោចអារម្មណ៍សម្រាប់កុមារម្នាក់នៅភ្នំពេញ។" },
  { match: (n) => n < 100, en: "funds one specialized training session for a public teacher in rural Cambodia.", km: "ផ្តល់មូលនិធិដល់វគ្គបណ្តុះបណ្តាលឯកទេសសម្រាប់គ្រូបង្រៀនម្នាក់នៅជនបទ។" },
  { match: (n) => n < 250, en: "sponsors a complete professional diagnosis and support kit for one child.", km: "ឧបត្ថម្ភការវាយតម្លៃរោគវិនិច្ឆ័យកម្រិតគ្លីនិក និងឧបករណ៍គាំទ្រសម្រាប់កុមារម្នាក់។" },
  { match: () => true, en: "funds classroom infrastructure upgrades or aids multiple special educators!", km: "ផ្តល់មូលនិធិដល់ការធ្វើឱ្យប្រសើរឡើងនូវថ្នាក់រៀន ឬគាំទ្រអ្នកអប់រំពិសេសជាច្រើននាក់!" },
];

let raisedAmount = parseFloat(localStorage.getItem("raisedAmount")) || 15420;
let donorsCount = parseInt(localStorage.getItem("donorsCount"), 10) || 194;
const targetGoal = 25000;

function t(en, km) {
  return currentLanguage === "en" ? en : km;
}

document.addEventListener("DOMContentLoaded", () => {
  setLanguage(currentLanguage);
  updateLiveProgress();
  initStoryBoard();
  selectAmount(10);
});

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem("lang", lang);

  document.querySelectorAll("[data-en]").forEach((el) => {
    const text = el.getAttribute("data-" + lang);
    if (text) el.textContent = text;
  });

  document.querySelectorAll("input[data-en], textarea[data-en]").forEach((el) => {
    const placeholder = el.getAttribute("data-" + lang);
    if (placeholder) el.setAttribute("placeholder", placeholder);
  });

  const btnEn = document.getElementById("lang-en");
  const btnKm = document.getElementById("lang-km");
  if (btnEn && btnKm) {
    btnEn.classList.toggle("active", lang === "en");
    btnKm.classList.toggle("active", lang === "km");
  }

  updateImpactTooltip();
  initStoryBoard();
}

function toggleAccordion(header) {
  const item = header.parentElement;
  const open = item.classList.contains("active");
  document.querySelectorAll(".accordion-item").forEach((el) => el.classList.remove("active"));
  if (!open) item.classList.add("active");
}

function updateLiveProgress() {
  const raisedText = document.getElementById("live-raised-amount");
  const donorsText = document.getElementById("live-donors-count");
  const progressBar = document.getElementById("live-progress-bar");
  if (raisedText) raisedText.textContent = "$" + raisedAmount.toLocaleString();
  if (donorsText) donorsText.textContent = donorsCount.toLocaleString();
  if (progressBar) {
    progressBar.style.width = Math.min((raisedAmount / targetGoal) * 100, 100) + "%";
  }
}

function initStoryBoard() {
  const wall = document.getElementById("story-wall");
  if (!wall) return;

  let stories = JSON.parse(localStorage.getItem("stories"));
  if (!stories) {
    stories = defaultStories;
    localStorage.setItem("stories", JSON.stringify(stories));
  }

  wall.innerHTML = "";
  stories.forEach((story) => {
    const loc = currentLanguage === "en" ? story.location : LOCATION_KM[story.location] || story.location;
    const text = currentLanguage === "en" ? story.text_en : story.text_km;
    const card = document.createElement("div");
    card.className = "story-card";
    card.innerHTML = `<p class="story-text">"${text}"</p><h4 class="story-author">${story.author}</h4><span class="story-location">${loc}</span>`;
    wall.appendChild(card);
  });
}

function handleStorySubmit(e) {
  e.preventDefault();
  const author = document.getElementById("form-author")?.value.trim();
  const location = document.getElementById("form-location")?.value || "Phnom Penh";
  const text = document.getElementById("form-text")?.value.trim();
  if (!author || !text) return;

  const stories = JSON.parse(localStorage.getItem("stories")) || defaultStories;
  stories.unshift({ author, location, text_en: text, text_km: text });
  localStorage.setItem("stories", JSON.stringify(stories));
  e.target.reset();
  initStoryBoard();
  alert(t("Thank you! Your story has been posted to our board.", "សូមអរគុណ! រឿងរ៉ាវរបស់អ្នកត្រូវបានបង្ហោះនៅលើក្តាររបស់យើងហើយ។"));
}

function handleContactSubmit(e) {
  e.preventDefault();
  alert(t("Thank you! Your message has been sent.", "សូមអរគុណ! សាររបស់អ្នកត្រូវបានផ្ញើហើយ។"));
  e.target.reset();
}

function handleVolunteerSubmit(e) {
  e.preventDefault();
  alert(t("Thank you for volunteering. We will contact you soon.", "សូមអរគុណសម្រាប់ការស្ម័គ្រចិត្ត។ យើងនឹងទាក់ទងអ្នកឆាប់ៗ។"));
  e.target.reset();
}

function openDonationModal() {
  const modal = document.getElementById("donation-modal-overlay");
  if (!modal) return;
  modal.classList.add("active");
  goToStep(1);
}

function closeDonationModal() {
  document.getElementById("donation-modal-overlay")?.classList.remove("active");
}

function setFrequency(freq) {
  donationFrequency = freq;
  document.getElementById("freq-one")?.classList.toggle("active", freq === "one-time");
  document.getElementById("freq-month")?.classList.toggle("active", freq === "monthly");
}

function selectAmount(val) {
  selectedDonationAmount = val;
  document.querySelectorAll(".amount-btn").forEach((btn) => {
    btn.classList.toggle("active", parseFloat(btn.textContent.replace("$", "")) === val);
  });
  const customInput = document.getElementById("custom-amount-input");
  if (customInput) customInput.value = "";
  updateImpactTooltip();
}

function handleCustomAmount(val) {
  const amount = parseFloat(val);
  selectedDonationAmount = isNaN(amount) ? 0 : amount;
  document.querySelectorAll(".amount-btn").forEach((btn) => btn.classList.remove("active"));
  updateImpactTooltip();
}

function updateImpactTooltip() {
  const descEl = document.getElementById("impact-desc");
  if (!descEl) return;
  const amt = selectedDonationAmount;
  const tier = IMPACT.find((row) => row.match(amt));
  descEl.textContent = amt <= 0 ? t(tier.en, tier.km) : `$${amt.toLocaleString()} ${t(tier.en, tier.km)}`;
}

function goToStep(step) {
  currentModalStep = step;
  document.querySelectorAll(".donation-step").forEach((el) => el.classList.remove("active"));
  document.getElementById("step-" + step)?.classList.add("active");

  const line = document.getElementById("modal-step-line");
  if (line && step !== "success") line.style.width = ((step - 1) / 2) * 100 + "%";

  for (let i = 1; i <= 3; i++) {
    const node = document.getElementById("node-" + i);
    if (!node) continue;
    node.className = "step-node";
    if (step === "success" || i < step) node.classList.add("completed");
    else if (i === step) node.classList.add("active");
  }
}

function executeMockDonation() {
  const nameInput = document.getElementById("donor-name");
  const emailInput = document.getElementById("donor-email");
  const fields = [nameInput, emailInput, document.getElementById("card-num"), document.getElementById("card-exp"), document.getElementById("card-cvc")];
  if (fields.some((el) => !el?.value)) {
    alert(t("Please fill out all billing details.", "សូមបំពេញព័ត៌មានទូទាត់ឱ្យបានគ្រប់គ្រាន់។"));
    return;
  }

  const btn = document.getElementById("submit-donation-btn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = t("Processing...", "កំពុងដំណើរការ...");
  }

  setTimeout(() => {
    if (btn) {
      btn.disabled = false;
      btn.textContent = t("Complete Donation", "បញ្ចប់ការបរិច្ចាគ");
    }

    raisedAmount += selectedDonationAmount;
    donorsCount += 1;
    localStorage.setItem("raisedAmount", raisedAmount);
    localStorage.setItem("donorsCount", donorsCount);

    document.getElementById("receipt-no").textContent = "#TX" + Math.floor(Math.random() * 90000000 + 10000000);
    document.getElementById("receipt-name").textContent = nameInput.value;
    document.getElementById("receipt-freq").textContent =
      donationFrequency === "one-time" ? t("One-Time", "ម្តងគត់") : t("Monthly", "ប្រចាំខែ");
    document.getElementById("receipt-amount").textContent =
      "$" + selectedDonationAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    goToStep("success");
    updateLiveProgress();
  }, 1500);
}
