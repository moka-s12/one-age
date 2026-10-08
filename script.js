/* ========================================
   ONE AGENCY
   Application Form
======================================== */

// GAS送信先
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbyvfT2-Xl34nwlsBqrxOAHSI-tv1QaQUzwFs73IMEnuRsxwWks9zk51XLdh6kXQ-vlh/exec";

// 面談予約URL
// あとでここだけ差し替えればOK
const INTERVIEW_URL = "https://moka-s12.github.io/one-interview/";

/* ========================================
   ELEMENTS
======================================== */

const form = document.getElementById("applicationForm");

const steps = {
  1: document.getElementById("step1"),
  2: document.getElementById("step2"),
  3: document.getElementById("step3"),
  4: document.getElementById("step4")
};

const ageRejected = document.getElementById("ageRejected");
const completeScreen = document.getElementById("completeScreen");
const sendErrorScreen = document.getElementById("sendErrorScreen");

const progressWrap = document.getElementById("progressWrap");

const ageNextButton = document.getElementById("ageNextButton");
const step2Next = document.getElementById("step2Next");
const step3Next = document.getElementById("step3Next");

const submitButton = document.getElementById("submitButton");
const retryButton = document.getElementById("retryButton");

const confirmationContent =
  document.getElementById("confirmationContent");

const agreement = document.getElementById("agreement");

const otherActivityCheck =
  document.getElementById("otherActivityCheck");

const otherActivityField =
  document.getElementById("otherActivityField");

const interviewButton =
  document.getElementById("interviewButton");

let currentStep = 1;
let isSubmitting = false;


/* ========================================
   START
======================================== */

document.addEventListener("DOMContentLoaded", () => {

  showStep(1);

  // 面談予約URL
  if (INTERVIEW_URL) {
    interviewButton.href = INTERVIEW_URL;
    interviewButton.target = "_blank";
    interviewButton.rel = "noopener noreferrer";
  } else {
    interviewButton.href = "#";
  }

});


/* ========================================
   STEP DISPLAY
======================================== */

function hideAllScreens() {

  document
    .querySelectorAll(".step")
    .forEach((step) => {
      step.classList.remove("active");
    });

}


function showStep(stepNumber) {

  hideAllScreens();

  currentStep = stepNumber;

  steps[stepNumber].classList.add("active");

  progressWrap.classList.remove("hidden");

  updateProgress(stepNumber);

  scrollToTop();

}


function showSpecialScreen(screen) {

  hideAllScreens();

  screen.classList.add("active");

  progressWrap.classList.add("hidden");

  scrollToTop();

}


function scrollToTop() {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* ========================================
   PROGRESS
======================================== */

function updateProgress(stepNumber) {

  const items =
    document.querySelectorAll(".progress-item");

  items.forEach((item) => {

    const number =
      Number(item.dataset.progress);

    item.classList.remove(
      "active",
      "completed"
    );

    if (number === stepNumber) {
      item.classList.add("active");
    }

    if (number < stepNumber) {
      item.classList.add("completed");
    }

  });

}

/* ========================================
   STEP 01
   AGE
======================================== */

ageNextButton.addEventListener("click", () => {

  clearError("birthDateError");
  clearError("ageError");

  const birthDateInput =
    document.getElementById("birthDate");

  const ageConfirmationInput =
    document.getElementById("ageConfirmation");

  const birthDate = birthDateInput.value;

  const answer =
    ageConfirmationInput.value.trim();


  // 生年月日が未入力
  if (!birthDate) {

    setError(
      "birthDateError",
      "生年月日を入力してください。"
    );

    birthDateInput.focus();

    return;
  }


  // 未来の日付を防止
  const birth = new Date(
    birthDate + "T00:00:00"
  );

  const today = new Date();

  if (birth > today) {

    setError(
      "birthDateError",
      "正しい生年月日を入力してください。"
    );

    birthDateInput.focus();

    return;
  }


  // 満年齢を計算
  let age =
    today.getFullYear() -
    birth.getFullYear();

  const birthdayThisYear =
    new Date(
      today.getFullYear(),
      birth.getMonth(),
      birth.getDate()
    );

  if (today < birthdayThisYear) {
    age--;
  }


  // 18歳未満
  if (age < 18) {

    showSpecialScreen(ageRejected);

    return;
  }


  // 「はい」が未入力
  if (!answer) {

    setError(
      "ageError",
      "18歳以上の場合は「はい」と入力してください。"
    );

    ageConfirmationInput.focus();

    return;
  }


  // 「はい」以外
  if (answer !== "はい") {

    setError(
      "ageError",
      "確認のため「はい」と入力してください。"
    );

    ageConfirmationInput.focus();

    return;
  }


  // 18歳以上 ＋ 本人確認OK
  showStep(2);

});


/* ========================================
   STEP 02
======================================== */

step2Next.addEventListener("click", () => {

  if (!validateStep2()) {
    return;
  }

  showStep(3);

});


function validateStep2() {

  let valid = true;

  const activityName =
    document.getElementById("activityName");

  const tiktokName =
    document.getElementById("tiktokName");

  const tiktokId =
    document.getElementById("tiktokId");


  // エラー初期化
  clearFieldError(activityName);
  clearFieldError(tiktokName);
  clearFieldError(tiktokId);

  clearError("experienceError");
  clearError("agencyError");


  // 活動名
  if (!activityName.value.trim()) {

    setFieldError(
      activityName,
      "活動名を入力してください。"
    );

    valid = false;
  }


  // TikTok名
  if (!tiktokName.value.trim()) {

    setFieldError(
      tiktokName,
      "TikTokアカウント名を入力してください。"
    );

    valid = false;
  }


  // TikTok ID
  if (!tiktokId.value.trim()) {

    setFieldError(
      tiktokId,
      "TikTok IDを入力してください。"
    );

    valid = false;

  } else {

    // @がなければ自動で付ける
    let id = tiktokId.value.trim();

    if (!id.startsWith("@")) {
      id = "@" + id;
    }

    tiktokId.value = id;
  }


  // 配信経験
  const experience =
    document.querySelector(
      'input[name="experience"]:checked'
    );

  if (!experience) {

    setError(
      "experienceError",
      "配信経験を選択してください。"
    );

    valid = false;
  }


  // 他事務所
  const agency =
    document.querySelector(
      'input[name="agency"]:checked'
    );

  if (!agency) {

    setError(
      "agencyError",
      "現在の所属状況を選択してください。"
    );

    valid = false;
  }


  return valid;

}


/* ========================================
   STEP 03
======================================== */

otherActivityCheck.addEventListener(
  "change",
  () => {

    if (otherActivityCheck.checked) {

      otherActivityField.classList.remove(
        "hidden"
      );

    } else {

      otherActivityField.classList.add(
        "hidden"
      );

      document.getElementById(
        "otherActivity"
      ).value = "";

    }

  }
);


step3Next.addEventListener("click", () => {

  if (!validateStep3()) {
    return;
  }

  buildConfirmation();

  agreement.checked = false;
  clearError("agreementError");

  showStep(4);

});


function validateStep3() {

  clearError("activitiesError");

  const activities =
    document.querySelectorAll(
      'input[name="activities"]:checked'
    );

  if (activities.length === 0) {

    setError(
      "activitiesError",
      "興味のある活動を1つ以上選択してください。"
    );

    return false;
  }


  // 「その他」を選択している場合
  const otherActivity =
    document.getElementById("otherActivity");

  if (
    otherActivityCheck.checked &&
    !otherActivity.value.trim()
  ) {

    alert(
      "「その他」の活動内容を入力してください。"
    );

    otherActivity.focus();

    return false;
  }


  return true;

}


/* ========================================
   BACK BUTTON
======================================== */

document
  .querySelectorAll("[data-back]")
  .forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        const destination =
          Number(button.dataset.back);

        showStep(destination);

      }
    );

  });


/* ========================================
   CONFIRMATION
======================================== */

function buildConfirmation() {

  const data = collectFormData();

  const activities =
    data.activities.join("、");

   const rows = [
  ["生年月日", data.birthDate],
  ["年齢確認", data.ageConfirmation],
    ["活動名", data.activityName],
    [
      "TikTokアカウント名",
      data.tiktokName
    ],
    ["TikTok ID", data.tiktokId],
    [
      "配信経験",
      data.streamingExperience
    ],
    [
      "他事務所・エージェンシー",
      data.agencyStatus
    ],
    ["興味のある活動", activities],
    [
      "相談・伝えておきたいこと",
      data.notes || "なし"
    ]
  ];


  confirmationContent.innerHTML = "";


  rows.forEach(([label, value]) => {

    const row =
      document.createElement("div");

    row.className = "confirm-row";


    const labelElement =
      document.createElement("span");

    labelElement.className =
      "confirm-label";

    labelElement.textContent = label;


    const valueElement =
      document.createElement("div");

    valueElement.className =
      "confirm-value";

    valueElement.textContent = value;


    row.appendChild(labelElement);
    row.appendChild(valueElement);

    confirmationContent.appendChild(row);

  });

}


/* ========================================
   COLLECT DATA
======================================== */

function collectFormData() {

  const selectedActivities =
    Array.from(
      document.querySelectorAll(
        'input[name="activities"]:checked'
      )
    ).map((item) => item.value);


  // その他の内容を実際の回答へ変更
  if (otherActivityCheck.checked) {

    const otherText =
      document
        .getElementById("otherActivity")
        .value
        .trim();

    const index =
      selectedActivities.indexOf("その他");

    if (index !== -1) {

      selectedActivities[index] =
        `その他：${otherText}`;

    }

  }


  const experience =
    document.querySelector(
      'input[name="experience"]:checked'
    );

  const agency =
    document.querySelector(
      'input[name="agency"]:checked'
    );


  return {

  birthDate:
    document
      .getElementById("birthDate")
      .value,

  ageConfirmation:
    document
      .getElementById("ageConfirmation")
      .value
      .trim(),

  activityName:
    document
      .getElementById("activityName")
      .value
      .trim(),

  tiktokName:
    document
      .getElementById("tiktokName")
      .value
      .trim(),

  tiktokId:
    document
      .getElementById("tiktokId")
      .value
      .trim(),

  streamingExperience:
    experience
      ? experience.value
      : "",

  agencyStatus:
    agency
      ? agency.value
      : "",

  activities:
    selectedActivities,

  notes:
    document
      .getElementById("notes")
      .value
      .trim()

};
}


/* ========================================
   SUBMIT
======================================== */

form.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    if (isSubmitting) {
      return;
    }


    clearError("agreementError");


    if (!agreement.checked) {

      setError(
        "agreementError",
        "入力内容をご確認のうえ、チェックしてください。"
      );

      return;
    }


    // 念のため全STEP再チェック
    if (
      !validateStep2() ||
      !validateStep3()
    ) {

      alert(
        "入力内容に不足があります。内容をご確認ください。"
      );

      return;
    }



    const data =
      collectFormData();


    try {

      setSubmitting(true);


      /*
       * text/plain にすることで、
       * GASへのPOST時にブラウザの
       * CORS preflightを避けやすくしています。
       */
      const response =
        await fetch(
          GAS_URL,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "text/plain;charset=utf-8"
            },

            body:
              JSON.stringify(data)
          }
        );


      if (!response.ok) {

        throw new Error(
          "HTTP error: " +
          response.status
        );

      }


      const result =
        await response.json();


      if (!result.success) {

        throw new Error(
          result.message ||
          "送信に失敗しました。"
        );

      }


      // 成功
      showSpecialScreen(
        completeScreen
      );


    } catch (error) {

      console.error(
        "Submission error:",
        error
      );

      showSpecialScreen(
        sendErrorScreen
      );


    } finally {

      setSubmitting(false);

    }

  }
);


/* ========================================
   SUBMIT BUTTON
======================================== */

function setSubmitting(state) {

  isSubmitting = state;

  submitButton.disabled = state;


  const submitText =
    submitButton.querySelector(
      ".submit-text"
    );

  const loadingText =
    submitButton.querySelector(
      ".loading-text"
    );


  if (state) {

    submitText.classList.add(
      "hidden"
    );

    loadingText.classList.remove(
      "hidden"
    );

  } else {

    submitText.classList.remove(
      "hidden"
    );

    loadingText.classList.add(
      "hidden"
    );

  }

}


/* ========================================
   RETRY
======================================== */

retryButton.addEventListener(
  "click",
  () => {

    showStep(4);

  }
);


/* ========================================
   INTERVIEW BUTTON
======================================== */

interviewButton.addEventListener(
  "click",
  (event) => {

    if (!INTERVIEW_URL) {

      event.preventDefault();

      alert(
        "面談予約URLは現在準備中です。ONE公式LINEよりご案内いたします。"
      );

    }

  }
);


/* ========================================
   ERROR HELPERS
======================================== */

function setError(id, message) {

  const element =
    document.getElementById(id);

  if (element) {
    element.textContent = message;
  }

}


function clearError(id) {

  const element =
    document.getElementById(id);

  if (element) {
    element.textContent = "";
  }

}


function setFieldError(
  input,
  message
) {

  const field =
    input.closest(".field");

  if (!field) {
    return;
  }

  field.classList.add(
    "has-error"
  );


  const error =
    field.querySelector(
      ".error-message"
    );

  if (error) {
    error.textContent = message;
  }

}


function clearFieldError(input) {

  const field =
    input.closest(".field");

  if (!field) {
    return;
  }

  field.classList.remove(
    "has-error"
  );


  const error =
    field.querySelector(
      ".error-message"
    );

  if (error) {
    error.textContent = "";
  }

}