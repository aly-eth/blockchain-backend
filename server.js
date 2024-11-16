const express = require("express");
//const { ethers } = require("ethers");
const cors = require("cors");
const {ethers, JsonRpcProvider}= require ("ethers")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Contrato Inteligente
const CONTRACT_ADDRESS = "0x591f91c42cdb2cd5230982596d067434ebcc3ed7";
const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "startDate", type: "uint256" },
      { internalType: "uint256", name: "endDate", type: "uint256" },
    ],
    name: "checkAvailability",
    outputs: [{ internalType: "bool", name: "available", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

// Conexión al proveedor (puedes usar Infura, Alchemy, etc.)
const provider = new ethers.providers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

// Ruta para verificar disponibilidad
app.post("/check-availability", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: "startDate and endDate are required." });
    }

    const available = await contract.checkAvailability(
      Math.floor(new Date(startDate).getTime() / 1000),
      Math.floor(new Date(endDate).getTime() / 1000)
    );

    res.json({ available });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
