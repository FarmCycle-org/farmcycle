# 🌱 FarmCycle

**FarmCycle** is a hyperlocal web platform that connects **food waste providers** (like households, cafes, and hostels) with **waste collectors** (like farmers, gardeners, NGOs). Our goal is to build a **zero-waste, sustainable ecosystem** that promotes composting and responsible waste management — one neighborhood at a time.


## 🚀 Why FarmCycle?

Every day, tons of organic waste are discarded, while compost users spend resources acquiring compost. **FarmCycle** bridges this gap through:

✅ Real-time listing of available food waste  
✅ Hyperlocal matches between providers and collectors  
✅ Role-based access and features  
✅ Organized request tracking, notifications, and history  
✅ Encouraging communities to go zero-waste 🌍

---

## ✨ Unique Features

- 🔄 **Two-sided Ecosystem**: Distinct dashboards for *Providers* and *Collectors*.
- 📍 **Hyperlocal Matching**: Easily connect with waste partners nearby.
- 🗑️ **Simple Listings**: Providers can quickly list food waste with quantity and pickup details.
- 🔔 **Notifications & History**: Track real-time requests, updates, and past activities.
- 🛡️ **Role-Based Access**: Users can register as Individuals or Organizations and access tailored features.
- 🌐 **Zero-Waste Vision**: Designed with sustainability and scalability in mind.

---

## 🖼️ Screenshots

> Add your screenshots here inside a `screenshots/` folder and link like below:

### 🔐 Authentication
![Login Page](screenshots/login.png)

### 📦 Provider Dashboard
![My Listings](screenshots/provider-listings.png)

### 🚛 Collector Dashboard
![My Requests](screenshots/collector-requests.png)

---

## 🛠️ Tech Stack

### 🔗 Full Stack MERN:
- **MongoDB** – Database for storing users, listings, and requests
- **Express.js** – Backend API server
- **React.js** – Frontend UI
- **Node.js** – Runtime for backend logic

### 🧰 Other Tools:
- **Axios** – API communication
- **Multer** – File handling (for any future images/documents)
- **Tailwind CSS** – Utility-first CSS for beautiful UI
- **Render** – Backend deployment
- **(Soon)**: Frontend deployment via Vercel or Netlify

---

## 🔧 Getting Started

### 📁 Clone the repository:
```bash
git clone https://github.com/FarmCycle-org/farmcycle.git
cd farmcycle
```

### ⚙️ Backend Setup:
```bash
cd server
npm install
npm run dev
```

### 💻 Frontend Setup:
Open a new terminal:
```bash
cd client
npm install
npm start
```

### 🔑 Environment Variables

Create a `.env` file in the `server` folder and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## 🛤️ Roadmap

- [x] Role-based auth and dashboards
- [x] Provider listing and collector request flows
- [x] Notifications and request history
- [ ] Chat or messaging between provider & collector
- [ ] Geo-based recommendations
- [ ] Admin dashboard for moderation

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss your ideas.

---

## 📃 License

This project is licensed under the MIT License.

---

## 💬 Let’s Connect

Have ideas to make FarmCycle better or want to collaborate on sustainability tech?

📩 Drop us a message at [teamfarmcycle@gmail.com](mailto:teamfarmcycle@gmail.com)

---

> **FarmCycle — turning waste into worth, one cycle at a time. ♻️**
