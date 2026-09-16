(function () {
  const CONTACT = "hudson.gouge@projxon.ai";
  const STORAGE_KEY = "charter_waitlist_log_v1";

  function loadLog() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch (_) {
      return [];
    }
  }

  function saveLog(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function appendLog(entry) {
    const entries = loadLog();
    entries.push(entry);
    saveLog(entries);
    return entries;
  }

  function mailtoWaitlist(data) {
    const subject = encodeURIComponent("Charter Waitlist");
    const body = encodeURIComponent(
      [
        "Charter waitlist signup",
        "",
        "Name: " + (data.name || ""),
        "Email: " + (data.email || ""),
        "Company / team: " + (data.team || ""),
        "Use case: " + (data.useCase || ""),
        "Interest: " + (data.interest || "waitlist"),
        "When: " + (data.ts || new Date().toISOString()),
        "Source: charter landing",
      ].join("\n")
    );
    return "mailto:" + CONTACT + "?subject=" + subject + "&body=" + body;
  }

  async function submitFormSubmit(data) {
    // Free FormSubmit relay — emails CONTACT; no paid services.
    const endpoint = "https://formsubmit.co/ajax/" + CONTACT;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: "Charter Waitlist — " + (data.email || "signup"),
        name: data.name || "",
        email: data.email || "",
        team: data.team || "",
        use_case: data.useCase || "",
        interest: data.interest || "waitlist",
        source: "charter-landing",
        timestamp: data.ts,
        _template: "table",
        _captcha: "false",
      }),
    });
    if (!res.ok) throw new Error("formsubmit " + res.status);
    return res.json().catch(function () { return {}; });
  }

  function wireWaitlist() {
    const form = document.getElementById("waitlist-form");
    if (!form) return;
    const msg = document.getElementById("waitlist-msg");
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const fd = new FormData(form);
      const data = {
        name: String(fd.get("name") || "").trim(),
        email: String(fd.get("email") || "").trim(),
        team: String(fd.get("team") || "").trim(),
        useCase: String(fd.get("use_case") || "").trim(),
        interest: String(fd.get("interest") || "waitlist").trim(),
        ts: new Date().toISOString(),
      };
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        msg.className = "msg err";
        msg.textContent = "Please enter a valid email.";
        return;
      }

      appendLog(data);

      let relayOk = false;
      try {
        await submitFormSubmit(data);
        relayOk = true;
      } catch (_) {
        relayOk = false;
      }

      // Always open mailto so the signup is also in your mail client / sent folder.
      window.location.href = mailtoWaitlist(data);

      msg.className = "msg ok";
      msg.textContent = relayOk
        ? "You're on the list. We logged this signup and opened a confirmation email to " + CONTACT + "."
        : "Logged locally and opened mailto to " + CONTACT + ". If your mail client didn't open, email that address with subject “Charter Waitlist”.";
      form.reset();
    });
  }

  function wireExport() {
    const btn = document.getElementById("export-waitlist-log");
    if (!btn) return;
    btn.addEventListener("click", function () {
      const entries = loadLog();
      const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "charter-waitlist-log.json";
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireWaitlist();
    wireExport();
  });
})();
