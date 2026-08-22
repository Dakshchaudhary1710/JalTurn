# JalTurn 💧

**FAO-56 Crop-Urgency Irrigation Engine**

JalTurn is a dynamic, data-driven water management platform built for Water User Associations (WUAs). It replaces rigid, conflict-prone time schedules with a dynamic priority queue based on the FAO-56 crop-urgency standard. By ensuring water is distributed equitably based on actual crop needs, JalTurn helps prevent upstream monopolization and ensures tail-enders get their fair share.

## 🌟 Key Features

- **Dynamic Priority Queue**: Automatically ranks farmers for water access based on real-time crop water requirements (FAO-56 guidelines), soil moisture estimates, and historical fairness.
- **Transparent Ledger**: A public, immutable history of water turns, skipped turns, and logged disputes to build trust within the community.
- **Fairness Dashboard**: Visual analytics to monitor equitable distribution across different reaches (head, middle, tail) of the canal or borewell.
- **Tie-Breaker Simulator**: Intelligent multi-tier logic to fairly resolve situations where multiple farmers have the same urgency score.
- **SMS & IVR Outreach Integration**: Built-in mock services to alert farmers of their upcoming turns via SMS or voice calls (designed for rural accessibility).
- **Dispute Resolution**: Dedicated workflows for farmers to raise issues (e.g., pump failure, upstream theft) directly on the platform.

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ORM)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Running locally or via MongoDB Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/JalTurn.git
   cd JalTurn
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file and configure your environment variables (e.g., MONGO_URI, PORT)
   npm run start
   ```
   *(The backend server will run on `http://localhost:5000` by default.)*

3. **Frontend Setup:**
   ```bash
   # Open a new terminal
   cd frontend
   npm install
   npm run dev
   ```
   *(The frontend development server will run on `http://localhost:5173`.)*

4. **Open your browser** and navigate to `http://localhost:5173` to view the application.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
*Built with ❤️ for equitable water distribution.*
