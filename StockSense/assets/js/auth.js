const API = "http://localhost:5000/api";
async function apiRequest(path, options = {}) {
  const session = StockSenseAuth.get();
  const response = await fetch(`${API}${path}`, { ...options, headers: { "Content-Type": "application/json", ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}), ...(options.headers || {}) } });
  const body = await response.json();
  if (!response.ok || body.success === false) throw new Error(body.message || "Request failed");
  return body;
}
window.StockSenseApi = apiRequest;
const StockSenseAuth = (function () {
  const KEY = "stocksense_session";
  function save(session) { try { localStorage.setItem(KEY, JSON.stringify(session)); } catch (_) {} }
  function get() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (_) { return null; } }
  function clear() { try { localStorage.removeItem(KEY); } catch (_) {} }
  function requireAuth() { const session=get(); if(!session){window.location.href="login.html";return null;}return session; }
  function dashboardUrlForRole(role) { return role === "staff" ? "dashboard-staff.html" : "dashboard-manager.html"; }
  return {save,get,clear,requireAuth,dashboardUrlForRole};
})();
document.addEventListener("DOMContentLoaded", () => {
  const authPane=document.getElementById("authPane"); if(!authPane)return;
  const panes=["loginPane","registerPane","forgotPane","otpPane","newPassPane"];
  function showPane(id){panes.forEach(p=>document.getElementById(p).classList.toggle("active",p===id));document.querySelector(".tabs").style.display=(id==="loginPane"||id==="registerPane")?"flex":"none";document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active",t.dataset.tab===(id==="loginPane"?"login":"register")));}
  document.querySelectorAll("[data-tab]").forEach(el=>el.addEventListener("click",()=>{const map={login:"loginPane",register:"registerPane",forgot:"forgotPane"};showPane(map[el.dataset.tab]);}));
  document.querySelectorAll(".role-opt").forEach(opt=>opt.addEventListener("click",()=>{document.querySelectorAll(`.role-opt[data-group="${opt.dataset.group}"]`).forEach(o=>o.classList.remove("selected"));opt.classList.add("selected");}));
  const role=group=>document.querySelector(`.role-opt.selected[data-group="${group}"]`)?.dataset.role||"manager";
  const emailRe=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;let resetEmail="",resetCode="";
  function valid(id,ok){document.getElementById(id).classList.toggle("invalid",!ok);return ok;}
  async function run(btn,fn){btn.classList.add("loading");btn.disabled=true;try{await fn();}catch(e){alert(e.message);}finally{btn.classList.remove("loading");btn.disabled=false;}}
  document.getElementById("loginBtn").addEventListener("click",()=>{const email=loginEmail.value.trim(),password=loginPass.value;if(!valid("loginEmailField",emailRe.test(email))||!valid("loginPassField",!!password))return;run(loginBtn,async()=>{const data=await apiRequest("/auth/login",{method:"POST",body:JSON.stringify({email,password})});StockSenseAuth.save({token:data.token,user:data.user});location.href=StockSenseAuth.dashboardUrlForRole(data.user.role);});});
  document.getElementById("registerBtn").addEventListener("click",()=>{const name=regName.value.trim(),email=regEmail.value.trim(),password=regPass.value,password2=regPass2.value;if(!valid("regNameField",!!name)||!valid("regEmailField",emailRe.test(email))||!valid("regPassField",password.length>=8)||!valid("regPass2Field",password===password2&&!!password2))return;run(registerBtn,async()=>{const data=await apiRequest("/auth/register",{method:"POST",body:JSON.stringify({name,email,password,role:role("register")})});StockSenseAuth.save({token:data.token,user:data.user});location.href=StockSenseAuth.dashboardUrlForRole(data.user.role);});});
  document.getElementById("sendOtpBtn").addEventListener("click",()=>{resetEmail=forgotEmail.value.trim();if(!valid("forgotEmailField",emailRe.test(resetEmail)))return;run(sendOtpBtn,async()=>{const data=await apiRequest("/auth/forgot-password",{method:"POST",body:JSON.stringify({email:resetEmail})});otpSentTo.textContent=`Demo code generated for ${resetEmail}. No email or SMS was sent. ${data.demoOtp?`Code: ${data.demoOtp}`:""}`;showPane("otpPane");});});
  const otpInputs=[...document.querySelectorAll("#otpPane .otp-boxes input")];otpInputs.forEach((inp,i)=>inp.addEventListener("input",()=>{inp.value=inp.value.replace(/[^0-9]/g,"");if(inp.value)otpInputs[i+1]?.focus();}));
  document.getElementById("verifyOtpBtn").addEventListener("click",()=>run(verifyOtpBtn,async()=>{resetCode=otpInputs.map(x=>x.value).join("");await apiRequest("/auth/verify-otp",{method:"POST",body:JSON.stringify({email:resetEmail,code:resetCode})});showPane("newPassPane");}));
  document.getElementById("resendOtp").addEventListener("click",()=>{otpInputs.forEach(x=>x.value="");sendOtpBtn.click();});
  document.getElementById("resetPassBtn").addEventListener("click",()=>{const password=newPass.value,password2=newPass2.value;if(!valid("newPassField",password.length>=8)||!valid("newPass2Field",password===password2&&!!password2))return;run(resetPassBtn,async()=>{await apiRequest("/auth/reset-password",{method:"POST",body:JSON.stringify({email:resetEmail,code:resetCode,newPassword:password})});alert("Password updated. Please log in.");showPane("loginPane");});});
});
