document.addEventListener("DOMContentLoaded", () => {
  // find token in local
  const token = localStorage.getItem("lab_token");
  
  // nav elements
  const navManage = document.getElementById("nav-manage");
  const navRegister = document.getElementById("nav-register");
  const navLogin = document.getElementById("nav-login");
  const navUser = document.getElementById("nav-user");
  const navUsername = document.getElementById("nav-username");
  const navLogout = document.getElementById("nav-logout");

  // 
  function parseJwt(token) {
    try {
      return JSON.parse(
        window.atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
    } catch (e) {
      return {};
    }
  }

  // 3. UI toggle
  if (token) {
    // for user
    if (navManage) navManage.hidden = false;
    if (navUser) navUser.hidden = false;
    if (navLogout) navLogout.hidden = false;
    
    if (navRegister) navRegister.hidden = true;
    if (navLogin) navLogin.hidden = true;

    // decoding token to fetch username
    const userData = parseJwt(token);
    if (navUsername) {
      navUsername.textContent = userData.username || "Scientist";
    }
  }

  // logout
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