# FormSathi — Your Future, Your Opportunity

A multilingual (English, Bengali, Hindi) full-stack student opportunity discovery prototype.

## Features
- Responsive student-facing website
- Language switcher (English / বাংলা / हिन्दी)
- Scholarship, internship, job and learning opportunity directory
- Backend eligibility-check API with criteria breakdown
- Demo application form saved to `data/applications.json`
- Links to official opportunity and learning provider websites

## Tech stack
- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js + Express
- Storage: JSON file for prototype application records

## Run locally
1. Install Node.js (LTS).
2. Open this folder in VS Code.
3. Open Terminal and run:

   ```bash
   npm install
   npm start
   ```

4. Open `http://localhost:3000`.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check server |
| GET | `/api/opportunities` | List opportunities |
| GET | `/api/opportunities?type=scholarship` | Filter by type |
| POST | `/api/eligibility` | Check indicative eligibility |
| POST | `/api/applications` | Save a demo application |
| GET | `/api/applications` | View saved demo applications |

### Eligibility request example
```json
{
  "marks": 75,
  "income": 250000,
  "course": "BTech",
  "state": "West Bengal"
}
```

## Important prototype limitations
- Eligibility results are indicative and use sample rules in `server.js`. They are not an official eligibility decision. Update criteria only from current official notifications.
- The Apply flow saves a local demo application. It does **not** submit an application to a scholarship authority, employer or internship provider.
- Live listings, deadlines, document upload, student accounts, secure authentication, production database and admin verification are future development tasks.
- Do not collect real sensitive student documents or personal information in this prototype.

## GitHub upload
Create a new public repository named `formsathi`, then from this folder run:

```bash
git init
git add .
git commit -m "Build FormSathi student opportunity platform"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/formsathi.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. Never upload passwords, API keys or private student data.
