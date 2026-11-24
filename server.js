const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const DATA = path.join(__dirname, "data");
const applicationsFile = path.join(DATA, "applications.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readApplications() {
  try { return JSON.parse(fs.readFileSync(applicationsFile, "utf8")); }
  catch { return []; }
}
function saveApplications(items) {
  fs.mkdirSync(DATA, { recursive: true });
  fs.writeFileSync(applicationsFile, JSON.stringify(items, null, 2));
}

const opportunities = [
  {id:"sch-001",type:"scholarship",title:"National Scholarship Portal (NSP)",provider:"Government of India",amount:"Varies by scheme",deadline:"Check official portal",level:"School & College",description:"Explore central and state scholarship schemes. Eligibility differs by scheme.",link:"https://scholarships.gov.in",criteria:{minMarks:50,maxIncome:800000,states:["ALL"],courses:["ALL"]}},
  {id:"sch-002",type:"scholarship",title:"AICTE Pragati Scholarship",provider:"AICTE",amount:"As per current scheme",deadline:"Check official notification",level:"Technical education",description:"Scholarship scheme for eligible girl students pursuing technical education. Verify current rules and seat limits.",link:"https://www.aicte-india.org",criteria:{minMarks:60,maxIncome:800000,states:["ALL"],courses:["BTech","Diploma"]}},
  {id:"int-001",type:"internship",title:"AI & Data Science Internship Search",provider:"Opportunity discovery",amount:"Paid / unpaid (varies)",deadline:"Rolling opportunities",level:"Beginner to intermediate",description:"Find internships, build a portfolio and check each employer's requirements before applying.",link:"https://internshala.com",criteria:{minMarks:0,maxIncome:99999999,states:["ALL"],courses:["ALL"]}},
  {id:"job-001",type:"job",title:"National Career Service",provider:"Ministry of Labour & Employment",amount:"As per vacancy",deadline:"Depends on vacancy",level:"Students & job seekers",description:"Search verified employment and career opportunities. Read each vacancy's age and qualification rules.",link:"https://www.ncs.gov.in",criteria:{minMarks:0,maxIncome:99999999,states:["ALL"],courses:["ALL"]}},
  {id:"learn-001",type:"learning",title:"SWAYAM Online Courses",provider:"Government of India",amount:"Free learning options",deadline:"Course dependent",level:"All learners",description:"Explore online courses across engineering, science, humanities and professional skills.",link:"https://swayam.gov.in",criteria:{minMarks:0,maxIncome:99999999,states:["ALL"],courses:["ALL"]}},
  {id:"learn-002",type:"learning",title:"NPTEL Courses",provider:"IITs & IISc",amount:"Free to learn; exam may be paid",deadline:"Course dependent",level:"College students",description:"Learn programming, computer science, engineering and other subjects.",link:"https://nptel.ac.in",criteria:{minMarks:0,maxIncome:99999999,states:["ALL"],courses:["ALL"]}}
];

app.get("/api/health", (req,res) => res.json({status:"ok",service:"FormSathi API"}));
app.get("/api/opportunities", (req,res) => {
  const type = req.query.type;
  res.json(type ? opportunities.filter(x => x.type === type) : opportunities);
});
app.post("/api/eligibility", (req,res) => {
  const {marks, income, course, state} = req.body;
  if ([marks,income].some(v => v === undefined || v === "" ) || !course || !state)
    return res.status(400).json({error:"Please complete all required fields."});
  const m = Number(marks), inc = Number(income);
  if (!Number.isFinite(m) || !Number.isFinite(inc) || m < 0 || m > 100 || inc < 0)
    return res.status(400).json({error:"Enter valid marks (0–100) and annual family income."});
  const results = opportunities.filter(o => o.type === "scholarship").map(o => {
    const c = o.criteria;
    const checks = [
      {label:"Academic marks",pass:m >= c.minMarks,detail:`Minimum ${c.minMarks}%`},
      {label:"Family income",pass:inc <= c.maxIncome,detail:`Maximum ₹${c.maxIncome.toLocaleString("en-IN")}`},
      {label:"Course",pass:c.courses.includes("ALL") || c.courses.includes(course),detail:"Course criteria"},
      {label:"State",pass:c.states.includes("ALL") || c.states.includes(state),detail:"State criteria"}
    ];
    const eligible = checks.every(x => x.pass);
    return {id:o.id,title:o.title,provider:o.provider,link:o.link,status:eligible?"Potential match":"May not qualify",eligible,checks,notice:"Indicative result only. Confirm the latest official notification and detailed criteria before applying."};
  });
  res.json({results});
});
app.post("/api/applications", (req,res) => {
  const {name,email,opportunityId,message} = req.body;
  if (!name || !email || !opportunityId) return res.status(400).json({error:"Name, email and opportunity are required."});
  const opportunity = opportunities.find(x => x.id === opportunityId);
  if (!opportunity) return res.status(404).json({error:"Opportunity not found."});
  const items = readApplications();
  const item = {id:"FS-"+Date.now(),name,email,opportunityId,title:opportunity.title,message:message||"",status:"Saved in demo portal",createdAt:new Date().toISOString()};
  items.unshift(item); saveApplications(items);
  res.status(201).json({message:"Your demo application has been saved.",application:item});
});
app.get("/api/applications", (req,res) => res.json(readApplications()));
app.get("*", (req,res) => res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT, () => console.log(`FormSathi running at http://localhost:${PORT}`));
