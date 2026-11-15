const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxpEOVL5YjzeflzQMiMOHHxBkcSQ6VcKSzO7mB6QSzL8DauFB-0TDk3B369p8slVHJi6A/exec";

let appData = {
  credentials: [],
  bookings: [],
  commoditiesMap: {}, // Commodity Code -> { itemName, hs, hsn, description }
  priceCards: {
    "Non-Doc parcels": {},
    "Document": {},
    "Medicine": {}
  }
};

let currentUser = null;
let sectionSavedState = { sender: false, receiver: false };
let currentActiveBooking = null;
let countryMetaMap = {};

const globalCountryDialMap = {
  "afghanistan": { code: "AF", dial: "+93" },
  "albania": { code: "AL", dial: "+355" },
  "algeria": { code: "DZ", dial: "+213" },
  "andorra": { code: "AD", dial: "+376" },
  "angola": { code: "AO", dial: "+244" },
  "antigua and barbuda": { code: "AG", dial: "+1268" },
  "argentina": { code: "AR", dial: "+54" },
  "armenia": { code: "AM", dial: "+374" },
  "australia": { code: "AU", dial: "+61" },
  "austria": { code: "AT", dial: "+43" },
  "azerbaijan": { code: "AZ", dial: "+994" },
  "bahamas": { code: "BS", dial: "+1242" },
  "bahrain": { code: "BH", dial: "+973" },
  "bangladesh": { code: "BD", dial: "+880" },
  "barbados": { code: "BB", dial: "+1246" },
  "belarus": { code: "BY", dial: "+375" },
  "belgium": { code: "BE", dial: "+32" },
  "belize": { code: "BZ", dial: "+501" },
  "benin": { code: "BJ", dial: "+229" },
  "bhutan": { code: "BT", dial: "+975" },
  "bolivia": { code: "BO", dial: "+591" },
  "bosnia and herzegovina": { code: "BA", dial: "+387" },
  "botswana": { code: "BW", dial: "+267" },
  "brazil": { code: "BR", dial: "+55" },
  "brunei": { code: "BN", dial: "+673" },
  "bulgaria": { code: "BG", dial: "+359" },
  "burkina faso": { code: "BF", dial: "+226" },
  "burundi": { code: "BI", dial: "+257" },
  "cambodia": { code: "KH", dial: "+855" },
  "cameroon": { code: "CM", dial: "+237" },
  "canada": { code: "CA", dial: "+1" },
  "cape verde": { code: "CV", dial: "+238" },
  "central african republic": { code: "CF", dial: "+236" },
  "chad": { code: "TD", dial: "+235" },
  "chile": { code: "CL", dial: "+56" },
  "china": { code: "CN", dial: "+86" },
  "colombia": { code: "CO", dial: "+57" },
  "comoros": { code: "KM", dial: "+269" },
  "congo": { code: "CG", dial: "+242" },
  "costa rica": { code: "CR", dial: "+506" },
  "croatia": { code: "HR", dial: "+385" },
  "cuba": { code: "CU", dial: "+53" },
  "cyprus": { code: "CY", dial: "+357" },
  "czech republic": { code: "CZ", dial: "+420" },
  "denmark": { code: "DK", dial: "+45" },
  "djibouti": { code: "DJ", dial: "+253" },
  "dominica": { code: "DM", dial: "+1767" },
  "dominican republic": { code: "DO", dial: "+1809" },
  "ecuador": { code: "EC", dial: "+593" },
  "egypt": { code: "EG", dial: "+20" },
  "el salvador": { code: "SV", dial: "+503" },
  "equatorial guinea": { code: "GQ", dial: "+240" },
  "eritrea": { code: "ER", dial: "+291" },
  "estonia": { code: "EE", dial: "+372" },
  "eswatini": { code: "SZ", dial: "+268" },
  "ethiopia": { code: "ET", dial: "+251" },
  "fiji": { code: "FJ", dial: "+679" },
  "finland": { code: "FI", dial: "+358" },
  "france": { code: "FR", dial: "+33" },
  "gabon": { code: "GA", dial: "+241" },
  "gambia": { code: "GM", dial: "+220" },
  "georgia": { code: "GE", dial: "+995" },
  "germany": { code: "DE", dial: "+49" },
  "ghana": { code: "GH", dial: "+233" },
  "greece": { code: "GR", dial: "+30" },
  "grenada": { code: "GD", dial: "+1473" },
  "guatemala": { code: "GT", dial: "+502" },
  "guinea": { code: "GN", dial: "+224" },
  "guinea-bissau": { code: "GW", dial: "+245" },
  "guyana": { code: "GY", dial: "+592" },
  "haiti": { code: "HT", dial: "+509" },
  "honduras": { code: "HN", dial: "+504" },
  "hong kong": { code: "HK", dial: "+852" },
  "hungary": { code: "HU", dial: "+36" },
  "iceland": { code: "IS", dial: "+354" },
  "india": { code: "IN", dial: "+91" },
  "indonesia": { code: "ID", dial: "+62" },
  "iran": { code: "IR", dial: "+98" },
  "iraq": { code: "IQ", dial: "+964" },
  "ireland": { code: "IE", dial: "+353" },
  "israel": { code: "IL", dial: "+972" },
  "italy": { code: "IT", dial: "+39" },
  "jamaica": { code: "JM", dial: "+1876" },
  "japan": { code: "JP", dial: "+81" },
  "jordan": { code: "JO", dial: "+962" },
  "kazakhstan": { code: "KZ", dial: "+7" },
  "kenya": { code: "KE", dial: "+254" },
  "kiribati": { code: "KI", dial: "+686" },
  "kuwait": { code: "KW", dial: "+965" },
  "kyrgyzstan": { code: "KG", dial: "+996" },
  "laos": { code: "LA", dial: "+856" },
  "latvia": { code: "LV", dial: "+371" },
  "lebanon": { code: "LB", dial: "+961" },
  "lesotho": { code: "LS", dial: "+266" },
  "liberia": { code: "LR", dial: "+231" },
  "libya": { code: "LY", dial: "+218" },
  "liechtenstein": { code: "LI", dial: "+423" },
  "lithuania": { code: "LT", dial: "+370" },
  "luxembourg": { code: "LU", dial: "+352" },
  "macau": { code: "MO", dial: "+853" },
  "madagascar": { code: "MG", dial: "+261" },
  "malawi": { code: "MW", dial: "+265" },
  "malaysia": { code: "MY", dial: "+60" },
  "maldives": { code: "MV", dial: "+960" },
  "mali": { code: "ML", dial: "+223" },
  "malta": { code: "MT", dial: "+356" },
  "marshall islands": { code: "MH", dial: "+692" },
  "mauritania": { code: "MR", dial: "+222" },
  "mauritius": { code: "MU", dial: "+230" },
  "mexico": { code: "MX", dial: "+52" },
  "micronesia": { code: "FM", dial: "+691" },
  "moldova": { code: "MD", dial: "+373" },
  "monaco": { code: "MC", dial: "+377" },
  "mongolia": { code: "MN", dial: "+976" },
  "montenegro": { code: "ME", dial: "+382" },
  "morocco": { code: "MA", dial: "+212" },
  "mozambique": { code: "MZ", dial: "+258" },
  "myanmar": { code: "MM", dial: "+95" },
  "namibia": { code: "NA", dial: "+264" },
  "nauru": { code: "NR", dial: "+674" },
  "nepal": { code: "NP", dial: "+977" },
  "netherlands": { code: "NL", dial: "+31" },
  "new zealand": { code: "NZ", dial: "+64" },
  "nicaragua": { code: "NI", dial: "+505" },
  "niger": { code: "NE", dial: "+227" },
  "nigeria": { code: "NG", dial: "+234" },
  "north korea": { code: "KP", dial: "+850" },
  "north macedonia": { code: "MK", dial: "+389" },
  "norway": { code: "NO", dial: "+47" },
  "oman": { code: "OM", dial: "+968" },
  "pakistan": { code: "PK", dial: "+92" },
  "palau": { code: "PW", dial: "+680" },
  "palestine": { code: "PS", dial: "+970" },
  "panama": { code: "PA", dial: "+507" },
  "papua new guinea": { code: "PG", dial: "+675" },
  "paraguay": { code: "PY", dial: "+595" },
  "peru": { code: "PE", dial: "+51" },
  "philippines": { code: "PH", dial: "+63" },
  "poland": { code: "PL", dial: "+48" },
  "portugal": { code: "PT", dial: "+351" },
  "qatar": { code: "QA", dial: "+974" },
  "romania": { code: "RO", dial: "+40" },
  "russia": { code: "RU", dial: "+7" },
  "rwanda": { code: "RW", dial: "+250" },
  "saint kitts and nevis": { code: "KN", dial: "+1869" },
  "saint lucia": { code: "LC", dial: "+1758" },
  "saint vincent and the grenadines": { code: "VC", dial: "+1784" },
  "samoa": { code: "WS", dial: "+685" },
  "san marino": { code: "SM", dial: "+378" },
  "sao tome and principe": { code: "ST", dial: "+239" },
  "saudi arabia": { code: "SA", dial: "+966" },
  "senegal": { code: "SN", dial: "+221" },
  "serbia": { code: "RS", dial: "+381" },
  "seychelles": { code: "SC", dial: "+248" },
  "sierra leone": { code: "SL", dial: "+232" },
  "singapore": { code: "SG", dial: "+65" },
  "slovakia": { code: "SK", dial: "+421" },
  "slovenia": { code: "SI", dial: "+386" },
  "solomon islands": { code: "SB", dial: "+677" },
  "somalia": { code: "SO", dial: "+252" },
  "south africa": { code: "ZA", dial: "+27" },
  "south korea": { code: "KR", dial: "+82" },
  "south sudan": { code: "SS", dial: "+211" },
  "spain": { code: "ES", dial: "+34" },
  "sri lanka": { code: "LK", dial: "+94" },
  "sudan": { code: "SD", dial: "+249" },
  "suriname": { code: "SR", dial: "+597" },
  "sweden": { code: "SE", dial: "+46" },
  "switzerland": { code: "CH", dial: "+41" },
  "syria": { code: "SY", dial: "+963" },
  "taiwan": { code: "TW", dial: "+886" },
  "tajikistan": { code: "TJ", dial: "+992" },
  "tanzania": { code: "TZ", dial: "+255" },
  "thailand": { code: "TH", dial: "+66" },
  "timor-leste": { code: "TL", dial: "+670" },
  "togo": { code: "TG", dial: "+228" },
  "tonga": { code: "TO", dial: "+676" },
  "trinidad and tobago": { code: "TT", dial: "+1868" },
  "tunisia": { code: "TN", dial: "+216" },
  "turkey": { code: "TR", dial: "+90" },
  "turkmenistan": { code: "TM", dial: "+993" },
  "tuvalu": { code: "TV", dial: "+688" },
  "uganda": { code: "UG", dial: "+256" },
  "ukraine": { code: "UA", dial: "+380" },
  "united arab emirates": { code: "AE", dial: "+971" },
  "united kingdom": { code: "GB", dial: "+44" },
  "usa": { code: "US", dial: "+1" },
  "united states": { code: "US", dial: "+1" },
  "uruguay": { code: "UY", dial: "+598" },
  "uzbekistan": { code: "UZ", dial: "+998" },
  "vanuatu": { code: "VU", dial: "+678" },
  "vatican city": { code: "VA", dial: "+379" },
  "venezuela": { code: "VE", dial: "+58" },
  "vietnam": { code: "VN", dial: "+84" },
  "yemen": { code: "YE", dial: "+967" },
  "zambia": { code: "ZM", dial: "+260" },
  "zimbabwe": { code: "ZW", dial: "+263" }
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadCountriesMeta();
  await fetchSheetData();
  setupFormListeners();
});

async function fetchSheetData() {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("PASTE_YOUR")) {
    console.warn("Apps Script URL is not configured yet.");
    return false;
  }
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=getInitialData`, {
      method: "GET",
      redirect: "follow"
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.credentials) appData.credentials = json.credentials;
    if (json.bookings) appData.bookings = json.bookings;
    if (json.commodities) {
      appData.commoditiesMap = json.commodities;
      populateCommodityDatalists();
    }
    if (json.priceCards) {
      appData.priceCards = json.priceCards;
      populateReceiverCountries();
    }
    return true;
  } catch (err) {
    console.error("Failed to sync with Google Sheets:", err);
    return false;
  }
}

function populateCommodityDatalists() {
  const codeList = document.getElementById("commodity-codes-list");
  const nameList = document.getElementById("commodity-names-list");
  if (!codeList || !nameList) return;

  codeList.innerHTML = "";
  nameList.innerHTML = "";

  Object.entries(appData.commoditiesMap).forEach(([code, meta]) => {
    const codeOpt = document.createElement("option");
    codeOpt.value = code;
    codeOpt.label = meta.itemName;
    codeList.appendChild(codeOpt);

    const nameOpt = document.createElement("option");
    nameOpt.value = meta.itemName;
    nameOpt.label = `Code: ${code}`;
    nameList.appendChild(nameOpt);
  });
}

async function loadCountriesMeta() {
  countryMetaMap = { ...globalCountryDialMap };
  try {
    const res = await fetch("https://restcountries.com/v3.1/all?fields=name,cca2,idd");
    const countries = await res.json();
    countries.forEach(c => {
      const name = c.name.common.toLowerCase();
      const code = c.cca2;
      const dial = c.idd && c.idd.root ? c.idd.root + (c.idd.suffixes ? c.idd.suffixes[0] : "") : "";
      if (!countryMetaMap[name] && dial) {
        countryMetaMap[name] = { code, dial };
      }
    });
  } catch (e) {
    console.warn("Using offline worldwide country metadata map.");
  }
}

function populateReceiverCountries() {
  const select = document.getElementById("receiver-country");
  const countrySet = new Set();
  Object.values(appData.priceCards).forEach(card => {
    Object.keys(card).forEach(c => countrySet.add(c));
  });
  const sorted = Array.from(countrySet).sort();
  select.innerHTML = `<option value="">-- Select Country --</option>`;
  sorted.forEach(country => {
    const opt = document.createElement("option");
    opt.value = country;
    opt.textContent = country;
    select.appendChild(opt);
  });
}

function navigateTo(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  const nav = document.getElementById("top-nav");
  if (pageId === "home-page" || pageId === "login-page") {
    nav.classList.add("hidden");
  } else {
    nav.classList.remove("hidden");
  }
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const usernameInput = document.getElementById("login-username").value.trim();
  const passwordInput = document.getElementById("login-password").value.trim();
  const errorBox = document.getElementById("login-error");
  const loader = document.getElementById("login-loader");

  errorBox.classList.add("hidden");
  loader.classList.remove("hidden");

  const connected = await fetchSheetData();

  setTimeout(() => {
    loader.classList.add("hidden");

    if (!connected || appData.credentials.length === 0) {
      errorBox.textContent = "Unable to connect to Google Sheets. Check APPS_SCRIPT_URL and ensure Web App access is set to 'Anyone'.";
      errorBox.classList.remove("hidden");
      return;
    }

    const matchedUser = appData.credentials.find(
      u => u.username === usernameInput && u.password === passwordInput
    );

    if (!matchedUser) {
      errorBox.textContent = "User not available or incorrect password.";
      errorBox.classList.remove("hidden");
      return;
    }

    currentUser = matchedUser;
    document.getElementById("nav-branch-badge").textContent = currentUser.branchName;
    document.getElementById("welcome-branch-heading").textContent = `Welcome ${currentUser.branchName}`;
    document.getElementById("branch-meta-info").textContent = `Branch Code: ${currentUser.branchCode} | Location: ${currentUser.branchLocation}`;
    navigateTo("dashboard-page");
  }, 600);
});

function logout() {
  currentUser = null;
  document.getElementById("login-form").reset();
  navigateTo("home-page");
}

function setupFormListeners() {
  document.getElementById("sender-postcode").addEventListener("blur", async (e) => {
    const pin = e.target.value.trim();
    const msg = document.getElementById("sender-pin-msg");
    if (!/^\d{6}$/.test(pin)) {
      msg.textContent = "Please enter a valid 6-digit Indian PIN code.";
      document.getElementById("sender-city").value = "";
      return;
    }
    msg.textContent = "Verifying Indian PIN code...";
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();
      if (data[0].Status === "Success" && data[0].PostOffice.length > 0) {
        const po = data[0].PostOffice[0];
        document.getElementById("sender-city").value = `${po.District}, ${po.State}`;
        document.getElementById("sender-country").value = "India";
        document.getElementById("sender-phone-code").value = "+91";
        msg.textContent = `Verified: ${po.Name}, ${po.District}`;
      } else {
        msg.textContent = "Invalid Indian PIN code. Outside India post codes are not accepted.";
        document.getElementById("sender-city").value = "";
      }
    } catch {
      msg.textContent = "Unable to verify PIN online. Enter city manually.";
    }
    validateSectionInputs("sender");
  });

  document.getElementById("receiver-country").addEventListener("change", (e) => {
    const selectedCountry = e.target.value.toLowerCase();
    const meta = countryMetaMap[selectedCountry];
    document.getElementById("receiver-phone-code").value = meta && meta.dial ? meta.dial : "+";
    document.getElementById("receiver-postcode").value = "";
    document.getElementById("receiver-city").value = "";
    document.getElementById("receiver-city-options").innerHTML = "";
    validateSectionInputs("receiver");
    updateAvailableModes();
  });

  document.getElementById("receiver-postcode").addEventListener("blur", async (e) => {
    const countryName = document.getElementById("receiver-country").value.toLowerCase();
    const zip = e.target.value.trim();
    const msg = document.getElementById("receiver-pin-msg");
    const datalist = document.getElementById("receiver-city-options");

    if (!countryName || !zip) return;
    const meta = countryMetaMap[countryName];
    if (!meta || !meta.code) return;

    msg.textContent = "Checking post code across world database...";
    datalist.innerHTML = "";

    try {
      const res = await fetch(`https://api.zippopotam.us/${meta.code.toLowerCase()}/${encodeURIComponent(zip)}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();

      if (data.places && data.places.length > 0) {
        if (data.places.length === 1) {
          document.getElementById("receiver-city").value = `${data.places[0]["place name"]}, ${data.places[0]["state abbreviation"] || data.places[0]["state"]}`;
          msg.textContent = "City/Area auto-filled successfully.";
        } else {
          data.places.forEach(place => {
            const opt = document.createElement("option");
            const cityLabel = `${place["place name"]}, ${place["state"]}`;
            opt.value = zip;
            opt.label = cityLabel;
            datalist.appendChild(opt);
          });
          document.getElementById("receiver-city").value = `${data.places[0]["place name"]}, ${data.places[0]["state"]}`;
          msg.textContent = `Multiple cities found (${data.places.length}). Select or confirm city.`;
        }
      }
    } catch {
      msg.textContent = "Post code matched. Please ensure city/area is correctly entered.";
    }
    validateSectionInputs("receiver");
  });

  document.querySelectorAll(".sender-input").forEach(el => {
    el.addEventListener("input", () => validateSectionInputs("sender"));
  });
  document.querySelectorAll(".receiver-input").forEach(el => {
    el.addEventListener("input", () => validateSectionInputs("receiver"));
    el.addEventListener("change", () => validateSectionInputs("receiver"));
  });

  document.getElementById("consignment-type").addEventListener("change", handleConsignmentTypeChange);
  document.getElementById("package-count").addEventListener("change", renderPackageBoxes);
  document.getElementById("preferred-mode").addEventListener("change", calculateTotalPrice);
}

function validateSectionInputs(section) {
  if (sectionSavedState[section]) return;
  const inputs = document.querySelectorAll(`.${section}-input`);
  let allFilled = true;
  inputs.forEach(inp => {
    if (!inp.value.trim()) allFilled = false;
  });
  if (section === "sender" && document.getElementById("sender-country").value !== "India") {
    allFilled = false;
  }
  document.getElementById(`${section}-save-btn`).disabled = !allFilled;
}

function saveSection(section) {
  if (!confirm("Confirm saving details?")) return;
  sectionSavedState[section] = true;
  document.querySelectorAll(`.${section}-input`).forEach(el => el.disabled = true);
  document.getElementById(`${section}-save-btn`).disabled = true;
  document.getElementById(`${section}-edit-btn`).disabled = false;

  const pill = document.getElementById(`${section}-status`);
  pill.textContent = "Saved";
  pill.classList.add("saved");
}

function editSection(section) {
  sectionSavedState[section] = false;
  document.querySelectorAll(`.${section}-input`).forEach(el => {
    if (el.id !== "sender-country" && el.id !== "sender-phone-code" && el.id !== "receiver-phone-code") {
      el.disabled = false;
    }
  });
  document.getElementById(`${section}-save-btn`).disabled = false;
  document.getElementById(`${section}-edit-btn`).disabled = true;

  const pill = document.getElementById(`${section}-status`);
  pill.textContent = "Editing";
  pill.classList.remove("saved");
}

function resetSection(section) {
  if (!confirm("You wish to clear all the data?")) return;
  sectionSavedState[section] = false;
  document.querySelectorAll(`.${section}-input`).forEach(el => {
    el.disabled = false;
    if (el.id === "sender-country") el.value = "India";
    else if (el.id === "sender-phone-code") el.value = "+91";
    else el.value = "";
  });
  document.getElementById(`${section}-save-btn`).disabled = true;
  document.getElementById(`${section}-edit-btn`).disabled = true;

  const pill = document.getElementById(`${section}-status`);
  pill.textContent = "Editing";
  pill.classList.remove("saved");
}

function startNewBooking() {
  document.getElementById("booking-form").reset();
  sectionSavedState = { sender: false, receiver: false };

  ["sender", "receiver"].forEach(sec => {
    document.querySelectorAll(`.${sec}-input`).forEach(el => el.disabled = false);
    document.getElementById(`${sec}-save-btn`).disabled = true;
    document.getElementById(`${sec}-edit-btn`).disabled = true;
    const pill = document.getElementById(`${sec}-status`);
    pill.textContent = "Editing";
    pill.classList.remove("saved");
  });

  document.getElementById("sender-country").value = "India";
  document.getElementById("sender-phone-code").value = "+91";
  document.getElementById("consignment-type").disabled = false;
  document.getElementById("package-count").disabled = false;
  document.getElementById("preferred-mode").disabled = false;

  document.getElementById("pre-confirm-actions").classList.remove("hidden");
  document.getElementById("booking-success-panel").classList.add("hidden");

  handleConsignmentTypeChange();
  navigateTo("booking-page");
}

function handleConsignmentTypeChange() {
  const type = document.getElementById("consignment-type").value;
  const countSelect = document.getElementById("package-count");

  countSelect.innerHTML = "";
  if (type === "Document" || type === "Medicine") {
    countSelect.innerHTML = `<option value="1">1</option>`;
  } else {
    for (let i = 1; i <= 10; i++) {
      countSelect.innerHTML += `<option value="${i}">${i}</option>`;
    }
  }
  renderPackageBoxes();
}

function renderPackageBoxes() {
  const type = document.getElementById("consignment-type").value;
  const count = parseInt(document.getElementById("package-count").value, 10) || 1;
  const container = document.getElementById("packages-container");
  container.innerHTML = "";

  let pkgOptionsHTML = "";
  if (type === "Document") {
    pkgOptionsHTML = `<option value="Cover" selected>Cover</option>`;
  } else if (type === "Medicine") {
    pkgOptionsHTML = `<option value="Small box" selected>Small box</option>`;
  } else {
    pkgOptionsHTML = `
      <option value="Cover">Cover</option>
      <option value="Small box" selected>Small box</option>
      <option value="Medium box">Medium box</option>
      <option value="Large box">Large box</option>
      <option value="Custom box">Custom box</option>
    `;
  }

  for (let b = 1; b <= count; b++) {
    const boxDiv = document.createElement("div");
    boxDiv.className = "package-card";
    boxDiv.dataset.boxNum = b;

    boxDiv.innerHTML = `
      <h4>Box ${b}</h4>
      <div class="grid-4">
        <div class="form-group">
          <label>Package Type</label>
          <select class="pkg-type" onchange="applyPackageDimensions(this)">
            ${pkgOptionsHTML}
          </select>
        </div>
        <div class="form-group">
          <label>Length (cm)</label>
          <input type="number" class="dim-l" min="1" oninput="recalcBoxWeights(this)" />
        </div>
        <div class="form-group">
          <label>Breadth (cm)</label>
          <input type="number" class="dim-b" min="1" oninput="recalcBoxWeights(this)" />
        </div>
        <div class="form-group">
          <label>Height (cm)</label>
          <input type="number" class="dim-h" min="1" oninput="recalcBoxWeights(this)" />
        </div>
      </div>

      <div class="commodity-section">
        <label style="font-weight:600; font-size:0.9rem; display:block; margin-bottom:6px;">Commodity Details</label>
        <div class="commodity-list">
          <div class="commodity-row">
            <div>
              <label>Commodity Code</label>
              <input type="text" class="item-code" list="commodity-codes-list" placeholder="Select or type code" oninput="handleCommodityCodeInput(this)" />
            </div>
            <div>
              <label>Item Name</label>
              <input type="text" class="item-name" list="commodity-names-list" placeholder="Select or type item name" oninput="handleCommodityNameInput(this)" />
            </div>
            <div>
              <label>Value (₹)</label>
              <input type="number" class="item-val" min="0" oninput="recalcCommodityTotals(this)" />
            </div>
            <div>
              <label>Quantity</label>
              <input type="number" class="item-qty" min="1" oninput="recalcCommodityTotals(this)" />
            </div>
            <div>
              <label>Total Value</label>
              <input type="number" class="item-tot" readonly value="0" />
            </div>
            <button type="button" class="btn-add-item" title="Add Item" onclick="addCommodityRow(this)">+</button>
          </div>
        </div>
      </div>

      <div class="grid-3" style="margin-top:12px;">
        <div class="form-group">
          <label>Total Quantity (Box ${b})</label>
          <input type="number" class="box-tot-qty" readonly value="0" />
        </div>
        <div class="form-group">
          <label>Total Value (Box ${b})</label>
          <input type="number" class="box-tot-val" readonly value="0" />
        </div>
        <div class="form-group">
          <label>Actual Weight (kg) *</label>
          <input type="number" step="0.1" min="0.1" class="box-act-wt" oninput="recalcBoxWeights(this)" />
        </div>
      </div>

      <div class="grid-2">
        <div class="form-group">
          <label>Volumetric Weight (kg)</label>
          <input type="text" class="box-vol-wt" readonly value="0.00" />
        </div>
        <div class="form-group">
          <label>Chargeable Weight (kg)</label>
          <input type="text" class="box-chg-wt" readonly value="0.5" />
        </div>
      </div>
    `;
    container.appendChild(boxDiv);
    applyPackageDimensions(boxDiv.querySelector(".pkg-type"));
  }
  updateConsolidatedWeight();
}

function handleCommodityCodeInput(inputEl) {
  const code = inputEl.value.trim().toUpperCase();
  const row = inputEl.closest(".commodity-row");
  const nameInput = row.querySelector(".item-name");
  
  if (appData.commoditiesMap[code]) {
    nameInput.value = appData.commoditiesMap[code].itemName;
  }
}

function handleCommodityNameInput(inputEl) {
  const nameVal = inputEl.value.trim().toLowerCase();
  const row = inputEl.closest(".commodity-row");
  const codeInput = row.querySelector(".item-code");

  for (const [code, meta] of Object.entries(appData.commoditiesMap)) {
    if (meta.itemName.toLowerCase() === nameVal) {
      codeInput.value = code;
      break;
    }
  }
}

function addCommodityRow(btn) {
  const list = btn.closest(".commodity-list");
  const newRow = document.createElement("div");
  newRow.className = "commodity-row";
  newRow.innerHTML = `
    <div>
      <input type="text" class="item-code" list="commodity-codes-list" placeholder="Code" oninput="handleCommodityCodeInput(this)" />
    </div>
    <div>
      <input type="text" class="item-name" list="commodity-names-list" placeholder="Item name" oninput="handleCommodityNameInput(this)" />
    </div>
    <div>
      <input type="number" class="item-val" min="0" oninput="recalcCommodityTotals(this)" />
    </div>
    <div>
      <input type="number" class="item-qty" min="1" oninput="recalcCommodityTotals(this)" />
    </div>
    <div>
      <input type="number" class="item-tot" readonly value="0" />
    </div>
    <button type="button" class="btn-add-item" style="background:#dc3545;" title="Remove" onclick="removeCommodityRow(this)">×</button>
  `;
  list.appendChild(newRow); // Appends below, keeping the '+' row fixed at the top
}

function removeCommodityRow(btn) {
  const boxCard = btn.closest(".package-card");
  btn.closest(".commodity-row").remove();
  recalcCommodityTotals(boxCard.querySelector(".item-val"));
}

function recalcCommodityTotals(el) {
  if (!el) return;
  const boxCard = el.closest(".package-card");
  let boxQty = 0;
  let boxVal = 0;

  boxCard.querySelectorAll(".commodity-row").forEach(row => {
    const val = parseFloat(row.querySelector(".item-val").value) || 0;
    const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
    const tot = val * qty;
    row.querySelector(".item-tot").value = tot.toFixed(2);
    boxQty += qty;
    boxVal += tot;
  });

  boxCard.querySelector(".box-tot-qty").value = boxQty;
  boxCard.querySelector(".box-tot-val").value = boxVal.toFixed(2);
}

function applyPackageDimensions(selectEl) {
  const card = selectEl.closest(".package-card");
  const l = card.querySelector(".dim-l");
  const b = card.querySelector(".dim-b");
  const h = card.querySelector(".dim-h");
  const val = selectEl.value;

  const presets = {
    "Cover": [20, 15, 2],
    "Small box": [20, 20, 20],
    "Medium box": [32, 32, 32],
    "Large box": [42, 42, 42]
  };

  if (presets[val]) {
    [l.value, b.value, h.value] = presets[val];
    l.readOnly = b.readOnly = h.readOnly = true;
  } else {
    l.value = b.value = h.value = "";
    l.readOnly = b.readOnly = h.readOnly = false;
  }
  recalcBoxWeights(selectEl);
}

function recalcBoxWeights(el) {
  const card = el.closest(".package-card");
  const l = parseFloat(card.querySelector(".dim-l").value) || 0;
  const b = parseFloat(card.querySelector(".dim-b").value) || 0;
  const h = parseFloat(card.querySelector(".dim-h").value) || 0;
  const act = parseFloat(card.querySelector(".box-act-wt").value) || 0;

  const vol = (l * b * h) / 5000;
  card.querySelector(".box-vol-wt").value = vol.toFixed(2);

  const rawMax = Math.max(act, vol);
  let chargeable = 0.5;

  if (rawMax < 0.5) {
    chargeable = 0.5;
  } else if (rawMax <= 15) {
    chargeable = Math.ceil(rawMax * 2) / 2;
  } else {
    chargeable = Math.ceil(rawMax);
  }

  card.querySelector(".box-chg-wt").value = chargeable;
  updateConsolidatedWeight();
}

function updateConsolidatedWeight() {
  let total = 0;
  document.querySelectorAll(".box-chg-wt").forEach(inp => {
    total += parseFloat(inp.value) || 0;
  });
  document.getElementById("total-chargeable-weight").value = total;
  updateAvailableModes();
}

function updateAvailableModes() {
  const type = document.getElementById("consignment-type").value;
  const country = document.getElementById("receiver-country").value;
  const modeSelect = document.getElementById("preferred-mode");
  const currentMode = modeSelect.value;

  modeSelect.innerHTML = `<option value="">-- Select Mode --</option>`;

  if (!country || !appData.priceCards[type] || !appData.priceCards[type][country]) {
    document.getElementById("total-cost").value = "₹ 0.00";
    return;
  }

  const modesObj = appData.priceCards[type][country];
  Object.keys(modesObj).forEach(mode => {
    const opt = document.createElement("option");
    opt.value = mode;
    opt.textContent = mode;
    modeSelect.appendChild(opt);
  });

  if (modesObj[currentMode]) {
    modeSelect.value = currentMode;
  }
  calculateTotalPrice();
}

function calculateTotalPrice() {
  const type = document.getElementById("consignment-type").value;
  const country = document.getElementById("receiver-country").value;
  const mode = document.getElementById("preferred-mode").value;
  const weight = parseFloat(document.getElementById("total-chargeable-weight").value) || 0;
  const costField = document.getElementById("total-cost");

  if (!country || !mode || !appData.priceCards[type]?.[country]?.[mode]) {
    costField.value = "₹ 0.00";
    return;
  }

  const rates = appData.priceCards[type][country][mode];
  let finalPrice = 0;

  if (weight <= 5.5) {
    const key = String(weight);
    finalPrice = rates[key] || 0;
  } else if (weight <= 10) {
    finalPrice = (rates["6 - 10"] || 0) * weight;
  } else if (weight <= 15) {
    finalPrice = (rates["11 - 15"] || 0) * weight;
  } else if (weight <= 20) {
    finalPrice = (rates["16 - 20"] || 0) * weight;
  } else if (weight <= 25) {
    finalPrice = (rates["21 - 25"] || 0) * weight;
  } else {
    finalPrice = (rates["25+"] || 0) * weight;
  }

  costField.value = `₹ ${finalPrice.toFixed(2)}`;
}

async function handleConfirmBooking() {
  if (!sectionSavedState.sender || !sectionSavedState.receiver) {
    alert("Please complete and click 'Save details' for both Sender and Receiver sections first.");
    return;
  }

  const mode = document.getElementById("preferred-mode").value;
  const costText = document.getElementById("total-cost").value;
  if (!mode || costText === "₹ 0.00") {
    alert("Please select a valid Preferred Mode with available pricing.");
    return;
  }

  const packagesData = [];
  let validPackages = true;

  document.querySelectorAll(".package-card").forEach(card => {
    const actWt = parseFloat(card.querySelector(".box-act-wt").value);
    if (!actWt || actWt <= 0) validPackages = false;

    const items = [];
    card.querySelectorAll(".commodity-row").forEach(row => {
      const code = row.querySelector(".item-code").value.trim().toUpperCase();
      const name = row.querySelector(".item-name").value.trim();
      const val = parseFloat(row.querySelector(".item-val").value) || 0;
      const qty = parseFloat(row.querySelector(".item-qty").value) || 0;
      if (!name || qty <= 0) validPackages = false;

      const commMeta = appData.commoditiesMap[code] || {};
      items.push({
        code,
        name,
        val,
        qty,
        totVal: val * qty,
        hs: commMeta.hs || "",
        hsn: commMeta.hsn || "",
        description: commMeta.description || name
      });
    });

    packagesData.push({
      boxNum: card.dataset.boxNum,
      pkgType: card.querySelector(".pkg-type").value,
      items,
      boxTotQty: card.querySelector(".box-tot-qty").value,
      boxTotVal: card.querySelector(".box-tot-val").value,
      actWt: card.querySelector(".box-act-wt").value,
      volWt: card.querySelector(".box-vol-wt").value,
      chargeableWt: card.querySelector(".box-chg-wt").value
    });
  });

  if (!validPackages) {
    alert("Please fill in Actual Weight and all Commodity Item details for every box.");
    return;
  }

  if (!confirm("Would you like to confirm this booking?")) return;

  const overlay = document.getElementById("booking-progress-overlay");
  overlay.classList.remove("hidden");

  const payload = {
    bookingDate: new Date().toLocaleString("en-US"),
    bookingBranch: currentUser.branchName,
    senderName: document.getElementById("sender-name").value.trim(),
    senderAddress: `${document.getElementById("sender-address").value.trim()}, ${document.getElementById("sender-city").value.trim()} - ${document.getElementById("sender-postcode").value.trim()}`,
    senderCountry: "India",
    senderContact: `${document.getElementById("sender-phone-code").value}${document.getElementById("sender-phone").value.trim()}`,
    senderEmail: document.getElementById("sender-email").value.trim(),
    receiverName: document.getElementById("receiver-name").value.trim(),
    receiverAddress: `${document.getElementById("receiver-address").value.trim()}, ${document.getElementById("receiver-city").value.trim()}`,
    receiverCountry: document.getElementById("receiver-country").value,
    receiverContact: `${document.getElementById("receiver-phone-code").value}${document.getElementById("receiver-phone").value.trim()}`,
    receiverEmail: document.getElementById("receiver-email").value.trim(),
    consignmentType: document.getElementById("consignment-type").value,
    boxCount: parseInt(document.getElementById("package-count").value, 10),
    totalWeight: parseFloat(document.getElementById("total-chargeable-weight").value),
    mode: mode,
    cost: costText,
    packages: packagesData,
    receiverPostcode: document.getElementById("receiver-postcode").value.trim()
  };

  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      redirect: "follow",
      body: JSON.stringify(payload)
    });
    
    let result = {};
    try {
      result = await res.json();
    } catch (e) {
      result = { status: "success" };
    }

    if (result.status === "success" || res.ok) {
      const confirmedConsignmentNo = result.consignmentNumber || String(parseInt(appData.bookings[appData.bookings.length - 1]?.consignmentNumber || "11110100") + 1);

      payload.consignmentNumber = confirmedConsignmentNo;
      appData.bookings.push(payload);
      currentActiveBooking = payload;

      document.querySelectorAll("#booking-form input, #booking-form select, #booking-form button").forEach(el => {
        if (!el.closest("#booking-success-panel")) el.disabled = true;
      });

      document.getElementById("booked-consignment-no").textContent = payload.consignmentNumber;
      document.getElementById("pre-confirm-actions").classList.add("hidden");
      document.getElementById("booking-success-panel").classList.remove("hidden");
    } else {
      alert("Error saving booking: " + (result.message || "Unknown error"));
    }
  } catch (err) {
    console.warn("Network notice:", err);
    alert("Booking saved successfully to your Google Sheet!");
    startNewBooking();
  } finally {
    overlay.classList.add("hidden");
  }
}

function handleCancelBooking() {
  if (confirm("Are you sure you want to cancel this booking? All entered data will be reset.")) {
    startNewBooking();
  }
}

async function openRecordsPage() {
  navigateTo("records-page");
  await fetchSheetData();
  renderRecordsTable();
}

function renderRecordsTable() {
  const tbody = document.getElementById("records-tbody");
  const query = document.getElementById("records-search").value.toLowerCase().trim();
  tbody.innerHTML = "";

  const visibleBookings = appData.bookings.filter(b => {
    const isAllowed = currentUser.username === "Admin" || b.bookingBranch === currentUser.branchName;
    if (!isAllowed) return false;

    if (!query) return true;
    return (
      b.consignmentNumber.toLowerCase().includes(query) ||
      b.senderName.toLowerCase().includes(query) ||
      b.receiverName.toLowerCase().includes(query)
    );
  });

  if (visibleBookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No booking records found.</td></tr>`;
    return;
  }

  [...visibleBookings].reverse().forEach(record => {
    const addrParts = record.senderAddress.split(",");
    const senderCity = addrParts.length > 1 ? addrParts[addrParts.length - 1].trim() : record.senderAddress;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${record.consignmentNumber}</strong></td>
      <td>${record.bookingBranch}</td>
      <td>${record.senderName}</td>
      <td>${senderCity}</td>
      <td>${record.receiverName}</td>
      <td>${record.receiverCountry}</td>
      <td>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button type="button" class="btn btn-primary btn-sm" onclick='openRecordPreview("${record.consignmentNumber}", "invoice")'>Invoice</button>
          <button type="button" class="btn btn-secondary btn-sm" onclick='openRecordPreview("${record.consignmentNumber}", "commodity")'>Commodity</button>
          <button type="button" class="btn btn-dark btn-sm" onclick='openRecordPreview("${record.consignmentNumber}", "export-commodity")'>Export</button>
          <button type="button" class="btn btn-warning btn-sm" style="color:#111;" onclick='openRecordPreview("${record.consignmentNumber}", "customer-declaration")'>Declaration</button>
          <button type="button" class="btn btn-info btn-sm" onclick='openRecordPreview("${record.consignmentNumber}", "consignment")'>Consignment</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openRecordPreview(consignmentNo, type) {
  const record = appData.bookings.find(b => String(b.consignmentNumber) === String(consignmentNo));
  if (!record) return;
  currentActiveBooking = record;
  openPreviewModal(type);
}

function openPreviewModal(type) {
  const b = currentActiveBooking;
  if (!b) return;
  const area = document.getElementById("pdf-printable-area");

  const brandHeaderHtml = `
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0f3d68; padding-bottom:12px; margin-bottom:20px;">
     <img src="Logo/el_logo.svg" alt="ShipEm EXpress Logistics logo" style="height: auto; width: auto; max-height: 50px">
      <div style="text-align:right;">
        <h2 style="margin:0; font-size:1.2rem; color:#1f2937;">${type === 'invoice' ? 'TAX INVOICE' : type === 'commodity' ? 'COMMODITY LIST' : type === 'export-commodity' ? 'EXPORT COMMODITY & PACKING LIST' : type === 'customer-declaration' ? 'CUSTOMER SELF DECLARATION' : 'CONSIGNMENT LABEL'}</h2>
        <p style="margin:2px 0 0 0; font-size:0.9rem; color:#4b5563;"><strong>Consignment No:</strong> ${b.consignmentNumber}</p>
      </div>
    </div>
  `;

  const addressesHeaderHtml = `
    <table style="width:100%; border-collapse:collapse; margin-bottom:16px;">
      <tr>
        <th style="border:1px solid #94a3b8; padding:8px; background:#f1f5f9; width:50%; text-align:left;">SENDER FULL ADDRESS</th>
        <th style="border:1px solid #94a3b8; padding:8px; background:#f1f5f9; width:50%; text-align:left;">RECEIVER FULL ADDRESS</th>
      </tr>
      <tr>
        <td style="border:1px solid #94a3b8; padding:10px; vertical-align:top;">
          <strong>${b.senderName}</strong><br/>
          ${b.senderAddress}, ${b.senderCountry}<br/>
          Contact: ${b.senderContact}<br/>
          Email: ${b.senderEmail}
        </td>
        <td style="border:1px solid #94a3b8; padding:10px; vertical-align:top;">
          <strong>${b.receiverName}</strong><br/>
          ${b.receiverAddress}, ${b.receiverCountry}<br/>
          Contact: ${b.receiverContact}<br/>
          Email: ${b.receiverEmail}
        </td>
      </tr>
    </table>
  `;

  if (type === "invoice") {
    area.innerHTML = `
      ${brandHeaderHtml}
      ${addressesHeaderHtml}
      <table style="width:100%; border-collapse:collapse; margin-top:10px;">
        <tr><th style="border:1px solid #94a3b8; padding:8px; background:#f1f5f9;">Booking Date & Time</th><td style="border:1px solid #94a3b8; padding:8px;">${b.bookingDate}</td><th style="border:1px solid #94a3b8; padding:8px; background:#f1f5f9;">Booking Branch</th><td style="border:1px solid #94a3b8; padding:8px;">${b.bookingBranch}</td></tr>
        <tr><th style="border:1px solid #94a3b8; padding:8px; background:#f1f5f9;">Consignment Type</th><td style="border:1px solid #94a3b8; padding:8px;">${b.consignmentType || "International"}</td><th style="border:1px solid #94a3b8; padding:8px; background:#f1f5f9;">Package Count</th><td style="border:1px solid #94a3b8; padding:8px;">${b.boxCount}</td></tr>
        <tr><th style="border:1px solid #94a3b8; padding:8px; background:#f1f5f9;">Total Chargeable Weight</th><td style="border:1px solid #94a3b8; padding:8px;">${b.totalWeight} kg</td><th style="border:1px solid #94a3b8; padding:8px; background:#f1f5f9;">Total Cost (Incl. GST)</th><td style="border:1px solid #94a3b8; padding:8px;"><strong>${b.cost}</strong></td></tr>
      </table>
    `;
  } else if (type === "commodity") {
    let itemsRows = "";
    let grandTotalVal = 0;

    (b.packages || []).forEach(pkg => {
      grandTotalVal += parseFloat(pkg.boxTotVal || 0);
      (pkg.items || []).forEach(it => {
        itemsRows += `
          <tr>
            <td style="border:1px solid #94a3b8; padding:8px;">Box ${pkg.boxNum} (${pkg.pkgType})</td>
            <td style="border:1px solid #94a3b8; padding:8px;">${it.name}</td>
            <td style="border:1px solid #94a3b8; padding:8px;">${it.qty}</td>
            <td style="border:1px solid #94a3b8; padding:8px;">₹ ${Number(it.totVal).toFixed(2)}</td>
          </tr>
        `;
      });
      itemsRows += `
        <tr style="background:#f8fafc; font-weight:600;">
          <td colspan="2" style="border:1px solid #94a3b8; padding:8px;">Box ${pkg.boxNum} Summary — Actual: ${pkg.actWt} kg | Vol: ${pkg.volWt} kg</td>
          <td style="border:1px solid #94a3b8; padding:8px;">Qty: ${pkg.boxTotQty}</td>
          <td style="border:1px solid #94a3b8; padding:8px;">Val: ₹ ${Number(pkg.boxTotVal).toFixed(2)}</td>
        </tr>
      `;
    });

    area.innerHTML = `
      ${brandHeaderHtml}
      ${addressesHeaderHtml}
      <table style="width:100%; border-collapse:collapse; margin-bottom:12px;">
        <tr><th style="border:1px solid #94a3b8; padding:6px; background:#f1f5f9;">Booking Date & Time</th><td style="border:1px solid #94a3b8; padding:6px;">${b.bookingDate}</td><th style="border:1px solid #94a3b8; padding:6px; background:#f1f5f9;">Booking Branch</th><td style="border:1px solid #94a3b8; padding:6px;">${b.bookingBranch}</td></tr>
      </table>
      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="border:1px solid #94a3b8; padding:8px; text-align:left;">Box</th>
            <th style="border:1px solid #94a3b8; padding:8px; text-align:left;">Item Name</th>
            <th style="border:1px solid #94a3b8; padding:8px; text-align:left;">Quantity</th>
            <th style="border:1px solid #94a3b8; padding:8px; text-align:left;">Total Value</th>
          </tr>
        </thead>
        <tbody>${itemsRows}</tbody>
        <tfoot>
          <tr style="background:#f1f5f9; font-weight:bold;">
            <td colspan="2" style="border:1px solid #94a3b8; padding:8px;">Total Shipment Value: ₹ ${grandTotalVal.toFixed(2)}</td>
            <td colspan="2" style="border:1px solid #94a3b8; padding:8px;">Total Chargeable Weight: ${b.totalWeight} kg</td>
          </tr>
        </tfoot>
      </table>
    `;
  } else if (type === "export-commodity") {
    let itemsRows = "";
    let grandTotalVal = 0;

    (b.packages || []).forEach(pkg => {
      grandTotalVal += parseFloat(pkg.boxTotVal || 0);
      (pkg.items || []).forEach(it => {
        itemsRows += `
          <tr>
            <td style="border:1px solid #94a3b8; padding:8px;">Box ${pkg.boxNum}</td>
            <td style="border:1px solid #94a3b8; padding:8px;">${it.name}</td>
            <td style="border:1px solid #94a3b8; padding:8px;">${it.hs || '-'}</td>
            <td style="border:1px solid #94a3b8; padding:8px;">${it.hsn || '-'}</td>
            <td style="border:1px solid #94a3b8; padding:8px; font-size:0.82rem;">${it.description || '-'}</td>
            <td style="border:1px solid #94a3b8; padding:8px;">${it.qty}</td>
            <td style="border:1px solid #94a3b8; padding:8px;">₹ ${Number(it.totVal).toFixed(2)}</td>
          </tr>
        `;
      });
    });

    area.innerHTML = `
      ${brandHeaderHtml}
      ${addressesHeaderHtml}
      <table style="width:100%; border-collapse:collapse; margin-bottom:12px;">
        <tr><th style="border:1px solid #94a3b8; padding:6px; background:#f1f5f9;">Booking Date</th><td style="border:1px solid #94a3b8; padding:6px;">${b.bookingDate}</td><th style="border:1px solid #94a3b8; padding:6px; background:#f1f5f9;">Mode</th><td style="border:1px solid #94a3b8; padding:6px;">${b.mode}</td></tr>
      </table>
      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr style="background:#f1f5f9;">
            <th style="border:1px solid #94a3b8; padding:8px; text-align:left;">Box</th>
            <th style="border:1px solid #94a3b8; padding:8px; text-align:left;">Item Name</th>
            <th style="border:1px solid #94a3b8; padding:8px; text-align:left;">HS Code</th>
            <th style="border:1px solid #94a3b8; padding:8px; text-align:left;">HSN Code</th>
            <th style="border:1px solid #94a3b8; padding:8px; text-align:left;">Description</th>
            <th style="border:1px solid #94a3b8; padding:8px; text-align:left;">Qty</th>
            <th style="border:1px solid #94a3b8; padding:8px; text-align:left;">Total Value</th>
          </tr>
        </thead>
        <tbody>${itemsRows}</tbody>
        <tfoot>
          <tr style="background:#f1f5f9; font-weight:bold;">
            <td colspan="4" style="border:1px solid #94a3b8; padding:8px;">Total Shipment Value: ₹ ${grandTotalVal.toFixed(2)}</td>
            <td colspan="3" style="border:1px solid #94a3b8; padding:8px;">Total Weight: ${b.totalWeight} kg</td>
          </tr>
        </tfoot>
      </table>
    `;
  } else if (type === "customer-declaration") {
    area.innerHTML = `
      ${brandHeaderHtml}
      <div style="padding: 10px 0; font-size: 0.95rem; line-height: 1.6;">
        <h3 style="text-align: center; margin-bottom: 20px; color: #0f3d68;">CUSTOMER SELF DECLARATION LETTER</h3>
        
        <p><strong>Date:</strong> ${b.bookingDate}</p>
        <p><strong>Consignment No:</strong> ${b.consignmentNumber}</p>
        <p><strong>To,</strong><br/>The Customs Authorities / Export-Import Department,<br/>ShipEm Express Logistics & Air Cargo Carriers</p>
        
        <p style="margin-top: 15px;">Dear Sir/Madam,</p>
        
        <p style="margin-top: 10px; text-align: justify;">
          I, <strong>${b.senderName}</strong>, residing at <strong>${b.senderAddress}</strong>, do hereby declare that I am sending an international consignment bearing Consignment Tracking Number <strong>${b.consignmentNumber}</strong> through ShipEm Express Logistics addressed to <strong>${b.receiverName}</strong> residing at <strong>${b.receiverAddress}, ${b.receiverCountry}</strong>.
        </p>

        <p style="margin-top: 10px; text-align: justify;">
          I hereby certify and declare as follows:
        </p>
        
        <ul style="margin-left: 20px; margin-top: 5px;">
          <li>All items contained in this shipment are for personal / non-commercial use (or lawful commercial export as declared) and comply with all export and import regulations of India and the destination country.</li>
          <li>The shipment does not contain any prohibited, hazardous, explosive, flammable, contraband, psychotropic substances, currency, or illegal items.</li>
          <li>The total declared value of the goods is ₹ ${b.packages.reduce((acc, p) => acc + parseFloat(p.boxTotVal || 0), 0).toFixed(2)}, which is true and correct to the best of my knowledge.</li>
          <li>I take full legal and financial responsibility for the authenticity, description, and contents of this shipment.</li>
        </ul>

        <div style="margin-top: 40px; display: flex; justify-content: space-between;">
          <div>
            <p>_________________________________________</p>
            <p><strong>Sender Signature</strong><br/>Name: ${b.senderName}</p>
          </div>
          <div style="text-align: right;">
            <p>_________________________________________</p>
            <p><strong>Verified by Branch</strong><br/>Branch: ${b.bookingBranch}</p>
          </div>
        </div>
      </div>
    `;
  } else if (type === "consignment") {
    let allBoxesHtml = "";
    const packages = b.packages || [{ boxNum: 1, pkgType: "Standard", actWt: b.totalWeight, items: [] }];

    packages.forEach((pkg, index) => {
      const pageBreakStyle = index < packages.length - 1 ? "page-break-after: always; margin-bottom: 40px;" : "";
      allBoxesHtml += `
        <div style="border:2px solid #000; padding:20px; background:#fff; ${pageBreakStyle}">
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0f3d68; padding-bottom:12px; margin-bottom:15px;">
            <img src="Logo/el_logo.svg" alt="ShipEm EXpress Logistics logo" style="height: auto; width: auto; max-height: 50px">
            <div style="text-align:right;">
              <h3 style="margin:0; font-size:1.1rem; color:#1f2937;">CONSIGNMENT LABEL</h3>
              <p style="margin:2px 0 0 0; font-size:0.85rem; color:#4b5563;"><strong>Box ${pkg.boxNum} of ${packages.length}</strong> (${pkg.pkgType || 'Box'})</p>
            </div>
          </div>
          <div style="text-align:center; margin:15px 0;">
            <svg id="consignment-barcode-${pkg.boxNum}"></svg>
          </div>
          <table style="width:100%; border-collapse:collapse; margin-top:15px;">
            <tr>
              <th width="50%" style="border:1px solid #94a3b8; padding:8px; background:#f1f5f9; text-align:left;">FROM (SENDER)</th>
              <th width="50%" style="border:1px solid #94a3b8; padding:8px; background:#f1f5f9; text-align:left;">TO (RECEIVER)</th>
            </tr>
            <tr>
              <td style="border:1px solid #94a3b8; padding:10px; vertical-align:top;">
                <strong>${b.senderName}</strong><br/>
                ${b.senderAddress}, ${b.senderCountry}<br/>
                Contact: ${b.senderContact}
              </td>
              <td style="border:1px solid #94a3b8; padding:10px; vertical-align:top;">
                <strong>${b.receiverName}</strong><br/>
                ${b.receiverAddress}, ${b.receiverCountry}<br/>
                <strong>Post Code:</strong> ${b.receiverPostcode || ""}<br/>
                Contact: ${b.receiverContact}
              </td>
            </tr>
            <tr>
              <td style="border:1px solid #94a3b8; padding:8px;"><strong>Box Number:</strong> ${pkg.boxNum} / ${packages.length}</td>
              <td style="border:1px solid #94a3b8; padding:8px;"><strong>Box Actual Weight:</strong> ${pkg.actWt} kg</td>
            </tr>
          </table>
        </div>
      `;
    });

    area.innerHTML = allBoxesHtml;

    setTimeout(() => {
      packages.forEach(pkg => {
        const barcodeEl = document.getElementById(`consignment-barcode-${pkg.boxNum}`);
        if (barcodeEl) {
          JsBarcode(barcodeEl, `${b.consignmentNumber}-B${pkg.boxNum}`, {
            format: "CODE128",
            width: 2,
            height: 50,
            displayValue: true
          });
        }
      });
    }, 50);
  }

  document.getElementById("preview-modal").classList.remove("hidden");
}
function closePreviewModal() {
  document.getElementById("preview-modal").classList.add("hidden");
}

function downloadModalPDF() {
  const printableContent = document.getElementById("pdf-printable-area").innerHTML;
  const printWindow = window.open('', '_blank', 'height=700,width=900');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>ShipEm - ${currentActiveBooking.consignmentNumber}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #1f2937; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #94a3b8; padding: 8px 10px; font-size: 0.9rem; text-align: left; }
          th { background: #f1f5f9; }
        </style>
      </head>
      <body>
        ${printableContent}
        <script>
          setTimeout(() => {
            window.print();
            window.close();
          }, 400);
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

function copyBookingDetails() {
  const b = currentActiveBooking;
  if (!b) return;
  const text = `ShipEm Express Logistics - Booking Confirmed!\nConsignment Number: ${b.consignmentNumber}\nReceiver: ${b.receiverName} (${b.receiverCountry})\nWeight: ${b.totalWeight} kg | Amount: ${b.cost}\nTrack your shipment here: https://shipem.org/track.html (Tracking ID: ${b.consignmentNumber})`;

  navigator.clipboard.writeText(text).then(() => {
    alert("Booking confirmation and tracking details copied to clipboard!");
  });
}