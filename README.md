# Nook.

**Your word is the only currency.**

Nook is an immutable public ledger for personal commitments. It is designed to cure procrastination by leveraging the most powerful motivator in human history: **the fear of public failure.**

### The Problem

Talk is cheap. To-do lists are private. When you break a promise to yourself, nobody knows. Without consequences, discipline crumbles.

### The Solution

Nook removes the safety net.

1. **Declare:** You publish a commitment with a strict deadline.
2. **Lock:** Once published, **it cannot be edited or deleted.** Typos, regrets, and ambitious goals are permanent.
3. **Witness:** There are no likes. No comments. Only a "Witness Counter" showing how many people are watching you.
4. **The Reaper:** If the deadline passes without resolution, the system automatically marks the commitment as **BROKEN**. This stain remains on your profile forever.

You do the work not for the dopamine of a "like," but to avoid the shame of a red "Broken" badge on your permanent record.

---

### Tech Stack

**Frontend (The Face)**

* **Next.js 14** (App Router, Server Components)
* **Tailwind CSS** ("Paper" Design System, Editorial Typography)
* **Lucide React** (Minimalist Iconography)

**Backend (The Brain)**

* **FastAPI** (High-performance Python API)
* **SQLAlchemy** (ORM)
* **Firebase Auth** (Identity Management)
* **PostgreSQL (Supabase)** (The Immutable Ledger)

---

### Mechanics

**Immutable Design**
The database has no `UPDATE` or `DELETE` endpoints for commitment text. Once a record is sealed (`POST`), it exists until the database is destroyed.

**The Reaper Protocol**
A background process runs periodically to check for expired deadlines.
`IF (status == 'pending' AND now > deadline) -> SET status = 'broken'`

**Passive Witnessing**
Interaction is limited to viewing. This removes the dopamine feedback loop of social media, leaving only pure, high-stakes accountability.

---

### Setup & Run

**1. Clone & Install**

```bash
git clone https://github.com/yourusername/nook.git
cd nook
npm install          # Frontend dependencies
pip install -r requirements.txt  # Backend dependencies

```

**2. Environment Variables**
Create a `.env` file with your credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
DATABASE_URL=postgresql://...

```

**3. Ignite System**

```bash
# Terminal 1: The Brain
uvicorn main:app --reload

# Terminal 2: The Face
npm run dev

```

---

*Built for those who value their reputation.*
