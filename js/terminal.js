/**
 * Interactive Hacker CLI for Yaswanth Kumar S
 * Quick terminal modal allowing recruiters and engineers to interact with Yaswanth's background via commands.
 */

(function () {
  const terminalOverlay = document.getElementById("terminal-modal");
  const terminalTrigger = document.getElementById("terminal-trigger");
  const terminalClose = document.getElementById("terminal-close");
  const terminalInput = document.getElementById("terminal-cli-input");
  const terminalOutput = document.getElementById("terminal-output");

  if (!terminalOverlay || !terminalInput) return;

  const COMMANDS = {
    help: `Available Commands:
  • <span style="color:#00f0ff;">about</span>      : Background, philosophy, and education
  • <span style="color:#00f0ff;">skills</span>     : Core technical competencies & toolchains
  • <span style="color:#00f0ff;">experience</span> : Internship highlights (Google Edu & Celonis)
  • <span style="color:#00f0ff;">projects</span>   : Flagship AI & software engineering projects
  • <span style="color:#00f0ff;">recoverx</span>   : Deep dive into RecoverX AI Agent
  • <span style="color:#00f0ff;">contact</span>    : Direct channels (Email, Phone, LinkedIn, GitHub)
  • <span style="color:#00f0ff;">clear</span>      : Clear the terminal console
  • <span style="color:#00f0ff;">exit</span>       : Close the terminal modal`,

    about: `Yaswanth Kumar S
==================
Role      : Software Developer | Computer Science & Engineering (Blockchain Technology)
Institution: SRM Institute of Science and Technology, Tiruchirappalli
CGPA      : 8.7 / 10 (2024 - 2028)
Location  : Bengaluru, Karnataka, India
Objective : Seeking Software Development / Engineering internships to build high-scale, autonomous, and intelligent systems.`,

    skills: `Technical Skills Matrix:
========================
• Languages   : Python, SQL, JavaScript, C, C++
• Web & Stack : React.js, Node.js, Express.js, MongoDB (MERN Stack)
• AI/ML & Data: Pandas, NumPy, Machine Learning, Google Gemini API, Prompt Engineering
• Tools       : Git, GitHub, VS Code, Antigravity IDE, MS Excel
• Methodologies: Process Mining, Business Process Analysis, Agile Engineering`,

    experience: `Internships & Industry Experience:
==================================
1. AI/ML Intern — India Edu Program (Supported by Google for Developers)
   • Duration: Jul – Sep 2025 (10 Weeks)
   • ML model building, data exploratory analysis, model evaluation metrics.

2. Business Analyst Intern — Celonis
   • Duration: Jun – Aug 2026 (8 Weeks)
   • Operational data mining, process bottlenecks identification, executive insights.`,

    projects: `Featured Engineering Builds:
===========================
1. RecoverX (Razorpay AI Buildathon Track 03 · 2026)
   • Autonomous AI Agent for failed payment recovery.
   • Detect → Reason → Decide → Act → Verify loop.
   • Powered by Google Gemini API with rule-based fallback.
   • Repo: github.com/yashcodemaker/recoverx-revenue-recovery-agent

2. MERN Fullstack Cloud Architecture
   • Scalable RESTful microservices with Node/Express and MongoDB.

3. Process Mining Analytics Engine
   • Data pipeline extracting execution logs and visualizing bottleneck graphs.`,

    recoverx: `[RecoverX AI AGENT]
Loop    : Detect -> Reason (Gemini 1.5) -> Decide -> Act -> Verify
Fallback: Rule-based deterministic decision tree
Impact  : Identifies recoverable failed payments in <350ms without blind spam retries.
Status  : Deployed & Open Source on GitHub!`,

    contact: `Reach Out Directly:
===================
• Email    : ys612738@gmail.com
• Phone    : +91-7411613241
• LinkedIn : https://linkedin.com/in/yaswanth-kumar-s-9442b7348
• GitHub   : https://github.com/yashcodemaker
• Location : Bengaluru, Karnataka`,

    sudo: `<span style="color:#ef4444;">Access Denied: User yaswanth maintains root administrative privileges!</span>`
  };

  function openTerminal() {
    terminalOverlay.classList.add("open");
    terminalInput.focus();
  }

  function closeTerminal() {
    terminalOverlay.classList.remove("open");
  }

  if (terminalTrigger) {
    terminalTrigger.addEventListener("click", openTerminal);
  }

  if (terminalClose) {
    terminalClose.addEventListener("click", closeTerminal);
  }

  terminalOverlay.addEventListener("click", (e) => {
    if (e.target === terminalOverlay) closeTerminal();
  });

  // Shortcut to toggle terminal (Ctrl + ` or `)
  window.addEventListener("keydown", (e) => {
    if (e.key === "`" && (e.ctrlKey || !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName))) {
      e.preventDefault();
      if (terminalOverlay.classList.contains("open")) {
        closeTerminal();
      } else {
        openTerminal();
      }
    }
    if (e.key === "Escape" && terminalOverlay.classList.contains("open")) {
      closeTerminal();
    }
  });

  terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const rawVal = terminalInput.value.trim();
      const cmd = rawVal.toLowerCase();
      terminalInput.value = "";

      if (!cmd) return;

      // Echo input
      const echoLine = document.createElement("div");
      echoLine.className = "term-line-echo";
      echoLine.innerHTML = `<span style="color:#10b981;">visitor@yaswanth:~$</span> ${rawVal}`;
      terminalOutput.appendChild(echoLine);

      if (cmd === "clear") {
        terminalOutput.innerHTML = "";
        return;
      }

      if (cmd === "exit") {
        closeTerminal();
        return;
      }

      const response = COMMANDS[cmd] || `<span style="color:#f87171;">Command not found: '${rawVal}'. Type <strong style="color:#00f0ff;">help</strong> for available commands.</span>`;
      
      const responseLine = document.createElement("div");
      responseLine.className = "term-response";
      responseLine.style.margin = "0.4rem 0 1rem 0";
      responseLine.innerHTML = `<pre style="font-family: inherit; white-space: pre-wrap;">${response}</pre>`;
      terminalOutput.appendChild(responseLine);

      // Scroll to bottom
      const termBody = document.querySelector(".term-body");
      if (termBody) termBody.scrollTop = termBody.scrollHeight;
    }
  });
})();
