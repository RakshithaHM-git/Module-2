import React, { useState } from "react";

function PreciousMetalCalculator() {
  const [city, setCity] = useState("Mumbai");
  const [metal, setMetal] = useState("XAU");
  const [grams, setGrams] = useState(1);
  const [totalPrice, setTotalPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const metals = [
    { code: "XAU", name: "Gold", color: "#FFD700" },
    { code: "XAG", name: "Silver", color: "#C0C0C0" },
    { code: "XPT", name: "Platinum", color: "#E5E4E2" },
    { code: "XPD", name: "Palladium", color: "#E7DCB8" },
    { code: "DIAMOND", name: "Diamond", color: "#B9F2FF" }
  ];

  const getCurrencyFromCity = (cityName) => {
    const cityLower = cityName.toLowerCase();
    if (cityLower.includes("india") || cityLower.includes("mumbai") || cityLower.includes("delhi") || 
        cityLower.includes("bangalore") || cityLower.includes("kolar") || cityLower.includes("chennai") ||
        cityLower.includes("tamilnadu") || cityLower.includes("karnataka") || cityLower.includes("pune")) {
      return "INR";
    }
    if (cityLower.includes("new york") || cityLower.includes("ny")) return "USD";
    if (cityLower.includes("london")) return "GBP";
    if (cityLower.includes("dubai")) return "AED";
    if (cityLower.includes("singapore")) return "SGD";
    if (cityLower.includes("tokyo")) return "JPY";
    return "INR";
  };

  const getPrice = async () => {
    setLoading(true);
    setTotalPrice(null);

    const currency = getCurrencyFromCity(city);
    const API_KEY = "f5ce53418b13a3cc9065c6351942d32e";

    // Diamond pricing
    if (metal === "DIAMOND") {
      const pricePerCarat = currency === "INR" ? 650000 : 5500;
      const gramsPerCarat = 0.2;
      const pricePerGram = pricePerCarat / gramsPerCarat;
      const finalPrice = pricePerGram * Number(grams);
      setTotalPrice(finalPrice.toLocaleString("en-IN"));
      setLoading(false);
      return;
    }

    // REAL INDIA RETAIL PRICES (Feb 2026)
    if (currency === "INR") {
      const retailPrices = {
        XAU: 14700,  // Gold ₹14,700 per gram
        XAG: 95,     // Silver ₹95 per gram  
        XPT: 2900,   // Platinum ₹2,900 per gram
        XPD: 2800    // Palladium ₹2,800 per gram
      };
      const finalPrice = retailPrices[metal] * Number(grams);
      setTotalPrice(finalPrice.toLocaleString("en-IN"));
      setLoading(false);
      return;
    }

    // International currencies - API call
    try {
      const response = await fetch(
        `https://api.metalpriceapi.com/v1/latest?api_key=${API_KEY}&base=${currency}&currencies=${metal}`
      );
      
      if (!response.ok) {
        throw new Error('API failed');
      }
      
      const data = await response.json();
      
      if (data.rates && data.rates[metal]) {
        const rate = data.rates[metal];
        const pricePerOunce = 1 / rate;
        const pricePerGram = pricePerOunce / 31.1035;
        const finalPrice = pricePerGram * Number(grams);
        setTotalPrice(finalPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 }));
      } else {
        throw new Error('No rates found');
      }
    } catch (error) {
      console.log("API Error - using fallback");
      // Fallback for international
      const fallback = { XAU: 85, XAG: 1.0, XPT: 33, XPD: 31 };
      const finalPrice = fallback[metal] * Number(grams);
      setTotalPrice(finalPrice.toLocaleString("en-IN", { maximumFractionDigits: 2 }));
    } finally {
      setLoading(false);
    }
  };

  const selectedMetal = metals.find(m => m.code === metal);
  const metalColor = selectedMetal ? selectedMetal.color : "#FFD700";
  const currency = getCurrencyFromCity(city);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "20px",
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h1 style={{
        color: "white",
        textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
        marginBottom: "40px",
        fontSize: "2.5em"
      }}>
        Precious Metal Calculator
      </h1>

      <div style={{
        background: "rgba(255,255,255,0.95)",
        borderRadius: "20px",
        padding: "40px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        maxWidth: "500px",
        width: "100%"
      }}>
        {/* City Input */}
        <div style={{ marginBottom: "25px" }}>
          <label style={{
            display: "block", color: "#555", fontWeight: "600",
            marginBottom: "10px", fontSize: "1.1em"
          }}>
            🏙️ 1. Enter City
          </label>
          <input 
            type="text" 
            value={city} 
            onChange={e => setCity(e.target.value)}
            placeholder="Kolar, Mumbai, Bangalore, New York..."
            style={{
              width: "100%", 
              padding: "15px", 
              border: `2px solid ${metalColor}`,
              borderRadius: "12px", 
              fontSize: "1.1em", 
              background: "white"
            }} 
          />
        </div>

        {/* Metal Select */}
        <div style={{ marginBottom: "25px" }}>
          <label style={{
            display: "block", color: "#555", fontWeight: "600",
            marginBottom: "10px", fontSize: "1.1em"
          }}>
            💎 2. Metal/Gem
          </label>
          <select 
            value={metal} 
            onChange={e => setMetal(e.target.value)} 
            style={{
              width: "100%", 
              padding: "15px", 
              border: `2px solid ${metalColor}`,
              borderRadius: "12px", 
              fontSize: "1.1em", 
              background: "white",
              cursor: "pointer"
            }}
          >
            {metals.map(m => (
              <option key={m.code} value={m.code}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Grams Input */}
        <div style={{ marginBottom: "30px" }}>
          <label style={{
            display: "block", color: "#555", fontWeight: "600",
            marginBottom: "10px", fontSize: "1.1em"
          }}>
            ⚖️ 3. Weight (grams)
          </label>
          <input 
            type="number" 
            value={grams} 
            onChange={e => setGrams(e.target.value)}
            min="0.01" 
            step="0.01" 
            style={{
              width: "100%", 
              padding: "15px", 
              border: `2px solid ${metalColor}`,
              borderRadius: "12px", 
              fontSize: "1.1em", 
              textAlign: "center"
            }} 
          />
        </div>

        {/* Calculate Button */}
        <button 
          onClick={getPrice} 
          disabled={loading}
          style={{
            width: "100%", 
            padding: "18px", 
            background: `linear-gradient(45deg, ${metalColor}, ${metalColor}ee)`,
            color: "white", 
            border: "none", 
            borderRadius: "12px",
            fontSize: "1.2em", 
            fontWeight: "700", 
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "🔄 Calculating..." : `💰 Calculate ${selectedMetal?.name}`}
        </button>

        {/* Result */}
        {totalPrice !== null && (
          <div style={{
            marginTop: "30px", 
            padding: "25px", 
            background: `${metalColor}20`, 
            borderRadius: "15px",
            border: `2px solid ${metalColor}`, 
            textAlign: "center"
          }}>
            <h3 style={{
              color: metalColor, 
              margin: 0, 
              fontSize: "1.8em", 
              fontWeight: "800"
            }}>
              {currency === "INR" ? "₹" + totalPrice : totalPrice + " " + currency}
            </h3>
            <p style={{ 
              color: "#666", 
              margin: "10px 0 0 0", 
              fontSize: "1.1em" 
            }}>
              {city} • {grams}g • {selectedMetal?.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PreciousMetalCalculator;
