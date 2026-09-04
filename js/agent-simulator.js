/**
 * RecoverX AI Agent Simulator
 * Visualizes the 5-phase autonomous agent loop:
 * Detect -> Reason (Gemini API) -> Decide -> Act -> Verify
 */

(function () {
  const scenarios = {
    upi_timeout: {
      name: "UPI Gateway Timeout (HDFC Switch)",
      amount: "₹2,499.00",
      errorCode: "E_GATEWAY_TIMEOUT (NPCI Switch Latency)",
      riskScore: "Low (0.08)",
      steps: [
        { phase: "detect", text: "[DETECT] Intercepted failed transaction txn_90218x. Error: E_GATEWAY_TIMEOUT (>12,000ms)." },
        { phase: "reason", text: "[REASON: Gemini 1.5 Flash] Ingesting transaction telemetry... Historical recovery probability: 96.2%. Primary bank switch congested." },
        { phase: "decide", text: "[DECIDE] Selected Strategy: Dynamic Auto-Switch to Secondary NPCI Cloud Route + Idempotent Intent Dispatch." },
        { phase: "act", text: "[ACT] Executing routing shift. Re-dispatching cryptographic payload with zero duplicate debit risk..." },
        { phase: "verify", text: "[VERIFY] Webhook received in 340ms: Transaction CAPTURED! Revenue of ₹2,499.00 successfully recovered!" }
      ],
      metrics: { latency: "340ms", confidence: "96.2%", recovered: "₹2,499.00", engine: "Gemini 1.5 + Fallback Engine" }
    },
    card_decline: {
      name: "Card False-Positive Decline",
      amount: "₹14,500.00",
      errorCode: "DO_NOT_HONOR / 05 (Velocity Rule)",
      riskScore: "Minimal (0.03)",
      steps: [
        { phase: "detect", text: "[DETECT] Card transaction txn_77342p declined with generic code 05. High ticket size detected." },
        { phase: "reason", text: "[REASON: Gemini 1.5 Flash] Customer LTV: ₹84,000. Device fingerprint matches trusted profile. False positive fraud threshold exceeded." },
        { phase: "decide", text: "[DECIDE] Strategy: Dispatch Smart 1-Click Biometric WhatsApp / SMS Tokenized Recovery Link." },
        { phase: "act", text: "[ACT] Instant omni-channel push generated with encrypted single-use 3DS2 biometric authorization." },
        { phase: "verify", text: "[VERIFY] Customer completed biometric auth via WhatsApp. Status: CAPTURED. ₹14,500.00 recovered!" }
      ],
      metrics: { latency: "420ms", confidence: "94.8%", recovered: "₹14,500.00", engine: "Gemini 1.5 + Omni-Channel Dispatch" }
    },
    insufficient_balance: {
      name: "Subscription Renewal Insufficient Funds",
      amount: "₹899.00",
      errorCode: "INSUFFICIENT_FUNDS (Month End Drop)",
      riskScore: "Low (0.12)",
      steps: [
        { phase: "detect", text: "[DETECT] Recurring SaaS subscription debit failed. Balance alert on customer account." },
        { phase: "reason", text: "[REASON: Gemini 1.5 Flash] Time analysis: 31st of month. Customer salary cycle estimated 1st morning. Instant retry would cause user churn." },
        { phase: "decide", text: "[DECIDE] Strategy: Suppress hard retry. Schedule dynamic smart retry window for tomorrow 09:15 AM." },
        { phase: "act", text: "[ACT] Queued in dynamic recovery schedule with exponential backoff & friendly WhatsApp courtesy notice." },
        { phase: "verify", text: "[VERIFY] Smart retry executed at 09:16 AM. Status: SUCCESSFUL. Subscription active, churn prevented!" }
      ],
      metrics: { latency: "180ms", confidence: "91.5%", recovered: "₹899.00 / mo", engine: "Predictive Scheduling Model" }
    },
    dropped_webhook: {
      name: "Merchant Dropped Webhook / State Desync",
      amount: "₹6,200.00",
      errorCode: "WEBHOOK_DELIVERY_FAILED (504 Gateway)",
      riskScore: "Zero Risk",
      steps: [
        { phase: "detect", text: "[DETECT] Discrepancy identified between Razorpay settlement ledger and merchant cart state." },
        { phase: "reason", text: "[REASON: Fallback Rule Engine] Payment was debited from user, but merchant order marked abandoned." },
        { phase: "decide", text: "[DECIDE] Strategy: Autonomous cryptographic reconciliation and signed event resynchronization." },
        { phase: "act", text: "[ACT] Injected verified HMAC-SHA256 event into merchant inventory system." },
        { phase: "verify", text: "[VERIFY] Merchant order confirmed & customer notified via SMS. Total reconciliation time: 110ms!" }
      ],
      metrics: { latency: "110ms", confidence: "100%", recovered: "₹6,200.00", engine: "Autonomous Reconciliation Loop" }
    }
  };

  let currentScenarioKey = "upi_timeout";
  let isRunning = false;

  function initSimulator() {
    const scenarioBtns = document.querySelectorAll(".scenario-btn");
    const triggerBtn = document.getElementById("trigger-sim-btn");
    const terminalView = document.getElementById("console-terminal-view");
    const stepNodes = document.querySelectorAll(".step-node");

    if (!triggerBtn || !terminalView) return;

    scenarioBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (isRunning) return;
        scenarioBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentScenarioKey = btn.getAttribute("data-scenario");
        resetVisualizer();
        printScenarioPreview();
      });
    });

    triggerBtn.addEventListener("click", () => {
      if (isRunning) return;
      runSimulation();
    });

    printScenarioPreview();
  }

  function resetVisualizer() {
    const stepNodes = document.querySelectorAll(".step-node");
    stepNodes.forEach(node => {
      node.classList.remove("active", "done");
    });
    const terminalView = document.getElementById("console-terminal-view");
    terminalView.innerHTML = "";
  }

  function printScenarioPreview() {
    const scenario = scenarios[currentScenarioKey];
    const terminalView = document.getElementById("console-terminal-view");
    terminalView.innerHTML = `
      <div class="terminal-line"><span class="t-prefix">SYS&gt;</span> Target scenario loaded: <strong style="color:#00f0ff;">${scenario.name}</strong></div>
      <div class="terminal-line"><span class="t-prefix">SYS&gt;</span> Failed Amount: <strong>${scenario.amount}</strong> | Error: <span class="t-warn">${scenario.errorCode}</span></div>
      <div class="terminal-line"><span class="t-prefix">SYS&gt;</span> Ready. Click <strong>"Simulate Autonomous Recovery"</strong> to trigger RecoverX loop.</div>
    `;
    
    // Update metric indicators
    const latencyEl = document.getElementById("sim-latency");
    const confEl = document.getElementById("sim-confidence");
    const savedEl = document.getElementById("sim-recovered");
    if (latencyEl) latencyEl.innerText = "--";
    if (confEl) confEl.innerText = "--";
    if (savedEl) savedEl.innerText = "--";
  }

  function runSimulation() {
    const scenario = scenarios[currentScenarioKey];
    const triggerBtn = document.getElementById("trigger-sim-btn");
    const terminalView = document.getElementById("console-terminal-view");
    const stepNodes = document.querySelectorAll(".step-node");

    isRunning = true;
    triggerBtn.disabled = true;
    triggerBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Running Agent Loop...`;
    terminalView.innerHTML = `<div class="terminal-line"><span class="t-prefix">RUN&gt;</span> Initiating autonomous RecoverX agent loop...</div>`;

    const phases = ["detect", "reason", "decide", "act", "verify"];
    let stepIndex = 0;

    function executeNextStep() {
      if (stepIndex >= scenario.steps.length) {
        // Complete
        isRunning = false;
        triggerBtn.disabled = false;
        triggerBtn.innerHTML = `<i class="fa-solid fa-play"></i> Re-simulate`;
        
        // Final summary line
        terminalView.innerHTML += `<div class="terminal-line"><span class="t-success">✔ RECOVERY COMPLETE:</span> Autonomous loop finalized in ${scenario.metrics.latency}.</div>`;
        terminalView.scrollTop = terminalView.scrollHeight;

        // Update stats
        const latencyEl = document.getElementById("sim-latency");
        const confEl = document.getElementById("sim-confidence");
        const savedEl = document.getElementById("sim-recovered");
        if (latencyEl) latencyEl.innerText = scenario.metrics.latency;
        if (confEl) confEl.innerText = scenario.metrics.confidence;
        if (savedEl) savedEl.innerText = scenario.metrics.recovered;
        return;
      }

      const stepData = scenario.steps[stepIndex];
      const phaseName = phases[stepIndex];

      // Update step nodes visually
      stepNodes.forEach((node, idx) => {
        if (idx < stepIndex) {
          node.classList.remove("active");
          node.classList.add("done");
        } else if (idx === stepIndex) {
          node.classList.add("active");
        } else {
          node.classList.remove("active", "done");
        }
      });

      // Append terminal output
      let lineClass = "t-prefix";
      if (phaseName === "reason") lineClass = "t-gemini";
      if (phaseName === "verify") lineClass = "t-success";

      const newLine = document.createElement("div");
      newLine.className = "terminal-line";
      newLine.innerHTML = `<span class="${lineClass}">[${phaseName.toUpperCase()}]</span> ${stepData.text}`;
      terminalView.appendChild(newLine);
      terminalView.scrollTop = terminalView.scrollHeight;

      stepIndex++;
      setTimeout(executeNextStep, 800);
    }

    setTimeout(executeNextStep, 400);
  }

  document.addEventListener("DOMContentLoaded", initSimulator);
})();
