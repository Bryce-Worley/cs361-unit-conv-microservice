require('dotenv').config();


const express = require('express');
const cors = require('cors');

const app = express();

// Load environment variables from .env file for CORS or default to allowing all origins if not specified
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*';
app.use(cors({
    origin: allowedOrigins
}));

// Define unit categories for compatibility checking
const unitCategories = {
    lbs: 'weight',
    kg: 'weight',
    oz: 'weight',
    g: 'weight',
    m: 'length',
    cm: 'length',
    mm: 'length',
    in: 'length',
    ft: 'length',
    yd: 'length',
    mi: 'length',
    km: 'length',
    c: 'temperature',
    f: 'temperature',
    l: 'volume',
    ml: 'volume',
    gal: 'volume',
    floz: 'volume'
};

// Define conversion factors for each unit to a base unit
const weightInKg = {
    kg: 1,
    lbs: 0.453592,
    oz: 0.0283495,
    g: 0.001
};

const lengthInMeters = {
    m: 1,
    cm: 0.01,
    mm: 0.001,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.34,
    km: 1000
};

const tempToBase = { c: (value) => value, f: (value) => (value - 32) * 5 / 9 };
const tempFromBase = { c: (value) => value, f: (value) => (value * 9 / 5) + 32 };

const volumeInLiters = {
    l: 1,
    ml: 0.001,
    gal: 3.78541,
    floz: 0.0295735
};

app.get('/convert', (req, res) => {
    const { value, from, to } = req.query;

    // Validate arguments
    if (value === undefined || isNaN(value) || !from || !to) {
        return res.status(400).json({ error_code: 'INVALID_PARAMETERS' });
    }

    const numericValue = parseFloat(value);
    const fromUnitLower = from.toLowerCase();
    const toUnitLower = to.toLowerCase();

    // Validate units exist in the unitCategories
    if (!unitCategories[fromUnitLower] || !unitCategories[toUnitLower]) {
        return res.status(400).json({ error_code: 'INVALID_UNIT' });
    }

    // Validate units are in the same category
    if (unitCategories[fromUnitLower] !== unitCategories[toUnitLower]) {
        return res.status(400).json({ error_code: 'INCOMPATIBLE_UNITS' });
    }

    // Convert the value to the base unit
    let baseValue;
    switch (unitCategories[fromUnitLower]) {
        case 'weight':
            baseValue = weightInKg[fromUnitLower] * numericValue;
            break;
        case 'length':
            baseValue = lengthInMeters[fromUnitLower] * numericValue;
            break;
        case 'temperature':
            baseValue = tempToBase[fromUnitLower](numericValue);
            break;
        case 'volume':
            baseValue = volumeInLiters[fromUnitLower] * numericValue;
            break;
        default:
            return res.status(400).json({ error_code: 'UNKNOWN_UNIT_CATEGORY' });
    }

    // Convert the base value to the target unit
    let result;
    switch (unitCategories[toUnitLower]) {
        case 'weight':
            result = baseValue / weightInKg[toUnitLower];
            break;
        case 'length':
            result = baseValue / lengthInMeters[toUnitLower];
            break;
        case 'temperature':
            result = tempFromBase[toUnitLower](baseValue);
            break;
        case 'volume':
            result = baseValue / volumeInLiters[toUnitLower];
            break;
        default:
            return res.status(400).json({ error_code: 'UNKNOWN_UNIT_CATEGORY' });
    }

    // Format to 4 decimal places and return the result
    result = parseFloat(result.toFixed(4));

    return res.status(200).json({
        request: {
            value: numericValue,
            from: fromUnitLower,
            to: toUnitLower
        },
        result: result,
        unit: unitCategories[toUnitLower]
    });
});

// Default units setting

// Countries where imperial units are used (United States, Liberia, Myanmar)
const imperialRegions = ['US', 'LR', 'MM'];

app.get('/default-units', (req, res) => {
    const { locale } = req.query;

    if (!locale || typeof locale !== 'string') {
        return res.status(400).json({ error_code: 'INVALID_PARAMETERS' });
    }
    
    // Locale string "en-US"; region "US"; Locales with no region fall back to metric.
    const region = locale.split('-')[1]?.toUpperCase() || null;
    let units;
    if (region && imperialRegions.includes(region)) {
        units = 'imperial';
    } 
    else {
        units = 'metric';
    }
    return res.status(200).json({ locale, region, units });
});

// Use the port from the environment variable or default to 3001
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Unit conversion microservice is running on port ${PORT}`);
    console.log(`Accepting requests from: ${allowedOrigins}`);
});