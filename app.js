const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 


const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

// Middleware for handling invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            is_success: false,
            message: "Invalid JSON format"
        });
    }
    next();
});

// POST method endpoint
app.post('/bfhl', (req, res) => {
    try {
        const data = req.body.data;

        if (!Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                message: "Invalid request format: 'data' should be an array"
            });
        }

        const numbers = [];
        const alphabets = [];
        let highestLowercaseAlphabet = '';

        data.forEach(item => {
            if (!isNaN(item)) {
                numbers.push(item);
            } else if (typeof item === 'string' && /^[a-zA-Z]$/.test(item)) {
                alphabets.push(item);
                if (item === item.toLowerCase() && (highestLowercaseAlphabet === '' || item > highestLowercaseAlphabet)) {
                    highestLowercaseAlphabet = item;
                }
            }
        });

        const response = {
            is_success: true,
            user_id: "Vishwa_Shivanand_Appaji_06082002",
            email: "vishwa.shivanand2021@vitstudent.ac.in",
            roll_number: "21BCI0026",
            numbers: numbers,
            alphabets: alphabets,
            highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : []
        };
    
        res.json(response);
    } catch (error) {
        // Handle any unexpected errors
        res.status(500).json({
            is_success: false,
            message: "An unexpected error occurred",
            error: error.message
        });
    }
});


app.get('/bfhl', (req, res) => {
    const response = {
        operation_code: 1
    };

    res.status(200).json(response);
});

app.use((req, res) => {
    res.status(404).json({
        is_success: false,
        message: "Endpoint not found"
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        is_success: false,
        message: "An unexpected error occurred",
        error: err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
