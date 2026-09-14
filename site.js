const NAV_LINKS = [
  { href: "index.html", en: "Home", km: "ទំព័រដើម" },
  { href: "about.html", en: "About Autism", km: "អំពីអូទីស្សឹម" },
  { href: "whatWeDo.html", en: "What We Do", km: "អ្វីដែលយើងធ្វើ" },
  { href: "getInvolved.html", en: "Get Involved", km: "ចូលរួម" },
  {
    href: "contact.html",
    en: "Resources & Contact",
    km: "ធនធាន និងទំនាក់ទំនង",
  },
];

function currentPage() {
  const file = location.pathname.split("/").pop();
  return file || "index.html";
}

function attr(en, km) {
  return `data-en="${en}" data-km="${km}"`;
}

function renderHeader() {
  const page = currentPage();
  const links = NAV_LINKS.map((link) => {
    const active = link.href === page ? " active" : "";
    return `<a href="${link.href}" class="nav-link${active}" ${attr(link.en, link.km)}>${link.en}</a>`;
  }).join("");

  return `
    <header>
      <div class="container header-container">
        <a href="index.html" class="logo-link">
          <img src="logo.png" alt="NeuroCare Logo" class="logo-img logo-img-header" />
          <div class="logo-text-wrapper">
            <span class="logo-title" ${attr("NeuroCare", "អូទីស្សឹម កម្ពុជា")}>NeuroCare</span>
            <span class="logo-subtitle" ${attr("Hope & Neurodiversity", "ក្តីសង្ឃឹម និងភាពចម្រុះនៃប្រព័ន្ធប្រសាទ")}>Hope & Neurodiversity</span>
          </div>
        </a>
        <nav>
          ${links}
          <div class="header-actions">
            <div class="lang-switch">
              <button class="lang-btn active" id="lang-en" type="button" onclick="setLanguage('en')">EN</button>
              <button class="lang-btn" id="lang-km" type="button" onclick="setLanguage('km')">ខ្មែរ</button>
            </div>
          </div>
        </nav>
      </div>
    </header>`;
}

function renderFooter() {
  const navItems = NAV_LINKS.map(
    (link) =>
      `<li><a href="${link.href}" ${attr(link.en, link.km)}>${link.en}</a></li>`,
  ).join("");

  return `
    <footer>
      <div class="container footer-grid">
        <div class="footer-about">
          <a href="index.html" class="logo-link">
            <img src="logo.png" alt="Neurocare Logo" class="logo-img logo-img-footer" />
            <span class="logo-title logo-title-footer" ${attr("Neurocare", "អូទីស្សឹម កម្ពុជា")}>Neurocare</span>
          </a>
          <p ${attr(
            "Spreading awareness, building specialized classrooms, and training educators across Cambodia to support children with Autism.",
            "ផ្សព្វផ្សាយការយល់ដឹង កសាងថ្នាក់រៀនឯកទេស និងបណ្តុះបណ្តាលអ្នកអប់រំនៅទូទាំងប្រទេសកម្ពុជា ដើម្បីគាំទ្រដល់កុមារអូទីស្សឹម។",
          )}>Spreading awareness, building specialized classrooms, and training educators across Cambodia to support children with Autism.</p>
        </div>
        <div class="footer-nav">
          <h4 ${attr("Navigation", "ការរុករក")}>Navigation</h4>
          <ul>${navItems}</ul>
        </div>
        <div class="footer-contact">
          <h4 ${attr("Get Involved", "ចូលរួមជាមួយយើង")}>Get Involved</h4>
          <div class="footer-contact-info">
            <p ${attr("Volunteer Signups: info@autismcambodia.org", "ចុះឈ្មោះស្ម័គ្រចិត្ត៖ info@autismcambodia.org")}>Volunteer Signups: info@autismcambodia.org</p>
            <p ${attr("Hotline support: +855 23 880 992", "ខ្សែទូរស័ព្ទគាំទ្រ៖ +៨៥៥ ២៣ ៨៨០ ៩៩២")}>Hotline support: +855 23 880 992</p>
            <p ${attr("Phnom Penh, Cambodia", "ភ្នំពេញ, ព្រះរាជាណាចក្រកម្ពុជា")}>Phnom Penh, Cambodia</p>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p ${attr(
          "© 2026 Autism Cambodia Awareness Initiative. Inspired by PWAA and Make-A-Wish.",
          "© ២០២៦ គំនិតផ្តួចផ្តើមការយល់ដឹងអំពីអូទីស្សឹមកម្ពុជា។ ទទួលបានការបំផុសគំនិតដោយ PWAA និង Make-A-Wish។",
        )}>© 2026 Autism Cambodia Awareness Initiative. Inspired by PWAA and Make-A-Wish.</p>
      </div>
    </footer>`;
}

function amountButtons() {
  return [10, 25, 50, 100, 250, 500]
    .map(
      (n, i) =>
        `<button class="amount-btn${i === 0 ? " active" : ""}" type="button" onclick="selectAmount(${n})">$${n}</button>`,
    )
    .join("");
}

function renderDonationModal() {
  return `
    <div class="modal-overlay" id="donation-modal-overlay">
      <div class="donation-modal">
        <button class="close-modal" type="button" onclick="closeDonationModal()" aria-label="Close">&times;</button>
        <div class="modal-steps">
          <div class="modal-step-line" id="modal-step-line"></div>
          <div class="step-node active" id="node-1">1</div>
          <div class="step-node" id="node-2">2</div>
          <div class="step-node" id="node-3">3</div>
        </div>

        <div class="donation-step active" id="step-1">
          <h3 ${attr("Choose Your Gift", "ជ្រើសរើសអំណោយរបស់អ្នក")}>Choose Your Gift</h3>
          <div class="frequency-select">
            <button class="freq-btn active" id="freq-one" type="button" onclick="setFrequency('one-time')" ${attr("One-Time", "ម្តងគត់")}>One-Time</button>
            <button class="freq-btn" id="freq-month" type="button" onclick="setFrequency('monthly')" ${attr("Monthly", "ប្រចាំខែ")}>Monthly</button>
          </div>
          <div class="amount-grid">${amountButtons()}</div>
          <div class="custom-amount-wrapper">
            <input type="number" id="custom-amount-input" oninput="handleCustomAmount(this.value)" placeholder="Other Amount" ${attr("Other Amount", "ចំនួនទឹកប្រាក់ផ្សេងទៀត")} />
          </div>
          <div class="impact-tooltip" id="impact-desc" ${attr(
            "$10 funds sensory learning materials for classroom activities.",
            "$១០ ផ្តល់មូលនិធិដល់សម្ភារៈសិក្សាផ្នែកអារម្មណ៍សម្រាប់សកម្មភាពក្នុងថ្នាក់រៀន។",
          )}>$10 funds sensory learning materials for classroom activities.</div>
          <div class="step-nav">
            <div></div>
            <button class="step-btn-next" type="button" onclick="goToStep(2)" ${attr("Next Step", "ជំហានបន្ទាប់")}>Next Step</button>
          </div>
        </div>

        <div class="donation-step" id="step-2">
          <h3 ${attr("Billing Information", "ព័ត៌មានទូទាត់ប្រាក់")}>Billing Information</h3>
          <div class="form-group">
            <label for="donor-name" ${attr("Full Name", "ឈ្មោះពេញ")}>Full Name</label>
            <input type="text" id="donor-name" required placeholder="e.g. Chan Sophea" ${attr("e.g. Chan Sophea", "ឧទាហរណ៍៖ ចាន់ សុភា")} />
          </div>
          <div class="form-group">
            <label for="donor-email" ${attr("Email Address", "អាសយដ្ឋានអ៊ីមែល")}>Email Address</label>
            <input type="email" id="donor-email" required placeholder="sophea@example.com" />
          </div>
          <div class="step-nav">
            <button class="step-btn-back" type="button" onclick="goToStep(1)" ${attr("Back", "ត្រឡប់ក្រោយ")}>Back</button>
            <button class="step-btn-next" type="button" onclick="goToStep(3)" ${attr("Continue", "បន្ត")}>Continue</button>
          </div>
        </div>

        <div class="donation-step" id="step-3">
          <h3 ${attr("Credit Card Details", "ព័ត៌មានកាតឥណទាន")}>Credit Card Details</h3>
          <div class="form-group">
            <label for="card-num" ${attr("Card Number", "លេខកាត")}>Card Number</label>
            <input type="text" id="card-num" required placeholder="1234 5678 1234 5678" />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="card-exp" ${attr("Expiry Date", "ថ្ងៃផុតកំណត់")}>Expiry Date</label>
              <input type="text" id="card-exp" required placeholder="MM/YY" />
            </div>
            <div class="form-group">
              <label for="card-cvc">CVC</label>
              <input type="text" id="card-cvc" required placeholder="123" />
            </div>
          </div>
          <div class="step-nav">
            <button class="step-btn-back" type="button" onclick="goToStep(2)" ${attr("Back", "ត្រឡប់ក្រោយ")}>Back</button>
            <button class="step-btn-next" id="submit-donation-btn" type="button" onclick="executeMockDonation()" ${attr("Complete Donation", "បញ្ចប់ការបរិច្ចាគ")}>Complete Donation</button>
          </div>
        </div>

        <div class="donation-step" id="step-success">
          <div class="donation-success-state">
            <div class="success-icon-wrapper">
              <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.5 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <h3 ${attr("Thank You!", "សូមអរគុណ!")}>Thank You!</h3>
            <p ${attr(
              "Your generous support helps spread autism awareness and provide resources to children in Cambodia.",
              "ការគាំទ្រដ៏សប្បុរសរបស់អ្នកជួយផ្សព្វផ្សាយការយល់ដឹងអំពីអូទីស្សឹម និងផ្តល់ធនធានដល់កុមារនៅកម្ពុជា។",
            )}>Your generous support helps spread autism awareness and provide resources to children in Cambodia.</p>
            <div class="receipt-box">
              <div class="receipt-row"><span ${attr("Receipt Number", "លេខបង្កាន់ដៃ")}>Receipt Number</span><span id="receipt-no">#TX19284728</span></div>
              <div class="receipt-row"><span ${attr("Billing Name", "ឈ្មោះអ្នកទូទាត់")}>Billing Name</span><span id="receipt-name">Chan Sophea</span></div>
              <div class="receipt-row"><span ${attr("Donation Frequency", "ភាពញឹកញាប់នៃការបរិច្ចាគ")}>Donation Frequency</span><span id="receipt-freq">One-Time</span></div>
              <div class="receipt-row"><span ${attr("Total Gift", "អំណោយសរុប")}>Total Gift</span><span id="receipt-amount">$10.00</span></div>
            </div>
            <button class="form-submit-btn" type="button" onclick="closeDonationModal()" ${attr("Close", "បិទ")}>Close</button>
          </div>
        </div>
      </div>
    </div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  const modal = document.getElementById("site-modal");
  if (header) header.outerHTML = renderHeader();
  if (footer) footer.outerHTML = renderFooter();
  if (modal) modal.outerHTML = renderDonationModal();
});
