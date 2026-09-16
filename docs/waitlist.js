(function () {
  const CONTACT = "hudson.gouge@projxon.ai";
  const STORAGE_KEY = "charter_waitlist_ndjson_v1";

  function loadLog() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || "";
      if (!raw.trim()) return [];
      return raw
        .split("\n")
        .filter(Boolean)
        .map(function (line) {
          try {
            return JSON.parse(line);
          } catch (_) {
            return null;
          }
        })
        .filter(Boolean);
    } catch (_) {
      return [];
    }
  }

  function appendLog(entry) {
    const line = JSON.stringify(entry);
    const prev = localStorage.getItem(STORAGE_KEY) || "";
    const next = prev ? prev.replace(/\n?$/, "\n") + line + "\n" : line + "\n";
    localStorage.setItem(STORAGE_KEY, next);
    return loadLog();
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
        "Interest: " + (data.interest || "free-tier"),
        "When: " + (data.ts || new Date().toISOString()),
        "Source: charter landing",
      ].join("\n")
    );
    return "mailto:" + CONTACT + "?subject=" + subject + "&body=" + body;
  }

  async function submitFormSubmit(data) {
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
        interest: data.interest || "free-tier",
        source: "charter-landing",
        timestamp: data.ts,
        _template: "table",
        _captcha: "false",
      }),
    });
    if (!res.ok) throw new Error("formsubmit " + res.status);
    return res.json().catch(function () {
      return {};
    });
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
        interest: String(fd.get("interest") || "free-tier").trim(),
        ts: new Date().toISOString(),
        source: "charter-landing",
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

      window.location.href = mailtoWaitlist(data);

      msg.className = "msg ok";
      msg.textContent = relayOk
        ? "You're on the list. Logged as NDJSON and opened mailto to " + CONTACT + "."
        : "Logged as NDJSON and opened mailto to " +
          CONTACT +
          '. If mail did not open, email that address with subject “Charter Waitlist”.';
      form.reset();
    });
  }

  function wireExport() {
    const btn = document.getElementById("export-waitlist-log");
    if (!btn) return;
    btn.addEventListener("click", function () {
      const raw = localStorage.getItem(STORAGE_KEY) || "";
      const blob = new Blob([raw || ""], { type: "application/x-ndjson" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "charter-waitlist.ndjson";
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireWaitlist();
    wireExport();
  });
})();
