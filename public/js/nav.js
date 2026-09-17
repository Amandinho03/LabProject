document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("lab_token");

  const navManage = document.getElementById("nav-manage");
  const navRegister = document.getElementById("nav-register");
  const navLogin = document.getElementById("nav-login");
  const navUser = document.getElementById("nav-user");
  const navUsername = document.getElementById("nav-username");
  const navLogout = document.getElementById("nav-logout");
  const heroCta = document.getElementById("hero-cta");

  function parseJwt(token) {
    try {
      return JSON.parse(
        window.atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
    } catch (e) {
      return {};
    }
  }

  if (token) {
    if (navManage) navManage.hidden = false;
    if (navUser) navUser.hidden = false;
    if (navLogout) navLogout.hidden = false;

    if (navRegister) navRegister.hidden = true;
    if (navLogin) navLogin.hidden = true;

    const userData = parseJwt(token);
    if (navUsername) {
      navUsername.textContent = userData.username || "Scientist";
    }

    if (heroCta) {
      heroCta.textContent = "Go to your dashboard";
      heroCta.href = "/manage";
    }
  }

  if (navLogout) {
    navLogout.addEventListener("click", async () => {
      try {
        await fetch("/logout", { method: "POST" });
      } catch (error) {
        console.error("Logout request failed", error);
      }

      localStorage.removeItem("lab_token");
      window.location.reload();
    });
  }
});
