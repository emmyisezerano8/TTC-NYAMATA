const AUTH_KEY="ttcAdminSession";
const NEWS_KEY="ttcNews";
const EVENTS_KEY="ttcEvents";
const MSG_KEY="ttcMessages";

const defaultNews=[
{id:"default-news-1",title:"New academic year brings new opportunities",category:"School News",description:"Discover the latest developments and opportunities available to students this academic year.",image:"https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80",date:"2026-09-12"},
{id:"default-news-2",title:"Students explore technology and innovation",category:"Innovation",description:"Students continue developing digital solutions and innovative approaches to learning.",image:"https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",date:"2026-09-20"},
{id:"default-news-3",title:"TTC community joins educational outreach",category:"Community",description:"Students and educators participate in activities that strengthen relationships with the community.",image:"https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80",date:"2026-09-28"}
];
const defaultEvents=[
{id:"default-event-1",title:"Students Orientation",date:"2026-09-18",time:"08:00 AM",location:"Main Campus",description:"New student orientation and welcome activities."},
{id:"default-event-2",title:"Teachers Development Workshop",date:"2026-09-25",time:"09:00 AM",location:"ICT Hall",description:"Professional development workshop for teaching staff."},
{id:"default-event-3",title:"Sports & Community Day",date:"2026-10-04",time:"08:30 AM",location:"School Grounds",description:"Sports, teamwork and community activities."},
{id:"default-event-4",title:"Parents & School Meeting",date:"2026-10-15",time:"10:00 AM",location:"Assembly Hall",description:"School-community meeting with parents and guardians."}
];

const $=id=>document.getElementById(id);
const read=(key, fallback)=>{try{const v=JSON.parse(localStorage.getItem(key));if(v===null){localStorage.setItem(key,JSON.stringify(fallback));return fallback}return v}catch{return fallback}};
const write=(key,val)=>localStorage.setItem(key,JSON.stringify(val));
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const dateText=d=>new Date(d+"T00:00:00").toLocaleDateString("en-US",{day:"2-digit",month:"short",year:"numeric"});

function seed(){
    if(!localStorage.getItem(NEWS_KEY)) write(NEWS_KEY,defaultNews);
    if(!localStorage.getItem(EVENTS_KEY)) write(EVENTS_KEY,defaultEvents);
    if(!localStorage.getItem(MSG_KEY)) write(MSG_KEY,[]);
}
seed();

function showSection(id){
    document.querySelectorAll(".admin-section").forEach(s=>s.classList.remove("active"));
    $(id).classList.add("active");
    document.querySelectorAll(".side-link").forEach(b=>b.classList.toggle("active",b.dataset.section===id));
    const titles={overview:"Dashboard",newsManager:"News Management",eventsManager:"Event Management",messagesManager:"Contact Messages"};
    $("pageTitle").textContent=titles[id]||"Dashboard";
    refresh();
}

function refresh(){
    const news=read(NEWS_KEY,defaultNews), events=read(EVENTS_KEY,defaultEvents), messages=read(MSG_KEY,[]);
    $("newsCount").textContent=news.length;
    $("eventCount").textContent=events.length;
    $("messageCount").textContent=messages.length;
    $("unreadCount").textContent=messages.filter(m=>m.status==="unread").length;
    const badge=$("messageBadge");
    if(badge) badge.textContent=messages.filter(m=>m.status==="unread").length;
    renderNews(news); renderEvents(events); renderMessages(messages); renderRecent(messages);
}

function renderNews(items){
    $("newsList").innerHTML=items.map(n=>`
    <div class="content-item">
      <div class="item-main">
        <img class="thumb" src="${esc(n.image||"image.png")}" alt="">
        <div><h3>${esc(n.title)}</h3><p>${esc(n.category)} • ${dateText(n.date)}</p><p>${esc(n.description)}</p></div>
      </div>
      <div class="item-actions">
        <button class="secondary" onclick="editNews('${n.id}')">Edit</button>
        <button class="danger" onclick="deleteNews('${n.id}')">Delete</button>
      </div>
    </div>`).join("")||"<div class='content-item'>No news published.</div>";
}

function renderEvents(items){
    $("eventList").innerHTML=items.map(e=>`
    <div class="content-item">
      <div class="item-main">
        <div class="thumb" style="display:grid;place-items:center;font-size:22px">📅</div>
        <div><h3>${esc(e.title)}</h3><p>${dateText(e.date)} • ${esc(e.time)} • ${esc(e.location)}</p><p>${esc(e.description)}</p></div>
      </div>
      <div class="item-actions">
        <button class="secondary" onclick="editEvent('${e.id}')">Edit</button>
        <button class="danger" onclick="deleteEvent('${e.id}')">Delete</button>
      </div>
    </div>`).join("")||"<div class='content-item'>No events scheduled.</div>";
}

function messageCard(m){
    return `<div class="message-item ${m.status==="unread"?"unread":""}">
      <div class="message-top"><strong>${esc(m.name)} &lt;${esc(m.email)}&gt;</strong><small>${new Date(m.date).toLocaleString()}</small></div>
      <div class="message-subject">${esc(m.subject)}</div>
      <p class="message-text">${esc(m.message)}</p>
      ${m.reply?`<p style="margin-top:10px"><b>Your reply:</b> ${esc(m.reply)}</p>`:""}
      <div class="message-actions">
        <button class="primary" onclick="openReply('${m.id}')">${m.reply?"Reply Again":"Reply"}</button>
        <button class="secondary" onclick="toggleRead('${m.id}')">${m.status==="unread"?"Mark Read":"Mark Unread"}</button>
        <button class="danger" onclick="deleteMessage('${m.id}')">Delete</button>
      </div>
    </div>`;
}
function renderMessages(items){$("messageList").innerHTML=items.map(messageCard).join("")||"<div class='message-item'>Your inbox is empty.</div>"}
function renderRecent(items){$("recentMessages").innerHTML=items.slice(0,4).map(messageCard).join("")||"<div class='message-item'>No messages yet.</div>"}

$("loginForm").addEventListener("submit",e=>{
    e.preventDefault();
    if($("adminUser").value.trim()==="admin" && $("adminPass").value==="Admin@123"){
        sessionStorage.setItem(AUTH_KEY,""); openDashboard();
    }else $("loginError").textContent="Invalid administrator username or password.";
});
function openDashboard(){ $("loginScreen").classList.add("hidden"); $("dashboard").classList.remove("hidden"); refresh(); updateTime(); }
function logout(){sessionStorage.removeItem(AUTH_KEY);location.reload()}
$("logoutBtn").addEventListener("click",logout);
if(sessionStorage.getItem(AUTH_KEY)==="") openDashboard();

document.querySelectorAll(".side-link").forEach(b=>b.addEventListener("click",()=>showSection(b.dataset.section)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showSection(b.dataset.go)));
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>$(b.dataset.close).classList.add("hidden")));

function openNewsEditor(item=null){
    $("newsEditor").classList.remove("hidden");
    $("newsEditorTitle").textContent=item?"Edit News":"Create News";
    $("newsId").value=item?.id||"";
    $("newsTitle").value=item?.title||"";
    $("newsCategory").value=item?.category||"School News";
    $("newsImage").value=item?.image||"";
    $("newsDate").value=item?.date||new Date().toISOString().slice(0,10);
    $("newsDescription").value=item?.description||"";
}
$("newNewsBtn").addEventListener("click",()=>openNewsEditor());
window.editNews=id=>openNewsEditor(read(NEWS_KEY,defaultNews).find(x=>x.id===id));
window.deleteNews=id=>{if(confirm("Delete this news item?")){write(NEWS_KEY,read(NEWS_KEY,defaultNews).filter(x=>x.id!==id));refresh()}};
$("newsForm").addEventListener("submit",e=>{
    e.preventDefault();
    const items=read(NEWS_KEY,defaultNews), id=$("newsId").value||"news-"+Date.now();
    const item={id,title:$("newsTitle").value.trim(),category:$("newsCategory").value.trim(),image:$("newsImage").value.trim()||"image.png",date:$("newsDate").value,description:$("newsDescription").value.trim()};
    const index=items.findIndex(x=>x.id===id); if(index>=0)items[index]=item;else items.unshift(item);
    write(NEWS_KEY,items); $("newsEditor").classList.add("hidden"); refresh();
});

function openEventEditor(item=null){
    $("eventEditor").classList.remove("hidden");
    $("eventEditorTitle").textContent=item?"Edit Event":"Create Event";
    $("eventId").value=item?.id||"";
    $("eventTitle").value=item?.title||"";
    $("eventDate").value=item?.date||new Date().toISOString().slice(0,10);
    $("eventTime").value=item?.time||"08:00 AM";
    $("eventLocation").value=item?.location||"Main Campus";
    $("eventDescription").value=item?.description||"";
}
$("newEventBtn").addEventListener("click",()=>openEventEditor());
window.editEvent=id=>openEventEditor(read(EVENTS_KEY,defaultEvents).find(x=>x.id===id));
window.deleteEvent=id=>{if(confirm("Delete this event?")){write(EVENTS_KEY,read(EVENTS_KEY,defaultEvents).filter(x=>x.id!==id));refresh()}};
$("eventForm").addEventListener("submit",e=>{
    e.preventDefault();
    const items=read(EVENTS_KEY,defaultEvents), id=$("eventId").value||"event-"+Date.now();
    const item={id,title:$("eventTitle").value.trim(),date:$("eventDate").value,time:$("eventTime").value.trim(),location:$("eventLocation").value.trim(),description:$("eventDescription").value.trim()};
    const index=items.findIndex(x=>x.id===id); if(index>=0)items[index]=item;else items.push(item);
    write(EVENTS_KEY,items); $("eventEditor").classList.add("hidden"); refresh();
});

window.toggleRead=id=>{
    const items=read(MSG_KEY,[]),m=items.find(x=>String(x.id)===String(id));if(m)m.status=m.status==="unread"?"read":"unread";write(MSG_KEY,items);refresh();
};
window.deleteMessage=id=>{if(confirm("Delete this message?")){write(MSG_KEY,read(MSG_KEY,[]).filter(x=>String(x.id)!==String(id)));refresh()}};
$("clearMessagesBtn").addEventListener("click",()=>{if(confirm("Delete ALL contact messages?")){write(MSG_KEY,[]);refresh()}});

let currentReply=null;
window.openReply=id=>{
    const m=read(MSG_KEY,[]).find(x=>String(x.id)===String(id));if(!m)return;
    currentReply=m;$("replyEditor").classList.remove("hidden");
    $("replyTo").innerHTML=`<b>${esc(m.name)}</b> — ${esc(m.email)}<br><b>Subject:</b> ${esc(m.subject)}`;
    $("replyText").value=m.reply||"";
    const items=read(MSG_KEY,[]),found=items.find(x=>String(x.id)===String(id));if(found)found.status="read";write(MSG_KEY,items);refresh();
};
$("copyReplyBtn").addEventListener("click",async()=>{
    await navigator.clipboard.writeText($("replyText").value);alert("Reply copied to clipboard.");
});
$("sendEmailBtn").addEventListener("click",()=>{
    if(!currentReply)return;
    const reply=$("replyText").value.trim(); if(!reply){alert("Write a reply first.");return}
    const items=read(MSG_KEY,[]),m=items.find(x=>String(x.id)===String(currentReply.id));if(m)m.reply=reply;write(MSG_KEY,items);refresh();
    location.href=`mailto:${encodeURIComponent(currentReply.email)}?subject=${encodeURIComponent("Re: "+currentReply.subject)}&body=${encodeURIComponent(reply)}`;
});

function updateTime(){
    $("adminTime").textContent=new Date().toLocaleString();
}
setInterval(updateTime,1000);
