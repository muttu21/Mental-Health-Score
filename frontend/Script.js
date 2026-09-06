(() => {
  "use strict";

  /* =========================================================
     01. API CONFIGURATION
     ========================================================= */

  // Because FastAPI is serving the frontend and API from
  // the same website, we can use the current origin.
  const API_BASE = window.location.origin;

  const PREDICT_URL = `${API_BASE}/predict`;


  /* =========================================================
     02. GET HTML ELEMENTS
     ========================================================= */

  const form = document.getElementById("predict-form");

  const submitBtn = document.getElementById("submit-btn");
  const resetBtn = document.getElementById("reset-btn");
  const errorRetryBtn = document.getElementById("error-retry-btn");

  const stateIdle = document.getElementById("state-idle");
  const stateLoading = document.getElementById("state-loading");
  const stateResult = document.getElementById("state-result");
  const stateError = document.getElementById("state-error");

  const scoreNumber = document.getElementById("score-number");
  const scoreBand = document.getElementById("score-band");
  const scoreContext = document.getElementById("score-context");

  const errorLabel = document.getElementById("error-label");
  const errorCopy = document.getElementById("error-copy");

  const stressButtons = document.querySelectorAll(".seg-btn");


  /* =========================================================
     03. FORM INPUTS
     ========================================================= */

  const ageInput =
    document.getElementById("age") ||
    document.querySelector('[name="age"]');

  const genderInput =
    document.getElementById("gender") ||
    document.querySelector('[name="gender"]');

  const countryInput =
    document.getElementById("country") ||
    document.querySelector('[name="country"]');

  const academicLevelInput =
    document.getElementById("academic-level") ||
    document.getElementById("academic_level") ||
    document.querySelector('[name="academic_level"]');

  const platformInput =
    document.getElementById("most-used-platform") ||
    document.getElementById("most_used_platform") ||
    document.querySelector('[name="most_used_platform"]');

  const purposeInput =
    document.getElementById("purpose") ||
    document.getElementById("purpose-of-use") ||
    document.getElementById("purpose_of_use") ||
    document.querySelector('[name="purpose_of_use"]');

  const screenTimeInput =
    document.getElementById("screen-time") ||
    document.getElementById("avg-daily-usage-hours") ||
    document.getElementById("avg_daily_usage_hours") ||
    document.querySelector('[name="avg_daily_usage_hours"]');

  const unlocksInput =
    document.getElementById("daily-unlocks") ||
    document.querySelector('[name="daily_unlocks"]');

  const studyHoursInput =
    document.getElementById("study-hours") ||
    document.querySelector('[name="study_hours"]');

  const activityHoursInput =
    document.getElementById("physical-activity-hours") ||
    document.getElementById("physical_activity_hours") ||
    document.querySelector('[name="physical_activity_hours"]');

  const sleepHoursInput =
    document.getElementById("sleep-hours") ||
    document.querySelector('[name="sleep_hours_per_night"]') ||
    document.querySelector('[name="sleep_hours"]');


  /* =========================================================
     04. CURRENT STRESS LEVEL
     ========================================================= */

  let selectedStress = "";

  stressButtons.forEach((button) => {

    button.addEventListener("click", () => {

      stressButtons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      selectedStress =
        button.dataset.stress ||
        button.dataset.value ||
        button.value ||
        button.textContent.trim();

    });

  });


  /* =========================================================
     05. STATE MANAGEMENT
     ========================================================= */

  function hideAllStates() {

    if (stateIdle) stateIdle.hidden = true;
    if (stateLoading) stateLoading.hidden = true;
    if (stateResult) stateResult.hidden = true;
    if (stateError) stateError.hidden = true;

  }


  function showState(state) {

    hideAllStates();

    if (state) {
      state.hidden = false;
    }

  }


  /* =========================================================
     06. LOADING STATE
     ========================================================= */

  function showLoading() {

    showState(stateLoading);

    if (submitBtn) {
      submitBtn.classList.add("loading");
      submitBtn.disabled = true;
    }

  }


  function stopLoading() {

    if (submitBtn) {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }

  }


  /* =========================================================
     07. ERROR STATE
     ========================================================= */

  function showError(message) {

    stopLoading();

    showState(stateError);

    if (errorLabel) {
      errorLabel.textContent = "Something went wrong";
    }

    if (errorCopy) {
      errorCopy.textContent =
        message ||
        "We couldn't generate the prediction. Please check your inputs and try again.";
    }

  }


  /* =========================================================
     08. GET FORM DATA
     ========================================================= */

  function getFormData() {

    return {

      age: Number(ageInput?.value),

      gender: genderInput?.value,

      country: countryInput?.value.trim(),

      academic_level: academicLevelInput?.value,

      most_used_platform: platformInput?.value,

      purpose_of_use: purposeInput?.value,

      avg_daily_usage_hours:
        Number(screenTimeInput?.value),

      daily_unlocks:
        Number(unlocksInput?.value),

      study_hours:
        Number(studyHoursInput?.value),

      physical_activity_hours:
        Number(activityHoursInput?.value),

      sleep_hours_per_night:
        Number(sleepHoursInput?.value),

      stress_level:
        selectedStress

    };

  }


  /* =========================================================
     09. BASIC VALIDATION
     ========================================================= */

  function validateData(data) {

    if (!data.age || data.age < 10 || data.age > 100) {
      return "Please enter a valid age between 10 and 100.";
    }

    if (!data.gender) {
      return "Please select your gender.";
    }

    if (!data.country) {
      return "Please enter your country.";
    }

    if (!data.academic_level) {
      return "Please select your academic level.";
    }

    if (!data.most_used_platform) {
      return "Please select your most-used platform.";
    }

    if (!data.purpose_of_use) {
      return "Please select your primary purpose.";
    }

    if (
      Number.isNaN(data.avg_daily_usage_hours) ||
      data.avg_daily_usage_hours < 0 ||
      data.avg_daily_usage_hours > 24
    ) {
      return "Please enter valid daily screen time.";
    }

    if (
      Number.isNaN(data.daily_unlocks) ||
      data.daily_unlocks < 0
    ) {
      return "Please enter valid daily phone unlocks.";
    }

    if (
      Number.isNaN(data.study_hours) ||
      data.study_hours < 0 ||
      data.study_hours > 24
    ) {
      return "Please enter valid study hours.";
    }

    if (
      Number.isNaN(data.physical_activity_hours) ||
      data.physical_activity_hours < 0 ||
      data.physical_activity_hours > 24
    ) {
      return "Please enter valid physical activity hours.";
    }

    if (
      Number.isNaN(data.sleep_hours_per_night) ||
      data.sleep_hours_per_night < 0 ||
      data.sleep_hours_per_night > 24
    ) {
      return "Please enter valid sleep hours.";
    }

    if (!data.stress_level) {
      return "Please select your perceived stress level.";
    }

    return null;

  }


  /* =========================================================
     10. SCORE DESCRIPTION
     ========================================================= */

  function getScoreInfo(score) {

    if (score >= 8) {

      return {
        band: "Strong signal",
        context:
          "Your current habits are associated with a relatively strong mental-health signal."
      };

    }

    if (score >= 6.5) {

      return {
        band: "Positive signal",
        context:
          "Your current daily rhythm is associated with a generally positive signal."
      };

    }

    if (score >= 5) {

      return {
        band: "Mixed signal",
        context:
          "Your habits show a mixed pattern. Small changes may influence the overall signal."
      };

    }

    return {
      band: "Needs attention",
      context:
        "Your current habits suggest areas worth paying attention to in your daily routine."
    };

  }


  /* =========================================================
     11. ANIMATE SCORE
     ========================================================= */

  function animateScore(targetScore) {

    if (!scoreNumber) {
      return;
    }

    const duration = 1200;

    const startTime = performance.now();

    function update(currentTime) {

      const elapsed = currentTime - startTime;

      const progress =
        Math.min(elapsed / duration, 1);

      // Smooth ease-out animation
      const eased =
        1 - Math.pow(1 - progress, 3);

      const current =
        targetScore * eased;

      scoreNumber.textContent =
        current.toFixed(1);

      if (progress < 1) {
        requestAnimationFrame(update);
      }

    }

    requestAnimationFrame(update);

  }


  /* =========================================================
     12. ANIMATE GAUGE
     ========================================================= */

  function animateGauge(score) {

    const gaugeFill =
      document.querySelector(".gauge-fill");

    if (!gaugeFill) {
      return;
    }

    const maxDash = 314;

    const percentage =
      Math.max(0, Math.min(score / 10, 1));

    const dashOffset =
      maxDash - maxDash * percentage;

    gaugeFill.style.strokeDasharray =
      maxDash;

    gaugeFill.style.strokeDashoffset =
      maxDash;

    // Force browser to register initial state
    requestAnimationFrame(() => {

      gaugeFill.style.strokeDashoffset =
        dashOffset;

    });

  }


  /* =========================================================
     13. SHOW RESULT
     ========================================================= */

  function showResult(score) {

    stopLoading();

    showState(stateResult);

    const info =
      getScoreInfo(score);

    if (scoreBand) {
      scoreBand.textContent = info.band;
    }

    if (scoreContext) {
      scoreContext.textContent = info.context;
    }

    if (stateResult) {

      stateResult.classList.remove("visible");

      requestAnimationFrame(() => {
        stateResult.classList.add("visible");
      });

    }

    animateScore(score);

    setTimeout(() => {
      animateGauge(score);
    }, 100);

  }


  /* =========================================================
     14. CALL FASTAPI
     ========================================================= */

  async function predict(data) {

    const response =
      await fetch(PREDICT_URL, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

      });

    if (!response.ok) {

      let errorMessage =
        `Server returned ${response.status}.`;

      try {

        const errorData =
          await response.json();

        if (errorData.detail) {

          if (Array.isArray(errorData.detail)) {

            errorMessage =
              errorData.detail
                .map(item => item.msg)
                .join(" ");

          } else {

            errorMessage =
              String(errorData.detail);

          }

        }

      } catch (error) {
        // Ignore JSON parsing error
      }

      throw new Error(errorMessage);

    }

    return await response.json();

  }


  /* =========================================================
     15. FORM SUBMIT
     ========================================================= */

  if (form) {

    form.addEventListener("submit", async (event) => {

      event.preventDefault();

      const data =
        getFormData();

      const validationError =
        validateData(data);

      if (validationError) {

        showError(validationError);

        return;

      }

      showLoading();

      try {

        const result =
          await predict(data);

        const score =
          Number(
            result.predicted_mental_health_score
          );

        if (
          Number.isNaN(score) ||
          !Number.isFinite(score)
        ) {

          throw new Error(
            "The API returned an invalid prediction."
          );

        }

        showResult(score);

      } catch (error) {

        console.error(
          "Prediction error:",
          error
        );

        showError(
          error.message ||
          "Unable to connect to the prediction API."
        );

      }

    });

  }


  /* =========================================================
     16. RESET FORM
     ========================================================= */

  function resetApplication() {

    if (form) {
      form.reset();
    }

    selectedStress = "";

    stressButtons.forEach((button) => {
      button.classList.remove("active");
    });

    if (scoreNumber) {
      scoreNumber.textContent = "0.0";
    }

    if (scoreBand) {
      scoreBand.textContent = "";
    }

    if (scoreContext) {
      scoreContext.textContent = "";
    }

    const gaugeFill =
      document.querySelector(".gauge-fill");

    if (gaugeFill) {

      gaugeFill.style.strokeDashoffset =
        "314";

    }

    if (stateResult) {
      stateResult.classList.remove("visible");
    }

    stopLoading();

    showState(stateIdle);

  }


  if (resetBtn) {

    resetBtn.addEventListener(
      "click",
      resetApplication
    );

  }


  if (errorRetryBtn) {

    errorRetryBtn.addEventListener(
      "click",
      () => {

        showState(stateIdle);

      }
    );

  }


  /* =========================================================
     17. KEYBOARD SUPPORT
     ========================================================= */

  document.addEventListener("keydown", (event) => {

    if (
      event.key === "Escape" &&
      stateResult &&
      !stateResult.hidden
    ) {

      resetApplication();

    }

  });


  /* =========================================================
     18. INITIAL STATE
     ========================================================= */

  showState(stateIdle);


  /* =========================================================
     19. DEBUG INFORMATION
     ========================================================= */

  console.log(
    "Mental Health Signal loaded."
  );

  console.log(
    "Prediction API:",
    PREDICT_URL
  );

})();